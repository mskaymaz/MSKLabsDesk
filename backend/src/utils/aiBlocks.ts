/**
 * MSKLabsDesk — Kurumsal Sayfalar CMS Stüdyosu Blok Tabanlı AI Çeviri Motoru
 * File: backend/src/utils/aiBlocks.ts
 */

import type { AIEnv } from './ai';

/**
 * CMS Bloklarını Gemini AI ile İngilizce ve Arapça'ya çevirir
 */
export async function translateBlocksWithAI(
  blocks: any[],
  env: AIEnv
): Promise<any[]> {
  if (!Array.isArray(blocks) || blocks.length === 0) return blocks;

  // 1. Canlı Gemini API anahtarı yoksa deterministik geliştirme/test çevirisi üret
  if (!env.GEMINI_API_KEY) {
    return blocks.map((b) => ({
      ...b,
      title_en: b.title_tr ? `${b.title_tr} (EN)` : undefined,
      title_ar: b.title_tr ? `${b.title_tr} (AR)` : undefined,
      subtitle_en: b.subtitle_tr ? `${b.subtitle_tr} (EN)` : undefined,
      subtitle_ar: b.subtitle_tr ? `${b.subtitle_tr} (AR)` : undefined,
      badge_text_en: b.badge_text ? `${b.badge_text} (EN)` : undefined,
      badge_text_ar: b.badge_text ? `${b.badge_text} (AR)` : undefined,
      btn_primary_text_en: b.btn_primary_text ? `${b.btn_primary_text} (EN)` : undefined,
      btn_primary_text_ar: b.btn_primary_text ? `${b.btn_primary_text} (AR)` : undefined,
      btn_secondary_text_en: b.btn_secondary_text ? `${b.btn_secondary_text} (EN)` : undefined,
      btn_secondary_text_ar: b.btn_secondary_text ? `${b.btn_secondary_text} (AR)` : undefined,
      content_en: b.content_tr ? `${b.content_tr} (EN)` : undefined,
      content_ar: b.content_tr ? `${b.content_tr} (AR)` : undefined,
      items: (b.items || []).map((it: any) => ({
        ...it,
        title_en: it.title ? `${it.title} (EN)` : undefined,
        title_ar: it.title ? `${it.title} (AR)` : undefined,
        text_en: it.text ? `${it.text} (EN)` : undefined,
        text_ar: it.text ? `${it.text} (AR)` : undefined,
        price_en: it.price ? `${it.price}` : undefined,
        price_ar: it.price ? `${it.price}` : undefined,
        badge_en: it.badge ? `${it.badge} (EN)` : undefined,
        badge_ar: it.badge ? `${it.badge} (AR)` : undefined,
      })),
    }));
  }

  // 2. Gemini 1.5 Flash ile Canlı Blok Çevirisi
  try {
    const simplified = blocks.map((b) => ({
      id: b.id,
      title_tr: b.title_tr,
      subtitle_tr: b.subtitle_tr,
      badge_text: b.badge_text,
      btn_primary_text: b.btn_primary_text,
      btn_secondary_text: b.btn_secondary_text,
      content_tr: b.content_tr,
      items: (b.items || []).map((it: any) => ({
        id: it.id,
        title: it.title,
        text: it.text,
        price: it.price,
        badge: it.badge,
      })),
    }));

    const prompt = `Sen kurumsal bir CMS çok dilli çeviri uzmanısın.
Aşağıdaki blokların Türkçe metinlerini kurumsal ve doğal bir dille İngilizce (EN) ve Modern Standart Arapça (AR) dillerine çevir.
Girdi bloklarındaki her öğe için 'title_en', 'title_ar', 'subtitle_en', 'subtitle_ar', 'badge_text_en', 'badge_text_ar', 'btn_primary_text_en', 'btn_primary_text_ar', 'btn_secondary_text_en', 'btn_secondary_text_ar', 'content_en', 'content_ar' alanlarını ve items içindeki 'title_en', 'title_ar', 'text_en', 'text_ar', 'price_en', 'price_ar', 'badge_en', 'badge_ar' alanlarını doldurarak YALNIZCA geçerli bir JSON listesi döndür.

BLOKLAR:
${JSON.stringify(simplified, null, 2)}`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) throw new Error(`Gemini status ${response.status}`);
    const data = (await response.json()) as any;
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty translation output');

    const translatedList = JSON.parse(rawText) as any[];
    const translationMap = new Map<string, any>(translatedList.map((t) => [t.id, t]));

    return blocks.map((b) => {
      const tr = translationMap.get(b.id);
      if (!tr) return b;
      const itemMap = new Map<string, any>((tr.items || []).map((it: any) => [it.id, it]));

      return {
        ...b,
        title_en: tr.title_en || b.title_en,
        title_ar: tr.title_ar || b.title_ar,
        subtitle_en: tr.subtitle_en || b.subtitle_en,
        subtitle_ar: tr.subtitle_ar || b.subtitle_ar,
        badge_text_en: tr.badge_text_en || b.badge_text_en,
        badge_text_ar: tr.badge_text_ar || b.badge_text_ar,
        btn_primary_text_en: tr.btn_primary_text_en || b.btn_primary_text_en,
        btn_primary_text_ar: tr.btn_primary_text_ar || b.btn_primary_text_ar,
        btn_secondary_text_en: tr.btn_secondary_text_en || b.btn_secondary_text_en,
        btn_secondary_text_ar: tr.btn_secondary_text_ar || b.btn_secondary_text_ar,
        content_en: tr.content_en || b.content_en,
        content_ar: tr.content_ar || b.content_ar,
        items: (b.items || []).map((it: any) => {
          const itTr = itemMap.get(it.id);
          if (!itTr) return it;
          return {
            ...it,
            title_en: itTr.title_en || it.title_en,
            title_ar: itTr.title_ar || it.title_ar,
            text_en: itTr.text_en || it.text_en,
            text_ar: itTr.text_ar || it.text_ar,
            price_en: itTr.price_en || it.price_en,
            price_ar: itTr.price_ar || it.price_ar,
            badge_en: itTr.badge_en || it.badge_en,
            badge_ar: itTr.badge_ar || it.badge_ar,
          };
        }),
      };
    });
  } catch (err) {
    console.error('[AI BLOCK TRANSLATION ERROR]', err);
    return blocks;
  }
}
