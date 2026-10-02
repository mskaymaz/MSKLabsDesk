/**
 * MSKLabsDesk — E-Bülten Abonelik & Tercih API Endpoints (POST /api/subscribe & POST /api/unsubscribe)
 */

import { EmailEnv, sendEmail } from '../utils/email';

export interface SubscribePayload {
  email: string;
  source?: string;
  categories?: string[]; // ['blog', 'apps', 'offers', 'all']
}

export interface UnsubscribePayload {
  email: string;
  token?: string;
}

/**
 * POST /api/subscribe — Bülten Abone Olma
 */
export async function handleSubscribe(request: Request, env: { DB: D1Database } & EmailEnv): Promise<Response> {
  try {
    const payload = await request.json() as SubscribePayload;

    if (!payload.email || typeof payload.email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Lütfen geçerli bir e-posta adresi girin.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const email = payload.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz e-posta adresi biçimi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const source = payload.source || 'website_footer';
    const categories = (payload.categories && payload.categories.length > 0) ? payload.categories : ['blog', 'apps', 'all'];

    // 1. Zaten Var Mı Kontrolü
    const existing = await env.DB.prepare('SELECT id, status FROM subscribers WHERE email = ?').bind(email).first();

    let subscriberId = '';
    const token = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (existing) {
      subscriberId = existing.id as string;
      // Yeniden aktif et
      await env.DB.prepare(`
        UPDATE subscribers SET status = 'active', verified_at = CURRENT_TIMESTAMP WHERE id = ?
      `).bind(subscriberId).run();
    } else {
      subscriberId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      await env.DB.prepare(`
        INSERT INTO subscribers (id, email, status, verification_token, source, created_at, verified_at)
        VALUES (?, ?, 'active', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(subscriberId, email, token, source).run();
    }

    // 2. Kategori Tercihlerini Kaydet
    for (const cat of categories) {
      await env.DB.prepare(`
        INSERT INTO subscriber_preferences (subscriber_id, category, is_subscribed)
        VALUES (?, ?, 1)
        ON CONFLICT(subscriber_id, category) DO UPDATE SET is_subscribed = 1
      `).bind(subscriberId, cat).run();
    }

    // 3. Hoş Geldiniz E-Postası Gönder
    const emailSubject = 'MSK Labs E-Bülten Aboneliğiniz Başladı 🎉';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Aramıza Hoş Geldiniz!</h2>
        <p>MSK Labs e-bülten yayınlarımıza başarıyla kaydoldunuz.</p>
        <p>Geliştirdiğimiz yeni uygulamalar, mimarlık/teknoloji blog yazıları ve özel güncellemeler hakkında sizi bilgilendireceğiz.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #64748b;">
          Abonelik tercihlerinizi değiştirmek veya abonelikten çıkmak isterseniz bu e-postayı yanıtlayabilirsiniz.
        </p>
      </div>
    `;

    sendEmail({
      to: email,
      subject: emailSubject,
      html: emailHtml,
      emailType: 'verification'
    }, env).catch(err => console.error('Bülten e-posta hatası:', err));

    return new Response(
      JSON.stringify({
        success: true,
        message: 'E-bülten aboneliğiniz başarıyla başlatıldı. Teşekkür ederiz!',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[SUBSCRIBE ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * POST /api/unsubscribe — Abonelikten Çıkma
 */
export async function handleUnsubscribe(request: Request, env: { DB: D1Database }): Promise<Response> {
  try {
    const payload = await request.json() as UnsubscribePayload;

    if (!payload.email) {
      return new Response(
        JSON.stringify({ error: 'E-posta adresi gereklidir.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await env.DB.prepare(`
      UPDATE subscribers SET status = 'unsubscribed' WHERE email = ?
    `).bind(payload.email.trim().toLowerCase()).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Aboneliğiniz başarıyla sonlandırılmıştır.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[UNSUBSCRIBE ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
