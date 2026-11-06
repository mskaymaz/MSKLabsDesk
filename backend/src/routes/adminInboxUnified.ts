/**
 * MSKLabsDesk — Birleşik Bildirim & Mesajlaşma Merkezi (Inbox Hub)
 * GET /api/v1/inbox/unified & GET /api/admin/inbox/unified
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

export interface UnifiedInboxItem {
  id: string;
  type: 'ticket' | 'email' | 'comment';
  title: string;
  sender_name: string;
  sender_email: string;
  snippet: string;
  status: string;
  urgency?: string;
  category?: string;
  target_route: 'tickets' | 'comments';
  created_at: string;
}

export interface UnifiedInboxResponse {
  success: boolean;
  counts: {
    total_unread: number;
    tickets: number;
    emails: number;
    comments: number;
  };
  items: UnifiedInboxItem[];
}

export async function handleAdminGetUnifiedInbox(
  request: Request,
  env: { DB: D1Database } & AuthEnv
): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const filterType = url.searchParams.get('type'); // 'all' | 'ticket' | 'email' | 'comment'
  const limitParam = parseInt(url.searchParams.get('limit') || '40', 10);
  const limit = Math.min(Math.max(limitParam, 10), 100);

  try {
    // 1. Destek Biletleri ve Kurumsal Gelen E-Postalar (messages)
    const { results: rawMessages } = await env.DB.prepare(`
      SELECT 
        id, 
        sender_name, 
        sender_email, 
        subject, 
        content, 
        category, 
        status, 
        urgency, 
        ai_summary, 
        created_at 
      FROM messages 
      WHERE status IN ('new', 'open', 'in_progress')
      ORDER BY created_at DESC 
      LIMIT ?
    `).bind(limit).all();

    // 2. Blog Moderasyon Bekleyen Yorumlar (comments)
    const { results: rawComments } = await env.DB.prepare(`
      SELECT 
        id, 
        post_slug, 
        author_name, 
        author_email, 
        content, 
        status, 
        created_at 
      FROM comments 
      WHERE status IN ('pending', 'unverified')
      ORDER BY created_at DESC 
      LIMIT ?
    `).bind(limit).all();

    // 3. Sayım ve İstatistikler
    let ticketsCount = 0;
    let emailsCount = 0;
    const commentsCount = (rawComments || []).length;

    const items: UnifiedInboxItem[] = [];

    // Mesajları ve E-postaları Birleştir
    for (const m of (rawMessages || [])) {
      const isEmail = m.category === 'email';
      if (isEmail) {
        emailsCount++;
      } else {
        ticketsCount++;
      }

      const snippet = String(m.ai_summary || m.content || '').replace(/\s+/g, ' ').trim().slice(0, 140);

      items.push({
        id: String(m.id),
        type: isEmail ? 'email' : 'ticket',
        title: String(m.subject || (isEmail ? 'Gelen E-Posta' : 'Destek Talebi')),
        sender_name: String(m.sender_name || 'Bilinmeyen Gönderici'),
        sender_email: String(m.sender_email || ''),
        snippet: snippet || '(İçerik belirtilmedi)',
        status: String(m.status || 'new'),
        urgency: m.urgency ? String(m.urgency) : undefined,
        category: m.category ? String(m.category) : undefined,
        target_route: 'tickets',
        created_at: String(m.created_at),
      });
    }

    // Yorumları Birleştir
    for (const c of (rawComments || [])) {
      const snippet = String(c.content || '').replace(/\s+/g, ' ').trim().slice(0, 140);

      items.push({
        id: String(c.id),
        type: 'comment',
        title: `${String(c.post_slug || 'Blog')} Yazısına Yorum`,
        sender_name: String(c.author_name || 'Ziyaretçi'),
        sender_email: String(c.author_email || ''),
        snippet: snippet || '(Yorum metni belirtilmedi)',
        status: String(c.status || 'pending'),
        target_route: 'comments',
        created_at: String(c.created_at),
      });
    }

    // Tarihe Göre Yeniden Eskiye Sırala
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Opsiyonel Tür Filtresi
    const filteredItems = (filterType && filterType !== 'all')
      ? items.filter((item) => item.type === filterType)
      : items;

    const totalUnread = ticketsCount + emailsCount + commentsCount;

    return new Response(JSON.stringify({
      success: true,
      counts: {
        total_unread: totalUnread,
        tickets: ticketsCount,
        emails: emailsCount,
        comments: commentsCount,
      },
      items: filteredItems.slice(0, limit),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[UNIFIED INBOX ERROR]', err);
    return new Response(JSON.stringify({
      success: false,
      error: 'Birleşik gelen kutusu verileri yüklenemedi.',
      details: err.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
