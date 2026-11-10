/**
 * MSKLabsDesk — Birleşik Bildirim & Mesajlaşma Merkezi (Inbox Hub) API Testleri
 * File: backend/tests/apiInboxUnified.test.ts
 */

import { handleAdminGetUnifiedInbox, handleAdminGetInboxSummary } from '../src/routes/adminInboxUnified';
import { createSessionToken } from '../src/utils/auth';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

// Mock D1 Database
class MockD1PreparedStatement {
  constructor(private sql: string, private params: any[], private tables: any) {}

  bind(...params: any[]) {
    return new MockD1PreparedStatement(this.sql, params, this.tables);
  }

  async all<T = any>(): Promise<{ results: T[] }> {
    const s = this.sql.trim();

    if (s.includes('FROM blog_channels')) {
      return { results: this.tables.blog_channels || [] };
    }

    if (s.includes('FROM comments c')) {
      // Grouping query for summary
      const counts: any[] = [];
      for (const c of this.tables.comments) {
        if (['pending', 'unverified'].includes(c.status)) {
          counts.push({
            channel_key: c.post_type || 'bizce',
            status: c.status,
            cnt: 1
          });
        }
      }
      return { results: counts };
    }

    if (s.includes('category != \'email\'') || s.includes('category IS NULL')) {
      const counts: any[] = [];
      for (const m of this.tables.messages) {
        if (m.category !== 'email' && ['new', 'open', 'in_progress'].includes(m.status)) {
          counts.push({
            category: m.category,
            status: m.status,
            urgency: m.urgency,
            cnt: 1
          });
        }
      }
      return { results: counts };
    }

    if (s.includes('category = \'email\'')) {
      const emails = this.tables.messages
        .filter((m: any) => m.category === 'email' && ['new', 'open', 'in_progress'].includes(m.status))
        .map((m: any) => ({
          id: m.id,
          status: m.status,
          urgency: m.urgency,
          recipient_to: 'iletisim@msklabs.org'
        }));
      return { results: emails };
    }

    if (s.includes('FROM messages')) {
      const limit = this.params[0] || 50;
      const res = this.tables.messages
        .filter((m: any) => ['new', 'open', 'in_progress'].includes(m.status))
        .slice(0, limit);
      return { results: res };
    }

    if (s.includes('FROM comments')) {
      const limit = this.params[0] || 50;
      const res = this.tables.comments
        .filter((c: any) => ['pending', 'unverified'].includes(c.status))
        .slice(0, limit);
      return { results: res };
    }

    return { results: [] };
  }
}

class MockD1Database {
  tables = {
    messages: [
      {
        id: 'TICK-101',
        sender_name: 'Ahmet Yılmaz',
        sender_email: 'ahmet@example.com',
        subject: 'Fatura İtirazı',
        content: 'Faturamda bir yanlışlık olduğunu düşünüyorum, lütfen inceleyin.',
        category: 'support',
        status: 'new',
        urgency: 'high',
        ai_summary: 'Müşteri fatura itirazında bulunuyor.',
        created_at: '2026-11-05T10:00:00Z',
      },
      {
        id: 'TICK-102',
        sender_name: 'Mehmet Demir',
        sender_email: 'mehmet@corp.com',
        subject: 'Kurumsal İş Birliği Teklifi',
        content: 'Merhabalar, sizinle yazılım entegrasyonu konusunda görüşmek isteriz.',
        category: 'email',
        status: 'new',
        urgency: 'normal',
        ai_summary: 'İş birliği ve entegrasyon teklifi.',
        created_at: '2026-11-05T11:00:00Z',
      },
      {
        id: 'TICK-103',
        sender_name: 'Eski Müşteri',
        sender_email: 'eski@example.com',
        subject: 'Eski Çözülmüş Talep',
        content: 'Sorunum çözüldü teşekkürler.',
        category: 'support',
        status: 'closed', // Kapalı, sayılmamalı
        urgency: 'low',
        created_at: '2026-11-01T10:00:00Z',
      },
    ],
    comments: [
      {
        id: 'comm_1',
        post_slug: 'yerel-oncelikli-mimari',
        author_name: 'Canan Kaya',
        author_email: 'canan@dev.org',
        content: 'Çok faydalı bir yazı olmuş, SQLite senkronizasyonu harika.',
        status: 'pending',
        created_at: '2026-11-05T10:30:00Z',
      },
      {
        id: 'comm_2',
        post_slug: 'cloudflare-d1-rehberi',
        author_name: 'Onaylı Yorumcu',
        author_email: 'onayli@example.com',
        content: 'Bu yorum zaten onaylanmış.',
        status: 'approved', // Onaylı, sayılmamalı
        created_at: '2026-11-04T10:00:00Z',
      },
    ],
  };

  prepare(sql: string) {
    return new MockD1PreparedStatement(sql, [], this.tables);
  }
}

async function runTests() {
  console.log('--- 5.1 BİRLEŞİK BİLDİRİM & INBOX HUB API TESTLERİ BAŞLIYOR ---');
  const db = new MockD1Database();
  const secret = 'test_secret_key_777';

  // 1. Yetkisiz Erişim Testi
  const unauthReq = new Request('https://msklabs.org/api/v1/inbox/unified', { method: 'GET' });
  const unauthRes = await handleAdminGetUnifiedInbox(unauthReq, { DB: db, ADMIN_JWT_SECRET: secret } as any);
  assert(unauthRes.status === 401, 'Yetkisiz erişimde HTTP 401 dönmeli');

  // 2. Başarılı Yetkili İstek
  const token = await createSessionToken({ role: 'admin', username: 'admin' }, secret);
  const req = new Request('https://msklabs.org/api/v1/inbox/unified', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  const res = await handleAdminGetUnifiedInbox(req, { DB: db, ADMIN_JWT_SECRET: secret } as any);
  assert(res.status === 200, 'Yetkili istekte HTTP 200 dönmeli');
  const data = await res.json() as any;

  assert(data.success === true, 'Response success: true olmalı');
  assert(data.counts.total_unread === 3, `Toplam okunmamış 3 olmalı (Bulunan: ${data.counts.total_unread})`);
  assert(data.counts.tickets === 1, `Destek biletleri 1 olmalı (Bulunan: ${data.counts.tickets})`);
  assert(data.counts.emails === 1, `Gelen e-postalar 1 olmalı (Bulunan: ${data.counts.emails})`);
  assert(data.counts.comments === 1, `Bekleyen yorumlar 1 olmalı (Bulunan: ${data.counts.comments})`);

  assert(data.items.length === 3, `Birleşik liste 3 öğe içermeli (Bulunan: ${data.items.length})`);

  // 3. Sıralama Kontrolü (En yeni önce gelmeli: 11:00 > 10:30 > 10:00)
  assert(data.items[0].id === 'TICK-102', 'En yeni öğe ilk sırada olmalı (TICK-102)');
  assert(data.items[0].type === 'email', 'TICK-102 type email olmalı');
  assert(data.items[0].target_route === 'tickets', 'E-postanın hedef sekmesi tickets olmalı');

  assert(data.items[1].id === 'comm_1', 'İkinci öğe comm_1 olmalı');
  assert(data.items[1].type === 'comment', 'comm_1 type comment olmalı');
  assert(data.items[1].target_route === 'comments', 'Yorumun hedef sekmesi comments olmalı');

  assert(data.items[2].id === 'TICK-101', 'Üçüncü öğe TICK-101 olmalı');
  assert(data.items[2].type === 'ticket', 'TICK-101 type ticket olmalı');

  // 4. Tür Filtresi Testi (?type=comment)
  const commentFilterReq = new Request('https://msklabs.org/api/v1/inbox/unified?type=comment', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const filterRes = await handleAdminGetUnifiedInbox(commentFilterReq, { DB: db, ADMIN_JWT_SECRET: secret } as any);
  const filterData = await filterRes.json() as any;
  assert(filterData.items.length === 1, 'Filtrelenmiş yanıtta sadece 1 yorum dönmeli');
  assert(filterData.items[0].type === 'comment', 'Dönen öğe yorum türünde olmalı');

  // 5. INBOX-APP-001: Özet Metrik Servisi Testi (/api/admin/inbox/summary)
  const summaryReq = new Request('https://msklabs.org/api/admin/inbox/summary', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const summaryRes = await handleAdminGetInboxSummary(summaryReq, { DB: db, ADMIN_JWT_SECRET: secret } as any);
  assert(summaryRes.status === 200, `Summary API HTTP 200 dönmeli (Status: ${summaryRes.status})`);
  const summaryData = await summaryRes.json() as any;
  assert(summaryData.success === true, 'Summary success true olmalı');
  assert(Array.isArray(summaryData.blog_channels), 'blog_channels dizi olmalı');
  assert(Array.isArray(summaryData.support_categories), 'support_categories dizi olmalı');
  assert(Array.isArray(summaryData.email_boxes), 'email_boxes dizi olmalı');
  assert(summaryData.totals.all_actionable >= 0, 'all_actionable sayı olmalı');

  console.log('--- 5.1 & INBOX-APP-001 HUB TESTLERİ BAŞARIYLA TAMAMLANDI ---');
}

runTests().catch(err => {
  console.error('Test hatası:', err);
  process.exit(1);
});
