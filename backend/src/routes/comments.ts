/**
 * MSKLabsDesk â€” Blog Yorum API Endpoints (POST & GET /api/comments, GET /api/comments/verify)
 */

import { EmailEnv, sendEmail, escapeHtml } from '../utils/email';

export interface CommentPayload {
  post_type: 'bizce' | 'aniltilar' | 'guncel';
  post_slug: string;
  author_name: string;
  author_email: string;
  content: string;
}



/**
 * POST /api/comments â€” Yeni Yorum GÃ¶nderme (Double Opt-In E-Posta OnayÄ± ile)
 */
export async function handleCommentSubmission(request: Request, env: { DB: D1Database } & EmailEnv, ctx?: ExecutionContext): Promise<Response> {
  try {
    const raw = await request.json() as any;

    // 1. Honeypot Bot KorumasÄ± (Gizli alan doldurulmuÅŸsa sessizce geÃ§iÅŸtir)
    if (raw.website || raw.commentHoneypot || raw.hp_check) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Yorumunuz alÄ±ndÄ±. E-posta onay baÄŸlantÄ±nÄ±z gÃ¶nderildi.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 2. Matematik / Ä°nsan DoÄŸrulamasÄ± KontrolÃ¼ (Formdan gÃ¶nderilmiÅŸse)
    if (raw.captcha_expected !== undefined && raw.captcha_answer !== undefined) {
      const expected = Number(raw.captcha_expected);
      const answer = Number(raw.captcha_answer);
      if (isNaN(answer) || answer !== expected) {
        return new Response(
          JSON.stringify({ error: 'GÃ¼venlik doÄŸrulamasÄ± (robot testi) hatalÄ± yanÄ±tlandÄ±. LÃ¼tfen tekrar deneyin.' }),
          { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }
    }

    const postType = (raw.post_type || raw.postType || 'bizce').trim();
    const postSlug = (raw.post_slug || raw.postSlug || '').trim();
    const authorName = (raw.author_name || raw.authorName || '').trim();
    const authorEmail = (raw.author_email || raw.authorEmail || '').trim().toLowerCase();
    const content = (raw.content || raw.comment_text || '').trim();

    if (!postSlug || !authorName || !authorEmail || !content) {
      return new Response(
        JSON.stringify({ error: 'LÃ¼tfen tÃ¼m alanlarÄ± (isim, e-posta, yorum) eksiksiz doldurun.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
      return new Response(
        JSON.stringify({ error: 'GeÃ§ersiz e-posta adresi biÃ§imi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const commentId = `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const verificationToken = `vt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const ipAddress = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('User-Agent') || 'Unknown';

    // 2.1. Suistimal ve E-Posta Bombardımanı Koruması (3 Dakika Cooldown)
    const recentPending = await env.DB.prepare(
      "SELECT id FROM comments WHERE (author_email = ? OR ip_address = ?) AND status = 'unverified' AND created_at >= datetime('now', '-3 minutes') LIMIT 1"
    ).bind(authorEmail, ipAddress).first();

    if (recentPending) {
      return new Response(
        JSON.stringify({ 
          error: 'Kısa süre önce bir yorum onay e-postası gönderildi. Lütfen gelen kutunuzu kontrol ediniz. Yeni bir onay bağlantısı istemek için lütfen birkaç dakika bekleyiniz.' 
        }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Durum: 'unverified' (KullanÄ±cÄ± e-postasÄ±ndaki butona basana kadar yÃ¶neticiye dÃ¼ÅŸmez)
    await env.DB.prepare(`
      INSERT INTO comments (id, post_type, post_slug, author_name, author_email, content, status, ip_address, user_agent, verification_token, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'unverified', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      commentId,
      postType,
      postSlug,
      authorName,
      authorEmail,
      content,
      ipAddress,
      userAgent,
      verificationToken
    ).run();

    // 3. E-Posta Onay BaÄŸlantÄ±larÄ±nÄ±n HazÄ±rlanmasÄ±
    const origin = new URL(request.url).origin;
    const confirmUrl = `${origin}/api/comments/verify?token=${verificationToken}&action=confirm`;
    const cancelUrl = `${origin}/api/comments/verify?token=${verificationToken}&action=cancel`;

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #0f172a;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0284c7; margin: 0; font-size: 1.4rem;">MSK Labs</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin: 4px 0 0 0;">Blog Yorumu E-Posta Onay Bildirimi</p>
        </div>
        <p style="font-size: 0.95rem; margin: 0 0 12px 0;">Merhaba <strong>${escapeHtml(authorName)}</strong>,</p>
        <p style="font-size: 0.92rem; color: #334155; line-height: 1.5; margin: 0 0 16px 0;">
          MSK Labs blog makalesine gÃ¶ndermiÅŸ olduÄŸunuz yorum baÅŸarÄ±yla sisteme ulaÅŸtÄ±. Yorumunuzun editÃ¶rlerimiz tarafÄ±ndan incelenip sitede yayÄ±nlanabilmesi iÃ§in lÃ¼tfen e-posta adresinizi doÄŸrulayÄ±nÄ±z:
        </p>
        <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 0 0 20px 0; border-radius: 6px; font-size: 0.88rem; color: #1e293b; font-style: italic;">
          "${escapeHtml(content)}"
        </div>
        <div style="text-align: center; margin: 24px 0 16px 0;">
          <a href="${confirmUrl}" style="background: #0284c7; color: #ffffff; text-decoration: none; padding: 12px 26px; font-size: 0.95rem; font-weight: 700; border-radius: 8px; display: inline-block;">
            âœ… Yorumumu OnaylÄ±yorum ve Ä°let
          </a>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${cancelUrl}" style="color: #ef4444; font-size: 0.82rem; text-decoration: underline;">
            âŒ Bu yorumu ben yazmadÄ±m / YayÄ±nlamaktan vazgeÃ§tim
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 0.76rem; color: #94a3b8; text-align: center; margin: 0; line-height: 1.4;">
          Bu e-posta, web sitemiz Ã¼zerinden yapÄ±lan yorum bildirimi iÃ§in otomatik gÃ¶nderilmiÅŸtir. Onay vermediÄŸiniz takdirde yorumunuz yayÄ±nlanmayacaktÄ±r.
        </p>
      </div>
    `;

    const emailPromise = sendEmail({
      to: authorEmail,
      toName: authorName,
      subject: '[MSK Labs] Blog Yorumunuz Ä°Ã§in E-Posta OnayÄ±',
      html: emailHtml,
      emailType: 'verification',
    }, env).catch(err => console.error('Yorum onay e-posta hatasÄ±:', err));

    if (ctx) {
      ctx.waitUntil(emailPromise);
    } else {
      await emailPromise;
    }

    console.log(`[COMMENT VERIFICATION] Token: ${verificationToken} | Confirm: ${confirmUrl}`);

    return new Response(
      JSON.stringify({
        success: true,
        comment_id: commentId,
        message: 'Yorumunuz alÄ±ndÄ±! E-posta adresinize bir doÄŸrulama baÄŸlantÄ±sÄ± gÃ¶nderildi. LÃ¼tfen gelen kutunuzu kontrol edip "Yorumumu Onayla" butonuna tÄ±klayÄ±nÄ±z.',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[COMMENT POST ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatasÄ± oluÅŸtu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * GET /api/comments/verify?token=...&action=confirm|cancel â€” KullanÄ±cÄ± E-Posta Onay / Ä°ptal UÃ§ NoktasÄ±
 */
export async function handleVerifyComment(request: Request, env: { DB: D1Database }): Promise<Response> {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  const action = (url.searchParams.get('action') || 'confirm').trim().toLowerCase();

  const renderHtmlResponse = (icon: string, title: string, message: string, isSuccess: boolean) => {
    const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} â€” MSK Labs</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px 28px; text-align: center; box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
    .icon { font-size: 3.2rem; margin-bottom: 14px; }
    h1 { font-size: 1.25rem; font-weight: 800; color: ${isSuccess ? '#38bdf8' : '#f87171'}; margin: 0 0 12px 0; }
    p { font-size: 0.92rem; color: #94a3b8; line-height: 1.55; margin: 0 0 24px 0; }
    .btn { display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/" class="btn">Ana Sayfaya DÃ¶n</a>
  </div>
</body>
</html>`;
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  };

  if (!token) {
    return renderHtmlResponse('âš ï¸', 'GeÃ§ersiz BaÄŸlantÄ±', 'DoÄŸrulama belirteci (token) bulunamadÄ±. LÃ¼tfen e-postanÄ±zdaki baÄŸlantÄ±yÄ± eksiksiz aÃ§tÄ±ÄŸÄ±nÄ±zdan emin olun.', false);
  }

  if (action === 'cancel') {
    await env.DB.prepare("UPDATE comments SET status = 'cancelled' WHERE verification_token = ?").bind(token).run();
    return renderHtmlResponse('âŒ', 'Yorum Talebi Ä°ptal Edildi', 'Yorum gÃ¶nderme talebiniz isteÄŸiniz Ã¼zerine iptal edilmiÅŸtir. Bu yorum yayÄ±nlanmayacaktÄ±r.', false);
  }

  // Onaylama iÅŸlemi: unverified -> pending
  const updateRes = await env.DB.prepare(`
    UPDATE comments 
    SET status = 'pending', verified_at = CURRENT_TIMESTAMP 
    WHERE verification_token = ? AND status = 'unverified'
  `).bind(token).run();

  if (updateRes.meta && updateRes.meta.changes > 0) {
    return renderHtmlResponse('âœ…', 'E-Posta Adresiniz DoÄŸrulandÄ±!', 'Yorumunuz baÅŸarÄ±yla onaylandÄ± ve editÃ¶rlerimizin inceleme kuyruÄŸuna iletildi. Ä°nceleme tamamlandÄ±ktan sonra makalenin altÄ±nda yayÄ±nlanacaktÄ±r. TeÅŸekkÃ¼r ederiz.', true);
  }

  // Zaten doÄŸrulanmÄ±ÅŸ mÄ± kontrol et
  const existing = await env.DB.prepare('SELECT status FROM comments WHERE verification_token = ?').bind(token).first<{ status: string }>();
  if (existing && (existing.status === 'pending' || existing.status === 'approved')) {
    return renderHtmlResponse('â„¹ï¸', 'Zaten DoÄŸrulanmÄ±ÅŸ', 'Bu yorum iÃ§in e-posta doÄŸrulama iÅŸlemi daha Ã¶nce zaten tamamlanmÄ±ÅŸtÄ±r. Yorumunuz incelenmekte veya yayÄ±nlanmaktadÄ±r.', true);
  }

  return renderHtmlResponse('âš ï¸', 'BaÄŸlantÄ± GeÃ§ersiz', 'DoÄŸrulanacak bir yorum kaydÄ± bulunamadÄ± veya baÄŸlantÄ±nÄ±n sÃ¼resi dolmuÅŸ olabilir.', false);
}

/**
 * GET /api/comments?post_slug=... â€” OnaylanmÄ±ÅŸ YorumlarÄ± Listeleme
 */
export async function handleGetApprovedComments(request: Request, env: { DB: D1Database }): Promise<Response> {
  try {
    const url = new URL(request.url);
    const postSlug = (url.searchParams.get('post_slug') || url.searchParams.get('postSlug') || '').trim();

    if (!postSlug) {
      return new Response(
        JSON.stringify({ error: 'post_slug parametresi gereklidir.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const { results } = await env.DB.prepare(`
      SELECT id, post_type, post_slug, author_name, content, created_at
      FROM comments
      WHERE post_slug = ? AND status = 'approved'
      ORDER BY created_at ASC
    `).bind(postSlug).all();

    return new Response(
      JSON.stringify({ success: true, comments: results || [], data: results || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[COMMENT GET ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatasÄ± oluÅŸtu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
