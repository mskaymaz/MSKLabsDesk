/**
 * MSKLabsDesk — TTS Metin Temizleme, Telaffuz Normalizasyonu ve Segmentasyon (CMS-TTS-002)
 * File: backend/src/utils/ttsSanitizer.ts
 */

export interface TtsPreparedContent {
  fullSanitizedText: string;
  segments: string[];
  wordCount: number;
  estimatedDurationSeconds: number;
}

/**
 * HTML ve Markdown işaretlemelerini temizler, saf okunabilir metne dönüştürür.
 */
export function stripHtmlAndMarkdown(input: string): string {
  if (!input) return '';

  let text = input;

  // 1. Kod bloklarını ve inline kodları temizle / dönüştür
  text = text.replace(/```[\s\S]*?```/g, ' [kod bloğu] ');
  text = text.replace(/`([^`]+)`/g, '$1');

  // 2. HTML etiketlerini kaldır (içerik korunur)
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<br\s*[\/]?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/h[1-6]>/gi, '.\n\n');
  text = text.replace(/<\/li>/gi, '.\n');
  text = text.replace(/<[^>]+>/g, '');

  // 3. Markdown bağlantıları [metin](link) -> metin
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, ''); // Görselleri kaldır

  // 4. Markdown başlıkları, listeler, kalın/italik işaretleri
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/^[\*\-+]\s+/gm, '');
  text = text.replace(/^\d+\.\s+/gm, '');
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');
  text = text.replace(/^>\s+/gm, '');

  // 5. HTML varlıkları (HTML Entities)
  text = text.replace(/&nbsp;/gi, ' ');
  text = text.replace(/&amp;/gi, ' ve ');
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");
  text = text.replace(/&lt;/gi, '<');
  text = text.replace(/&gt;/gi, '>');

  // 6. Fazla boşlukları ve satır sonlarını normalize et
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n\s*\n\s*\n+/g, '\n\n');

  return text.trim();
}

/**
 * Dil bazında kısaltma ve telaffuz normalizasyonu (Doğal okuma motoru)
 */
export function normalizePronunciation(text: string, language: 'TR' | 'EN' | 'AR'): string {
  if (!text) return '';

  let normalized = text;

  if (language === 'TR') {
    // Özel marka ve kısaltmalar
    normalized = normalized.replace(/\bMSK\s+Labs\b/gi, 'M S K Labs');
    normalized = normalized.replace(/\bMSK\b/g, 'M S K');
    normalized = normalized.replace(/\bTL\b/g, 'Türk Lirası');
    normalized = normalized.replace(/₺/g, ' Türk Lirası ');
    normalized = normalized.replace(/\bkm\b/g, 'kilometre');
    normalized = normalized.replace(/\b(\d+)\s*dk\b/gi, '$1 dakika');
    normalized = normalized.replace(/\b(\d+)\s*sn\b/gi, '$1 saniye');
    normalized = normalized.replace(/(^|[\s,])vb\./gi, '$1ve benzerleri');
    normalized = normalized.replace(/(^|[\s,])vd\./gi, '$1ve diğerleri');
    normalized = normalized.replace(/(^|[\s,])vs\./gi, '$1ve saire');
    normalized = normalized.replace(/(^|[\s,])bkz\./gi, '$1bakınız');
    normalized = normalized.replace(/(^|[\s,])Örn:/gi, '$1Örneğin:');
    normalized = normalized.replace(/\bURL\b/g, 'U R L');
    normalized = normalized.replace(/\bAPI\b/g, 'A P I');
    normalized = normalized.replace(/\bPDF\b/g, 'P D F');
    normalized = normalized.replace(/\bUI\b/g, 'U I');
    normalized = normalized.replace(/\bAI\b/g, 'A I');
  } else if (language === 'EN') {
    normalized = normalized.replace(/\bMSK\s+Labs\b/gi, 'M S K Labs');
    normalized = normalized.replace(/(^|[\s,])e\.g\./gi, '$1for example');
    normalized = normalized.replace(/(^|[\s,])i\.e\./gi, '$1that is');
    normalized = normalized.replace(/(^|[\s,])etc\./gi, '$1et cetera');
    normalized = normalized.replace(/(^|[\s,])vs\./gi, '$1versus');
    normalized = normalized.replace(/\bAPI\b/g, 'A P I');
    normalized = normalized.replace(/\bURL\b/g, 'U R L');
    normalized = normalized.replace(/\bPDF\b/g, 'P D F');
    normalized = normalized.replace(/\bAI\b/g, 'A I');
  } else if (language === 'AR') {
    // Fasih Arapça için kontrol karakterlerini temizle, harekeyi koru
    normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, '');
    normalized = normalized.replace(/\bMSK\s+Labs\b/gi, 'إم إس كي لابس');
  }

  return normalized;
}

/**
 * Uzun metinleri cümle ve paragraf sınırlarında mantıksal parçalara böler.
 * Azami chunk uzunluğu varsayılan 800 karakterdir.
 */
export function segmentText(text: string, maxChunkLength: number = 800): string[] {
  if (!text || !text.trim()) return [];

  const rawParagraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const segments: string[] = [];
  let currentChunk = '';

  for (const para of rawParagraphs) {
    if (para.length <= maxChunkLength) {
      if (!currentChunk) {
        currentChunk = para;
      } else if (currentChunk.length + para.length + 2 <= maxChunkLength) {
        currentChunk += '\n\n' + para;
      } else {
        segments.push(currentChunk.trim());
        currentChunk = para;
      }
      continue;
    }

    const sentences = para.split(/(?<=[.!?؟؛])\s+/).filter(Boolean);

    for (const sentence of sentences) {
      if (sentence.length > maxChunkLength) {
        const words = sentence.split(' ');
        for (const w of words) {
          if ((currentChunk + ' ' + w).length > maxChunkLength) {
            if (currentChunk) segments.push(currentChunk.trim());
            currentChunk = w;
          } else {
            currentChunk = currentChunk ? currentChunk + ' ' + w : w;
          }
        }
      } else if ((currentChunk + ' ' + sentence).length > maxChunkLength) {
        if (currentChunk) segments.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
      }
    }
  }

  if (currentChunk.trim()) {
    segments.push(currentChunk.trim());
  }

  return segments;
}

/**
 * Metni TTS üretimi için baştan sona hazırlar (Clean -> Normalize -> Segment)
 */
export function prepareTtsPayload(
  rawContent: string,
  language: 'TR' | 'EN' | 'AR' = 'TR',
  maxChunkLength: number = 800
): TtsPreparedContent {
  const stripped = stripHtmlAndMarkdown(rawContent);
  const normalized = normalizePronunciation(stripped, language);
  const segments = segmentText(normalized, maxChunkLength);

  // Ortalama okuma hızı: Dakikada ~130-150 kelime (~2.3 kelime/saniye)
  const words = normalized.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const estimatedDurationSeconds = Math.ceil(wordCount / 2.3);

  return {
    fullSanitizedText: normalized,
    segments,
    wordCount,
    estimatedDurationSeconds,
  };
}
