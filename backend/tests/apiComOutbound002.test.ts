/**
 * MSKLabsDesk — COM-OUTBOUND-002 Çift Kademeli E-Posta Mimarisi Test Paketi
 * File: backend/tests/apiComOutbound002.test.ts
 */

import { sendEmail, maskEmail, escapeHtml, EmailEnv } from '../src/utils/email';
import { handleAdminGetEmailStats } from '../src/routes/adminEmailStats';
import { handleCommentSubmission } from '../src/routes/comments';
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

  async first<T = any>(): Promise<T | null> {
    const res = await this.all<T>();
    return res.results[0] || null;
  }

  async all<T = any>(): Promise<{ results: T[] }> {
    const s = this.sql.trim();

    if (s.includes('FROM comments') && s.includes("status = 'unverified'")) {
      const email = this.params[0];
      const match = this.tables.comments.find((c: any) => c.author_email === email && c.status === 'unverified');
      return { results: match ? [match] : [] };
    }

    if (s.includes('FROM email_daily_stats WHERE stat_date = ?')) {
      const date = this.params[0];
      const row = this.tables.email_daily_stats.find((r: any) => r.stat_date === date);
      return { results: row ? [row] : [] };
    }

    if (s.includes('FROM email_daily_stats WHERE stat_date LIKE ?')) {
      return {
        results: [{
          resend_month: 25,
          brevo_month: 5,
          total_month: 30,
        }],
      };
    }

    if (s.includes('FROM email_outbound_logs')) {
      return { results: this.tables.email_outbound_logs };
    }

    return { results: [] };
  }

  async run(): Promise<{ success: boolean }> {
    const s = this.sql.trim();

    if (s.includes('INSERT INTO comments')) {
      this.tables.comments.push({
        id: this.params[0],
        post_slug: this.params[2],
        author_name: this.params[3],
        author_email: this.params[4],
        status: 'unverified',
        created_at: new Date().toISOString(),
      });
      return { success: true };
    }

    if (s.includes('INSERT INTO email_outbound_logs')) {
      this.tables.email_outbound_logs.push({
        id: this.params[0],
        email_type: this.params[1],
        recipient_masked: this.params[2],
        subject: this.params[3],
        provider: this.params[4],
        status_code: this.params[5],
        is_success: this.params[6],
        error_message: this.params[7],
      });
      return { success: true };
    }

    if (s.includes('INSERT INTO email_daily_stats')) {
      const date = this.params[0];
      let row = this.tables.email_daily_stats.find((r: any) => r.stat_date === date);
      if (!row) {
        row = { stat_date: date, resend_count: 0, brevo_count: 0, total_count: 0 };
        this.tables.email_daily_stats.push(row);
      }
      row.resend_count += this.params[1];
      row.brevo_count += this.params[2];
      row.total_count += 1;
      return { success: true };
    }

    return { success: true };
  }
}

class MockD1Database {
  tables = {
    comments: [] as any[],
    email_outbound_logs: [] as any[],
    email_daily_stats: [] as any[],
  };

  prepare(sql: string) {
    return new MockD1PreparedStatement(sql, [], this.tables);
  }
}

async function runTests() {
  console.log('--- COM-OUTBOUND-002 & Giden E-Posta Testleri Başlatılıyor ---');

  // 1. maskEmail Testi
  const masked1 = maskEmail('info@msklabs.org');
  assert(masked1 === 'i***o@msklabs.org', `maskEmail 1: ${masked1}`);
  const masked2 = maskEmail('ab@test.com');
  assert(masked2 === 'a***@test.com', `maskEmail 2: ${masked2}`);

  // Mock global fetch
  const originalFetch = globalThis.fetch;

  try {
    // 2. Birincil Resend Başarılı Gönderim Testi
    const db = new MockD1Database() as any;
    globalThis.fetch = async (url: any, opts: any) => {
      if (String(url).includes('api.resend.com')) {
        return new Response(JSON.stringify({ id: 'resend_msg_001' }), { status: 200 });
      }
      return new Response('Not found', { status: 404 });
    };

    const resendRes = await sendEmail({
      to: 'kullanici@example.com',
      subject: 'Test Resend',
      html: '<p>Merhaba</p>',
      emailType: 'verification',
    }, {
      RESEND_API_KEY: 're_test_key',
      DB: db,
    });

    assert(resendRes.success === true, 'Resend API başarılı yanıt verdi');
    assert(resendRes.provider === 'RESEND', 'Sağlayıcı RESEND olarak işaretlendi');
    assert(resendRes.messageId === 'resend_msg_001', 'Resend message ID döndürüldü');
    assert(db.tables.email_daily_stats[0]?.resend_count === 1, 'D1 günlük Resend sayacı 1 arttırıldı');

    // 3. Resend HTTP 429 Kota Aşımı -> Brevo Otomatik Devir (Failover) Testi
    globalThis.fetch = async (url: any, opts: any) => {
      const urlStr = String(url);
      if (urlStr.includes('api.resend.com')) {
        return new Response(JSON.stringify({ message: 'Daily quota exceeded' }), { status: 429 });
      }
      if (urlStr.includes('api.brevo.com')) {
        return new Response(JSON.stringify({ messageId: '<brevo_msg_002@smtp.brevo.com>' }), { status: 201 });
      }
      return new Response('Not found', { status: 404 });
    };

    const failoverRes = await sendEmail({
      to: 'kullanici@example.com',
      subject: 'Test Failover',
      html: '<p>Yedek deneme</p>',
      emailType: 'verification',
    }, {
      RESEND_API_KEY: 're_test_key',
      BREVO_API_KEY: 'xkeysib_test_key',
      DB: db,
    });

    assert(failoverRes.success === true, 'Brevo yedek hattı başarıyla devreye girdi');
    assert(failoverRes.provider === 'BREVO', 'Sağlayıcı BREVO olarak işaretlendi');
    assert(failoverRes.messageId === '<brevo_msg_002@smtp.brevo.com>', 'Brevo message ID döndürüldü');
    assert(db.tables.email_daily_stats[0]?.brevo_count === 1, 'D1 günlük Brevo sayacı 1 arttırıldı');

    // 4. Resend 429 ve Brevo Anahtarı Yoksa Düzgün Hata Bildirimi
    const noBrevoRes = await sendEmail({
      to: 'kullanici@example.com',
      subject: 'Test No Brevo',
      html: '<p>Brevo yok</p>',
      emailType: 'verification',
    }, {
      RESEND_API_KEY: 're_test_key',
      DB: db,
    });

    assert(noBrevoRes.success === false, 'Brevo anahtarı yokken 429 hatası bildirildi');
    assert(noBrevoRes.provider === 'RESEND', 'Sağlayıcı RESEND kaldı');

    // 5. Yorum Gönderiminde Suistimal / Cooldown (Bombardıman Koruması) Testi
    const req1 = new Request('https://msklabs.org/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.168.1.1' },
      body: JSON.stringify({
        post_slug: 'test-yazi',
        author_name: 'Ahmet',
        author_email: 'ahmet@example.com',
        content: 'Harika bir yazı.',
      }),
    });

    const commentRes1 = await handleCommentSubmission(req1, { DB: db } as any);
    assert(commentRes1.status === 201, 'İlk yorum talebi başarıyla alındı ve onay postası kuyruğa atıldı (201 Created)');

    // Hemen ardından aynı e-posta ile ikinci istek
    const req2 = new Request('https://msklabs.org/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.168.1.1' },
      body: JSON.stringify({
        post_slug: 'test-yazi',
        author_name: 'Ahmet',
        author_email: 'ahmet@example.com',
        content: 'İkinci yorum denemesi.',
      }),
    });

    const commentRes2 = await handleCommentSubmission(req2, { DB: db } as any);
    assert(commentRes2.status === 429, '3 dakika içinde mükerrer onay talebi HTTP 429 ile engellendi');

    // 6. Admin Email Stats API Testi
    const token = await createSessionToken({ role: 'admin', username: 'admin' }, 'secret_jwt_key_123');
    const statsReq = new Request('https://msklabs.org/api/admin/email-stats', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const statsRes = await handleAdminGetEmailStats(statsReq, {
      DB: db,
      ADMIN_JWT_SECRET: 'secret_jwt_key_123',
    } as any);

    assert(statsRes.status === 200, 'Admin Email Stats API 200 OK döndü');
    const statsData = await statsRes.json() as any;
    assert(statsData.success === true, 'Stats yanıtı başarılı');
    assert(statsData.stats.today.resend_limit === 100, 'Resend günlük tavanı 100 olarak raporlandı');
    assert(statsData.stats.today.brevo_limit === 300, 'Brevo günlük tavanı 300 olarak raporlandı');
    assert(statsData.stats.recent_logs.length >= 2, 'Denetim günlüğünde geçmiş gönderimler listelendi');

  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log('--- COM-OUTBOUND-002 Testleri Başarıyla Tamamlandı ---');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
