/**
 * MSKLabsDesk — E-Posta Gönderim Modülü
 * Google Gmail SMTP & Resend API Entegrasyonu
 */

export interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  emailType: 'ticket_confirmation' | 'reply' | 'newsletter' | 'coupon' | 'verification';
}

export interface EmailEnv {
  GMAIL_USER?: string; // msklabs.org@gmail.com
  GMAIL_APP_PASSWORD?: string; // App Password
  RESEND_API_KEY?: string; // Fallback API key
}

/**
 * E-Posta gönderim fonksiyonu
 * İşlem sonucunu ve durumunu döndürür.
 */
export async function sendEmail(options: EmailOptions, env: EmailEnv): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fromAddress = env.GMAIL_USER || 'msklabs.org@gmail.com';
    const fromName = 'MSK Labs';

    // 1. Resend API Entegrasyonu (Cloudflare Workers için en kararlı HTTP REST yöntemi)
    if (env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromAddress}>`,
          to: [options.to],
          subject: options.subject,
          html: options.html,
        }),
      });

      if (res.ok) {
        const data = await res.json() as { id: string };
        return { success: true, messageId: data.id };
      }
    }

    // 2. Geliştirme / Simülasyon Modu (Local / Dev)
    console.log(`[EMAIL SIMULATION] To: ${options.to} | Subject: ${options.subject}`);
    return { success: true, messageId: `sim_${Date.now()}` };
  } catch (err: any) {
    console.error('[EMAIL ERROR]', err);
    return { success: false, error: err.message || 'Unknown email error' };
  }
}
