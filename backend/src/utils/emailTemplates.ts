export type Language = 'tr' | 'en' | 'ar';

export function getTicketConfirmationEmail(ticketNo: string, name: string, lang: Language = 'tr'): { subject: string; html: string } {
  const isRtl = lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'right' : 'left';

  const subjects: Record<Language, string> = {
    tr: `[${ticketNo}] Destek Talebiniz Alındı — MSK Labs`,
    en: `[${ticketNo}] Support Ticket Received — MSK Labs`,
    ar: `[${ticketNo}] تم استلام طلب الدعم — MSK Labs`,
  };

  const titles: Record<Language, string> = {
    tr: 'Destek Talebiniz Başarıyla Alındı',
    en: 'Your Support Ticket Has Been Received',
    ar: 'تم استلام طلب الدعم بنجاح',
  };

  const greetings: Record<Language, string> = {
    tr: `Merhaba ${name || 'Değerli Ziyaretçimiz'},`,
    en: `Hello ${name || 'Valued User'},`,
    ar: `مرحباً ${name || 'عزيزنا المستخدم'}،`,
  };

  const bodies: Record<Language, string> = {
    tr: `Destek talebiniz sistemimize ulaşmıştır. Ekibimiz mesajınızı en kısa sürede inceleyip bu e-posta adresi üzerinden dönüş yapacaktır.`,
    en: `Your support request has reached our system. Our team will review your message shortly and reply via this email address.`,
    ar: `لقد وصل طلب الدعم الخاص بك إلى نظامنا. سيقوم فريقنا بمراجعة رسالتك والرد عليك في أقرب وقت عبر هذا البريد الإلكتروني.`,
  };

  const ticketLabel: Record<Language, string> = {
    tr: 'Bilet Numarası',
    en: 'Ticket Number',
    ar: 'رقم التذكرة',
  };

  const footerTexts: Record<Language, string> = {
    tr: 'MSK Labs Destek Ekibi',
    en: 'MSK Labs Support Team',
    ar: 'فريق دعم MSK Labs',
  };

  const html = `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 20px; direction: ${dir}; text-align: ${textAlign}; }
        .card { max-width: 600px; margin: 0 auto; background: #121826; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; }
        .header { text-align: center; margin-bottom: 24px; }
        .badge { background: #6366f1; color: #fff; font-weight: bold; padding: 6px 16px; border-radius: 20px; display: inline-block; font-size: 14px; }
        .title { font-size: 20px; font-weight: bold; margin-top: 16px; color: #ffffff; }
        .content { font-size: 15px; line-height: 1.6; color: #9ca3af; margin-top: 20px; }
        .footer { border-top: 1px solid rgba(255,255,255,0.08); margin-top: 32px; padding-top: 16px; font-size: 13px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="badge">${ticketLabel[lang]}: ${ticketNo}</div>
          <div class="title">${titles[lang]}</div>
        </div>
        <div class="content">
          <p>${greetings[lang]}</p>
          <p>${bodies[lang]}</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MSK Labs — ${footerTexts[lang]}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject: subjects[lang], html };
}

export function getTicketReplyEmail(ticketNo: string, replyMessage: string, name: string, lang: Language = 'tr'): { subject: string; html: string } {
  const isRtl = lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'right' : 'left';

  const subjects: Record<Language, string> = {
    tr: `[${ticketNo}] Destek Talebiniz Yanıtlandı — MSK Labs`,
    en: `[${ticketNo}] Response to Your Support Ticket — MSK Labs`,
    ar: `[${ticketNo}] تم الرد على طلب الدعم — MSK Labs`,
  };

  const greetings: Record<Language, string> = {
    tr: `Merhaba ${name || 'Değerli Kullanıcımız'},`,
    en: `Hello ${name || 'Valued User'},`,
    ar: `مرحباً ${name || 'عزيزنا المستخدم'}،`,
  };

  const introTexts: Record<Language, string> = {
    tr: `${ticketNo} numaralı destek talebiniz yöneticimiz tarafından yanıtlanmıştır:`,
    en: `Your support ticket #${ticketNo} has been answered by our admin team:`,
    ar: `تم الرد على طلب الدعم رقم ${ticketNo} من قبل فريق الإدارة:`,
  };

  const footerTexts: Record<Language, string> = {
    tr: 'MSK Labs Destek Ekibi',
    en: 'MSK Labs Support Team',
    ar: 'فريق دعم MSK Labs',
  };

  const html = `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 20px; direction: ${dir}; text-align: ${textAlign}; }
        .card { max-width: 600px; margin: 0 auto; background: #121826; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 32px; }
        .reply-box { background: rgba(99, 102, 241, 0.1); border-left: ${isRtl ? 'none' : '4px solid #6366f1'}; border-right: ${isRtl ? '4px solid #6366f1' : 'none'}; padding: 16px; border-radius: 8px; margin: 20px 0; color: #f3f4f6; font-size: 15px; line-height: 1.6; white-space: pre-wrap; }
        .footer { border-top: 1px solid rgba(255,255,255,0.08); margin-top: 32px; padding-top: 16px; font-size: 13px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <p>${greetings[lang]}</p>
        <p>${introTexts[lang]}</p>
        <div class="reply-box">${replyMessage}</div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MSK Labs — ${footerTexts[lang]}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject: subjects[lang], html };
}
