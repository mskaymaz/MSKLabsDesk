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

export interface InboxSummaryBlogChannel {
  id: string;
  slug: string;
  name: string;
  icon: string;
  pending: number;    // O: Onay Bekleyen
  unverified: number; // D: Doğrulama Bekleyen
}

export interface InboxSummarySupportCategory {
  key: 'hata' | 'istek' | 'tesekkur' | 'fikir' | 'muhtelif';
  name: string;
  icon: string;
  new: number;        // Y: Yeni
  in_progress: number;// İ: İşlemde
  urgent: number;     // !: Acil
}

export interface InboxSummaryEmailBox {
  key: 'iletisim' | 'destek' | 'sistem' | 'muhtelif';
  name: string;
  address: string;
  icon: string;
  new: number;        // Y: Yeni / Cevap Bekleyen
}

export interface InboxSummaryResponse {
  success: boolean;
  timestamp: string;
  totals: {
    blog_pending: number;
    blog_unverified: number;
    support_new: number;
    support_in_progress: number;
    support_urgent: number;
    email_new: number;
    all_actionable: number;
  };
  blog_channels: InboxSummaryBlogChannel[];
  support_categories: InboxSummarySupportCategory[];
  email_boxes: InboxSummaryEmailBox[];
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

export async function handleAdminGetInboxSummary(
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

  try {
    // 1. Blog Kanalları ve Yorum Sayaçları
    let channels: Array<{ id: string; slug: string; name_tr: string; icon: string }> = [];
    try {
      const { results: rawChannels } = await env.DB.prepare(`
        SELECT id, slug, name_tr, icon 
        FROM blog_channels 
        WHERE is_active = 1 
        ORDER BY display_order ASC
      `).all();
      if (rawChannels && rawChannels.length > 0) {
        channels = rawChannels as any;
      }
    } catch {
      // blog_channels tablosu yoksa varsayılan listeye dönülür
    }

    if (channels.length === 0) {
      channels = [
        { id: 'ch-bizce', slug: 'bizce', name_tr: 'Bizce', icon: 'book-open' },
        { id: 'ch-aniltilar', slug: 'aniltilar', name_tr: 'Anıltılar', icon: 'feather' },
        { id: 'ch-guncel', slug: 'guncel', name_tr: 'Güncel', icon: 'newspaper' },
        { id: 'ch-fikir', slug: 'fikir', name_tr: 'Fikirler', icon: 'lightbulb' },
        { id: 'ch-muhtelif', slug: 'muhtelif', name_tr: 'Muhtelif Blog', icon: 'layers' },
      ];
    }

    const { results: commentCounts } = await env.DB.prepare(`
      SELECT 
        COALESCE(c.post_type, p.channel_id, 'muhtelif') as channel_key,
        c.status,
        COUNT(*) as cnt
      FROM comments c
      LEFT JOIN blog_posts p ON p.slug = c.post_slug
      WHERE c.status IN ('pending', 'unverified')
      GROUP BY channel_key, c.status
    `).all();

    const blogChannelMap: Record<string, { pending: number; unverified: number }> = {};
    for (const r of (commentCounts || [])) {
      const k = String((r as any).channel_key || '').toLowerCase();
      if (!blogChannelMap[k]) blogChannelMap[k] = { pending: 0, unverified: 0 };
      const status = String((r as any).status);
      const cnt = Number((r as any).cnt || 0);
      if (status === 'pending') blogChannelMap[k].pending += cnt;
      if (status === 'unverified') blogChannelMap[k].unverified += cnt;
    }

    let blogPendingTotal = 0;
    let blogUnverifiedTotal = 0;

    const blog_channels: InboxSummaryBlogChannel[] = channels.map((ch) => {
      const counts = blogChannelMap[ch.slug.toLowerCase()] || 
                     blogChannelMap[ch.id.toLowerCase()] || 
                     { pending: 0, unverified: 0 };
      blogPendingTotal += counts.pending;
      blogUnverifiedTotal += counts.unverified;
      return {
        id: ch.id,
        slug: ch.slug,
        name: ch.name_tr,
        icon: ch.icon || 'book-open',
        pending: counts.pending,
        unverified: counts.unverified,
      };
    });

    // 2. Destek Masası Kategorileri ve Sayaçları
    const { results: supportRows } = await env.DB.prepare(`
      SELECT 
        category, 
        status, 
        urgency, 
        COUNT(*) as cnt
      FROM messages
      WHERE (category IS NULL OR category != 'email') AND status IN ('new', 'open', 'in_progress')
      GROUP BY category, status, urgency
    `).all();

    const supportMap: Record<string, { new: number; in_progress: number; urgent: number }> = {
      hata: { new: 0, in_progress: 0, urgent: 0 },
      istek: { new: 0, in_progress: 0, urgent: 0 },
      tesekkur: { new: 0, in_progress: 0, urgent: 0 },
      fikir: { new: 0, in_progress: 0, urgent: 0 },
      muhtelif: { new: 0, in_progress: 0, urgent: 0 },
    };

    for (const row of (supportRows || [])) {
      const rawCat = String((row as any).category || '').toLowerCase();
      let normCat: 'hata' | 'istek' | 'tesekkur' | 'fikir' | 'muhtelif' = 'muhtelif';
      if (rawCat === 'hata' || rawCat === 'bug') normCat = 'hata';
      else if (rawCat === 'istek' || rawCat === 'feature') normCat = 'istek';
      else if (rawCat === 'tesekkur' || rawCat === 'feedback' || rawCat === 'billing') normCat = 'tesekkur';
      else if (rawCat === 'fikir' || rawCat === 'idea') normCat = 'fikir';

      const status = String((row as any).status);
      const urgency = String((row as any).urgency || 'medium').toLowerCase();
      const cnt = Number((row as any).cnt || 0);

      if (status === 'new' || status === 'open') {
        supportMap[normCat].new += cnt;
      } else if (status === 'in_progress') {
        supportMap[normCat].in_progress += cnt;
      }

      if (urgency === 'high' || urgency === 'urgent' || urgency === 'critical') {
        supportMap[normCat].urgent += cnt;
      }
    }

    const support_categories: InboxSummarySupportCategory[] = [
      { key: 'hata', name: 'Arıza Bildirimleri', icon: 'alert-triangle', ...supportMap.hata },
      { key: 'istek', name: 'Özellik Talepleri', icon: 'sparkles', ...supportMap.istek },
      { key: 'tesekkur', name: 'Teşekkür & Övgü', icon: 'heart', ...supportMap.tesekkur },
      { key: 'fikir', name: 'Yeni Fikirler', icon: 'lightbulb', ...supportMap.fikir },
      { key: 'muhtelif', name: 'Muhtelif Destek', icon: 'archive', ...supportMap.muhtelif },
    ];

    let supportNewTotal = 0;
    let supportInProgressTotal = 0;
    let supportUrgentTotal = 0;
    for (const sc of support_categories) {
      supportNewTotal += sc.new;
      supportInProgressTotal += sc.in_progress;
      supportUrgentTotal += sc.urgent;
    }

    // 3. Kurumsal E-Posta Kutuları
    const { results: emailRows } = await env.DB.prepare(`
      SELECT 
        m.id,
        m.status,
        m.urgency,
        json_extract(me.details, '$.to') as recipient_to
      FROM messages m
      LEFT JOIN message_events me ON me.message_id = m.id AND me.actor = 'SYSTEM_EMAIL_ROUTING'
      WHERE m.category = 'email' AND m.status IN ('new', 'open', 'in_progress')
    `).all();

    const emailMap: Record<string, number> = {
      iletisim: 0,
      destek: 0,
      sistem: 0,
      muhtelif: 0,
    };

    for (const em of (emailRows || [])) {
      const to = String((em as any).recipient_to || '').toLowerCase();
      if (to.includes('destek') || to.includes('support')) {
        emailMap.destek++;
      } else if (to.includes('iletisim') || to.includes('contact')) {
        emailMap.iletisim++;
      } else if (to.includes('admin') || to.includes('sistem') || to.includes('bildirim') || to.includes('noreply')) {
        emailMap.sistem++;
      } else {
        emailMap.muhtelif++;
      }
    }

    const email_boxes: InboxSummaryEmailBox[] = [
      { key: 'iletisim', name: 'Kurumsal İletişim', address: 'iletisim@msklabs.org', icon: 'mail', new: emailMap.iletisim },
      { key: 'destek', name: 'E-Posta Destek', address: 'destek@msklabs.org', icon: 'help-circle', new: emailMap.destek },
      { key: 'sistem', name: 'Sistem & Güvenlik', address: 'admin@msklabs.org', icon: 'shield', new: emailMap.sistem },
      { key: 'muhtelif', name: 'Muhtelif E-Posta', address: '*@msklabs.org', icon: 'inbox', new: emailMap.muhtelif },
    ];

    const emailNewTotal = emailMap.iletisim + emailMap.destek + emailMap.sistem + emailMap.muhtelif;

    const responseData: InboxSummaryResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      totals: {
        blog_pending: blogPendingTotal,
        blog_unverified: blogUnverifiedTotal,
        support_new: supportNewTotal,
        support_in_progress: supportInProgressTotal,
        support_urgent: supportUrgentTotal,
        email_new: emailNewTotal,
        all_actionable: blogPendingTotal + supportNewTotal + supportInProgressTotal + emailNewTotal,
      },
      blog_channels,
      support_categories,
      email_boxes,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[INBOX SUMMARY ERROR]', err);
    return new Response(JSON.stringify({
      success: false,
      error: 'İletişim istasyonu özet metrikleri yüklenemedi.',
      details: err.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
