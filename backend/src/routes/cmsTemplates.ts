import { verifyAuthToken } from '../utils/auth';

export const DEFAULT_AD_SLOTS = [
  {
    slot_key: 'ad_sidebar_right',
    title: 'Sağ Dikey Reklam (Right Sidebar)',
    description: 'Masaüstünde sağ sütunda yer alan, isteğe bağlı yapışkan (sticky) dikey reklam.',
    ad_client: '',
    ad_slot: '',
    is_enabled: false,
    desktop: {
      is_enabled: false,
      preset_size: '300x250',
      custom_width: null,
      custom_height: null,
      margin_top: 16,
      margin_right: 0,
      margin_bottom: 16,
      margin_left: 0,
      align: 'center',
      is_sticky: true,
    },
    mobile: {
      is_enabled: false,
      preset_size: '300x250',
      custom_width: null,
      custom_height: null,
      margin_top: 12,
      margin_right: 0,
      margin_bottom: 12,
      margin_left: 0,
      align: 'center',
    },
  },
  {
    slot_key: 'ad_sidebar_left',
    title: 'Sol Dikey Reklam (Left Skyscraper)',
    description: 'Geniş ekranlarda sol kenar boşluğunda duran gökdelen reklamı (mobilde otomatik pasif).',
    ad_client: '',
    ad_slot: '',
    is_enabled: false,
    desktop: {
      is_enabled: false,
      preset_size: '120x600',
      custom_width: null,
      custom_height: null,
      margin_top: 20,
      margin_right: 0,
      margin_bottom: 20,
      margin_left: 0,
      align: 'center',
      is_sticky: true,
    },
    mobile: {
      is_enabled: false,
      preset_size: '320x50',
      custom_width: null,
      custom_height: null,
      margin_top: 0,
      margin_right: 0,
      margin_bottom: 0,
      margin_left: 0,
      align: 'center',
    },
  },
  {
    slot_key: 'ad_in_content',
    title: 'Bölümler Arası / Akış İçi (In-Content / In-Feed)',
    description: 'Blog yazıları ve sayfa bölümleri arasında doğal olarak akan reklam.',
    ad_client: '',
    ad_slot: '',
    is_enabled: false,
    desktop: {
      is_enabled: false,
      preset_size: 'RESPONSIVE',
      custom_width: null,
      custom_height: null,
      margin_top: 24,
      margin_right: 0,
      margin_bottom: 24,
      margin_left: 0,
      align: 'center',
      is_sticky: false,
    },
    mobile: {
      is_enabled: false,
      preset_size: 'RESPONSIVE',
      custom_width: null,
      custom_height: null,
      margin_top: 16,
      margin_right: 0,
      margin_bottom: 16,
      margin_left: 0,
      align: 'center',
    },
  },
  {
    slot_key: 'ad_footer_bottom',
    title: 'Sayfa Sonu Reklamı (Footer Banner)',
    description: 'Sayfa içeriğinin bitiminde, alt bilgi (footer) alanının hemen üstünde yer alan banner.',
    ad_client: '',
    ad_slot: '',
    is_enabled: false,
    desktop: {
      is_enabled: false,
      preset_size: '728x90',
      custom_width: null,
      custom_height: null,
      margin_top: 20,
      margin_right: 0,
      margin_bottom: 24,
      margin_left: 0,
      align: 'center',
      is_sticky: false,
    },
    mobile: {
      is_enabled: false,
      preset_size: '320x50',
      custom_width: null,
      custom_height: null,
      margin_top: 16,
      margin_right: 0,
      margin_bottom: 20,
      margin_left: 0,
      align: 'center',
    },
  },
];

export async function handleCmsTemplates(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const isAdsRoute = url.pathname.includes('/ads');

  // Güvenli Yönetici Doğrulaması
  const user = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 1. GET İstekleri
  if (method === 'GET') {
    if (isAdsRoute) {
      const { results } = await env.DB.prepare(
        `SELECT * FROM site_templates WHERE key_name LIKE 'ad_%'`
      ).all();

      const dbMap = new Map<string, any>();
      (results || []).forEach((row: any) => {
        let parsedMeta: any = {};
        try {
          if (row.meta_json) parsedMeta = JSON.parse(row.meta_json);
        } catch (_) {}
        dbMap.set(row.key_name, {
          ...parsedMeta,
          id: row.id,
          slot_key: row.key_name,
          title: row.content_tr || parsedMeta.title || row.key_name,
          is_enabled: Boolean(row.is_active),
          is_deleted: Boolean(parsedMeta.is_deleted),
        });
      });

      const ads: any[] = [];
      const handledKeys = new Set<string>();

      // Varsayılan slotlar (silinmiş olanlar veya ad_header_top filtrelenir)
      DEFAULT_AD_SLOTS.forEach((def) => {
        handledKeys.add(def.slot_key);
        const dbData = dbMap.get(def.slot_key);
        if (dbData?.is_deleted) return;
        if (!dbData) {
          ads.push(def);
        } else {
          ads.push({
            ...def,
            ...dbData,
            desktop: { ...def.desktop, ...(dbData.desktop || {}) },
            mobile: { ...def.mobile, ...(dbData.mobile || {}) },
          });
        }
      });

      // Kullanıcının DB'ye eklediği özel slotlar
      dbMap.forEach((dbData, key) => {
        if (!handledKeys.has(key) && key !== 'ad_header_top' && !dbData.is_deleted) {
          ads.push(dbData);
        }
      });

      return new Response(JSON.stringify({ success: true, data: { ads }, ads }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { results } = await env.DB.prepare(`SELECT * FROM site_templates`).all();
    return new Response(JSON.stringify({ templates: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. PUT / POST İstekleri (Şablon veya Reklam Kaydetme)
  if (method === 'PUT' || method === 'POST') {
    const body = (await request.json()) as any;

    if (isAdsRoute || body.slot_key) {
      const slotKey = body.slot_key;
      if (!slotKey) {
        return new Response(JSON.stringify({ error: 'slot_key zorunludur' }), { status: 400 });
      }

      const id = `tpl_${slotKey}`;
      const title = body.title || slotKey;
      const isEnabled = body.is_enabled ? 1 : 0;
      const metaJson = JSON.stringify(body);

      await env.DB.prepare(
        `INSERT INTO site_templates (id, key_name, content_tr, meta_json, is_active, updated_at)
         VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(key_name) DO UPDATE SET
          content_tr = excluded.content_tr,
          meta_json = excluded.meta_json,
          is_active = excluded.is_active,
          updated_at = CURRENT_TIMESTAMP`
      ).bind(id, slotKey, title, metaJson, isEnabled).run();

      return new Response(JSON.stringify({ success: true, message: 'Reklam ayarları kaydedildi.' }));
    }

    const { key_name, content_tr, content_en, content_ar, meta_json, is_active } = body;
    if (!key_name) {
      return new Response(JSON.stringify({ error: 'key_name zorunludur' }), { status: 400 });
    }

    const id = `tpl_${key_name}`;
    await env.DB.prepare(
      `INSERT INTO site_templates (id, key_name, content_tr, content_en, content_ar, meta_json, is_active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key_name) DO UPDATE SET
        content_tr = excluded.content_tr,
        content_en = excluded.content_en,
        content_ar = excluded.content_ar,
        meta_json = excluded.meta_json,
        is_active = excluded.is_active,
        updated_at = CURRENT_TIMESTAMP`
    ).bind(
      id,
      key_name,
      content_tr || null,
      content_en || null,
      content_ar || null,
      meta_json ? (typeof meta_json === 'string' ? meta_json : JSON.stringify(meta_json)) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ).run();

    return new Response(JSON.stringify({ success: true }));
  }

  // 3. DELETE İstekleri (Reklam Alanı veya Şablon Silme)
  if (method === 'DELETE') {
    let slotKey = url.searchParams.get('slot_key') || (isAdsRoute ? url.pathname.split('/').pop() : '');
    if (slotKey && slotKey !== 'ads') {
      const isDefault = DEFAULT_AD_SLOTS.some((s) => s.slot_key === slotKey) || slotKey === 'ad_header_top';
      if (isDefault) {
        await env.DB.prepare(
          `INSERT INTO site_templates (id, key_name, content_tr, meta_json, is_active, updated_at)
           VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
           ON CONFLICT(key_name) DO UPDATE SET
            meta_json = json_set(COALESCE(meta_json, '{}'), '$.is_deleted', true),
            is_active = 0,
            updated_at = CURRENT_TIMESTAMP`
        ).bind(`tpl_${slotKey}`, slotKey, slotKey, JSON.stringify({ is_deleted: true })).run();
      } else {
        await env.DB.prepare(`DELETE FROM site_templates WHERE key_name = ?`).bind(slotKey).run();
      }
      return new Response(JSON.stringify({ success: true, message: 'Reklam alanı başarıyla silindi.' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const keyName = url.searchParams.get('key_name');
    if (keyName) {
      await env.DB.prepare(`DELETE FROM site_templates WHERE key_name = ?`).bind(keyName).run();
      return new Response(JSON.stringify({ success: true, message: 'Şablon silindi.' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Silinecek reklam alanı belirtilmedi.' }), { status: 400 });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
