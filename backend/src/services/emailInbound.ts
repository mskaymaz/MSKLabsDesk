/**
 * MSKLabsDesk — Cloudflare Email Routing Inbound Handler (COM-INBOUND-001)
 * Gelen e-postaları yakalayıp D1 messages tablosuna destek bileti olarak işler.
 * $0/Ay sıfır maliyet, Workers Email Event mimarisi.
 */

import { AIEnv, analyzeSupportTicketWithAI } from '../utils/ai';
import { generateTicketId } from '../routes/support';

export interface InboundEmailMessage {
  from: string;
  to: string;
  headers?: {
    get(name: string): string | null;
  };
  raw?: ReadableStream<Uint8Array>;
  text?: string;
  forward?(destination: string): Promise<void>;
  setReject?(reason: string): void;
}

/**
 * ReadableStream'den metin okur (Maksimum 64 KB güvenlik sınırı)
 */
export async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
      if (result.length > 65536) {
        break; // Bellek koruması
      }
    }
    result += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return result;
}

/**
 * Gönderici adını header veya e-posta adresinden ayrıştırır
 */
export function extractSenderName(fromHeader: string | null, fromEmail: string): string {
  if (fromHeader) {
    const match = fromHeader.match(/^"?([^"<]+)"?\s*<.+>$/);
    if (match && match[1]?.trim()) {
      return match[1].trim();
    }
  }
  const emailPrefix = fromEmail.split('@')[0] || 'Kullanıcı';
  return emailPrefix
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Ham RFC-822 / MIME formatından gövde metnini ayıklar
 */
export function extractEmailBody(rawEmail: string): string {
  if (!rawEmail) return '(E-posta içeriği boş)';

  // Header ve body ayrımı (ilk çift yeni satır)
  const headerEndPos = rawEmail.search(/\r?\n\r?\n/);
  const rawBody = headerEndPos !== -1 ? rawEmail.slice(headerEndPos).trim() : rawEmail.trim();

  // Basit multipart boundary temizliği
  const cleaned = rawBody
    .replace(/--[a-zA-Z0-9_-]+(--)?/g, '')
    .replace(/Content-Type:[^\n]+/gi, '')
    .replace(/Content-Transfer-Encoding:[^\n]+/gi, '')
    .replace(/charset=[^\n]+/gi, '')
    .replace(/<[^>]+>/g, ' ') // HTML etiketlerini ayıkla
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.slice(0, 3000) || '(E-posta gövdesi okundu)';
}

/**
 * Cloudflare Worker email handler entegrasyonu
 */
export async function handleInboundEmail(
  message: InboundEmailMessage,
  env: { DB: D1Database } & AIEnv,
  _ctx?: ExecutionContext
): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  try {
    const senderEmail = (message.from || '').trim().toLowerCase();
    if (!senderEmail || !senderEmail.includes('@')) {
      return { success: false, error: 'Geçersiz gönderici e-posta adresi.' };
    }

    const fromHeader = message.headers?.get('from') || null;
    const senderName = extractSenderName(fromHeader, senderEmail);
    const subject = (message.headers?.get('subject') || '(Konu Belirtilmedi)').trim();

    let emailBody = '';
    if (typeof message.text === 'string' && message.text) {
      emailBody = message.text.trim();
    } else if (message.raw) {
      const rawText = await streamToText(message.raw);
      emailBody = extractEmailBody(rawText);
    } else {
      emailBody = '(İçerik belirtilmedi)';
    }

    const ticketId = generateTicketId();

    // Opsiyonel Gemini AI analizi
    let aiSummary: string | null = null;
    let aiDraft: string | null = null;
    let urgency = 'medium';

    try {
      const aiRes = await analyzeSupportTicketWithAI(
        {
          id: ticketId,
          sender_name: senderName,
          subject,
          content: emailBody,
          category: 'general',
        },
        env
      );
      if (aiRes) {
        aiSummary = aiRes.summary;
        aiDraft = aiRes.draft_response;
        urgency = aiRes.urgency;
      }
    } catch (aiErr) {
      console.warn('[AI EMAIL ANALYSIS WARNING]', aiErr);
    }

    // D1 Veritabanına Destek Bileti Olarak Kayıt (category = 'email')
    await env.DB.prepare(`
      INSERT INTO messages (id, sender_name, sender_email, subject, content, category, status, urgency, ai_summary, ai_draft, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'email', 'open', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      ticketId,
      senderName,
      senderEmail,
      subject,
      emailBody,
      urgency,
      aiSummary,
      aiDraft
    ).run();

    // Audit Event Kaydı
    try {
      await env.DB.prepare(`
        INSERT INTO message_events (message_id, actor, action, details, created_at)
        VALUES (?, 'SYSTEM_EMAIL_ROUTING', 'EMAIL_TICKET_CREATED', ?, CURRENT_TIMESTAMP)
      `).bind(
        ticketId,
        JSON.stringify({ to: message.to, from: senderEmail, subject })
      ).run();
    } catch {
      // Event log hatası bilet kaydını bozmamalı
    }

    return { success: true, ticketId };
  } catch (err: any) {
    console.error('[INBOUND EMAIL PROCESSING ERROR]', err);
    return { success: false, error: err.message || 'E-posta işleme hatası.' };
  }
}
