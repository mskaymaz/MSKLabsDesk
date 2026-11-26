import { escapeHtml } from './email';

export type Language = 'tr' | 'en' | 'ar';

export interface TicketVerifyLinks {
  confirmUrl: string;
  cancelUrl: string;
}

export interface TicketConfirmationMeta {
  category?: string;
  app?: string;
  version?: string | null;
  os?: string | null;
  subject?: string;
  content?: string;
}

function formatCategoryLabel(category: string | undefined, lang: Language): string {
  const key = (category || 'general').trim().toLowerCase();
  const labels: Record<string, Record<Language, string>> = {
    bug: { tr: 'Hata Bildirimi', en: 'Bug Report', ar: 'الإبلاغ عن خطأ' },
    hata: { tr: 'Hata Bildirimi', en: 'Bug Report', ar: 'الإبلاغ عن خطأ' },
    feature: { tr: 'Özellik Talebi', en: 'Feature Request', ar: 'طلب ميزة' },
    istek: { tr: 'Özellik Talebi', en: 'Feature Request', ar: 'طلب ميزة' },
    idea: { tr: 'Fikir / Öneri', en: 'Idea / Suggestion', ar: 'فكرة / اقتراح' },
    fikir: { tr: 'Fikir / Öneri', en: 'Idea / Suggestion', ar: 'فكرة / اقتراح' },
    thanks: { tr: 'Teşekkür / Geri Bildirim', en: 'Thanks / Feedback', ar: 'شكر / ملاحظات' },
    tesekkur: { tr: 'Teşekkür / Geri Bildirim', en: 'Thanks / Feedback', ar: 'شكر / ملاحظات' },
    billing: { tr: 'Ödeme / Abonelik', en: 'Billing / Subscription', ar: 'الدفع / الاشتراك' },
    general: { tr: 'Genel Destek', en: 'General Support', ar: 'دعم عام' },
    muhtelif: { tr: 'Muhtelif', en: 'Miscellaneous', ar: 'متنوع' },
    other: { tr: 'Diğer', en: 'Other', ar: 'أخرى' },
  };
  if (labels[key]) return labels[key][lang];
  return escapeHtml(category || '-');
}

function formatPlatformLabel(os: string | null | undefined, lang: Language): string {
  const raw = (os || '').trim();
  if (!raw || raw === '-') return '-';
  const lower = raw.toLowerCase();
  if (lower === 'web' || lower.includes('browser') || lower.includes('tarayıcı')) {
    return 'Web';
  }
  if (lower === 'android' || lower === 'ios' || lower === 'mobile' || lower === 'mobil') {
    const mobileTag: Record<Language, string> = { tr: 'Mobil', en: 'Mobile', ar: 'جوال' };
    const pretty = lower === 'ios' ? 'iOS' : lower === 'android' ? 'Android' : mobileTag[lang];
    return lower === 'mobile' || lower === 'mobil' ? mobileTag[lang] : `${mobileTag[lang]} (${pretty})`;
  }
  return escapeHtml(raw);
}

export function getTicketConfirmationEmail(
  ticketNo: string,
  name: string,
  lang: Language = 'tr',
  verifyLinks?: TicketVerifyLinks,
  meta?: TicketConfirmationMeta
): { subject: string; html: string } {
  const isRtl = lang === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'right' : 'left';
  const safeName = escapeHtml(name);
  const safeTicketNo = escapeHtml(ticketNo);

  const subjects: Record<Language, string> = verifyLinks
    ? {
        tr: `[${safeTicketNo}] Destek Talebinizi Onaylayın — MSK Labs`,
        en: `[${safeTicketNo}] Confirm Your Support Ticket — MSK Labs`,
        ar: `[${safeTicketNo}] تأكيد طلب الدعم — MSK Labs`,
      }
    : {
        tr: `[${safeTicketNo}] Destek Talebiniz Alındı — MSK Labs`,
        en: `[${safeTicketNo}] Support Ticket Received — MSK Labs`,
        ar: `[${safeTicketNo}] تم استلام طلب الدعم — MSK Labs`,
      };

  const titles: Record<Language, string> = verifyLinks
    ? {
        tr: 'Destek Talebinizi Onaylayın',
        en: 'Confirm Your Support Ticket',
        ar: 'تأكيد طلب الدعم الخاص بك',
      }
    : {
        tr: 'Destek Talebiniz Başarıyla Alındı',
        en: 'Your Support Ticket Has Been Received',
        ar: 'تم استلام طلب الدعم بنجاح',
      };

  const greetings: Record<Language, string> = {
    tr: `Merhaba ${safeName || 'Değerli Ziyaretçimiz'},`,
    en: `Hello ${safeName || 'Valued User'},`,
    ar: `مرحباً ${safeName || 'عزيزنا المستخدم'}،`,
  };

  const bodies: Record<Language, string> = verifyLinks
    ? {
        tr: `Destek talebiniz oluşturuldu. Talebinizin ekibimize iletilip işleme alınabilmesi için lütfen aşağıdaki butona tıklayarak e-posta adresinizi onaylayın.`,
        en: `Your support request has been created. Please confirm your email address using the button below so our team can review and respond to your ticket.`,
        ar: `تم إنشاء طلب الدعم الخاص بك. يرجى تأكيد بريدك الإلكتروني عبر الزر أدناه ليتمكن فريقنا من مراجعة طلبك والرد عليك.`,
      }
    : {
        tr: `Destek talebiniz sistemimize ulaşmıştır. Ekibimiz mesajınızı en kısa sürede inceleyip bu e-posta adresi üzerinden dönüş yapacaktır.`,
        en: `Your support request has reached our system. Our team will review your message shortly and reply via this email address.`,
        ar: `لقد وصل طلب الدعم الخاص بك إلى نظامنا. سيقوم فريقنا بمراجعة رسالتك والرد عليك في أقرب وقت عبر هذا البريد الإلكتروني.`,
      };

  const confirmLabels: Record<Language, string> = {
    tr: '✅ Talebimi Onayla',
    en: '✅ Confirm Request',
    ar: '✅ تأكيد الطلب',
  };

  const cancelLabels: Record<Language, string> = {
    tr: '❌ İptal Et',
    en: '❌ Cancel',
    ar: '❌ إلغاء',
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

  const metaLabels: Record<Language, {
    summaryTitle: string;
    category: string;
    app: string;
    version: string;
    platform: string;
    subject: string;
    messageTitle: string;
  }> = {
    tr: {
      summaryTitle: 'Talep Özeti',
      category: 'Talep Grubu',
      app: 'Uygulama',
      version: 'Sürüm',
      platform: 'Ortam / Platform',
      subject: 'Konu',
      messageTitle: 'Gönderdiğiniz Talep Metni',
    },
    en: {
      summaryTitle: 'Request Summary',
      category: 'Request Group',
      app: 'Application',
      version: 'Version',
      platform: 'Platform',
      subject: 'Subject',
      messageTitle: 'Your Request Message',
    },
    ar: {
      summaryTitle: 'ملخص الطلب',
      category: 'مجموعة الطلب',
      app: 'التطبيق',
      version: 'الإصدار',
      platform: 'المنصة',
      subject: 'الموضوع',
      messageTitle: 'نص طلبك المرسل',
    },
  };

  const labels = metaLabels[lang];
  const safeApp = escapeHtml(meta?.app || (lang === 'tr' ? 'Genel' : lang === 'en' ? 'General' : 'عام'));
  const safeVersion = escapeHtml(meta?.version || '-');
  const safeCategory = formatCategoryLabel(meta?.category, lang);
  const safePlatform = formatPlatformLabel(meta?.os, lang);
  const safeSubject = escapeHtml(meta?.subject || '');
  const safeContent = meta?.content ? escapeHtml(meta.content).replace(/\n/g, '<br />') : '';

  const metaPanelHtml = meta
    ? `<div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin: 18px 0 12px; font-size: 13px; color: #334155;">
         <div style="font-weight: 700; color: #0f172a; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.03em;">${labels.summaryTitle}</div>
         <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
           <tr>
             <td style="padding: 3px 0; color: #64748b; width: 38%;">${labels.category}:</td>
             <td style="padding: 3px 0; color: #0f172a; font-weight: 600;">${safeCategory}</td>
           </tr>
           <tr>
             <td style="padding: 3px 0; color: #64748b;">${labels.app}:</td>
             <td style="padding: 3px 0; color: #0f172a; font-weight: 600;">${safeApp}</td>
           </tr>
           <tr>
             <td style="padding: 3px 0; color: #64748b;">${labels.version}:</td>
             <td style="padding: 3px 0; color: #0f172a; font-weight: 600;">${safeVersion}</td>
           </tr>
           <tr>
             <td style="padding: 3px 0; color: #64748b;">${labels.platform}:</td>
             <td style="padding: 3px 0; color: #0f172a; font-weight: 600;">${safePlatform}</td>
           </tr>
           ${safeSubject ? `<tr><td style="padding: 3px 0; color: #64748b;">${labels.subject}:</td><td style="padding: 3px 0; color: #0f172a; font-weight: 600;">${safeSubject}</td></tr>` : ''}
         </table>
       </div>`
    : '';

  const messageBoxHtml = safeContent
    ? `<div style="background: #ffffff; border: 1px solid #cbd5e1; border-${isRtl ? 'right' : 'left'}: 4px solid #2563eb; border-radius: 8px; padding: 14px 16px; margin: 12px 0 20px;">
         <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px;">${labels.messageTitle}</div>
         <div style="font-size: 14px; line-height: 1.6; color: #1e293b;">${safeContent}</div>
       </div>`
    : '';

  const actionHtml = verifyLinks
    ? `<div style="text-align: center; margin: 24px 0 8px;">
         <a href="${escapeHtml(verifyLinks.confirmUrl)}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; padding: 11px 22px; border-radius: 8px; font-size: 14px; margin: 4px;">${confirmLabels[lang]}</a>
         <a href="${escapeHtml(verifyLinks.cancelUrl)}" style="display: inline-block; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; text-decoration: none; font-weight: 600; padding: 11px 18px; border-radius: 8px; font-size: 14px; margin: 4px;">${cancelLabels[lang]}</a>
       </div>`
    : '';

  const html = `
    <!DOCTYPE html>
    <html dir="${dir}" lang="${lang}">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; direction: ${dir}; text-align: ${textAlign}; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05); }
        .header { text-align: center; margin-bottom: 24px; }
        .badge { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-weight: 700; padding: 6px 16px; border-radius: 20px; display: inline-block; font-size: 13px; }
        .title { font-size: 20px; font-weight: 700; margin-top: 16px; color: #0f172a; }
        .content { font-size: 15px; line-height: 1.6; color: #334155; margin-top: 16px; }
        .footer { border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 16px; font-size: 13px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="badge">${ticketLabel[lang]}: ${safeTicketNo}</div>
          <div class="title">${titles[lang]}</div>
        </div>
        <div class="content">
          <p>${greetings[lang]}</p>
          <p>${bodies[lang]}</p>
        </div>
        ${metaPanelHtml}
        ${messageBoxHtml}
        ${actionHtml}
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
  const safeName = escapeHtml(name);
  const safeTicketNo = escapeHtml(ticketNo);
  const safeReplyMessage = escapeHtml(replyMessage).replace(/\n/g, '<br />');

  const subjects: Record<Language, string> = {
    tr: `[${safeTicketNo}] Destek Talebiniz Yanıtlandı — MSK Labs`,
    en: `[${safeTicketNo}] Response to Your Support Ticket — MSK Labs`,
    ar: `[${safeTicketNo}] تم الرد على طلب الدعم — MSK Labs`,
  };

  const greetings: Record<Language, string> = {
    tr: `Merhaba ${safeName || 'Değerli Kullanıcımız'},`,
    en: `Hello ${safeName || 'Valued User'},`,
    ar: `مرحباً ${safeName || 'عزيزنا المستخدم'}،`,
  };

  const introTexts: Record<Language, string> = {
    tr: `${safeTicketNo} numaralı destek talebiniz yöneticimiz tarafından yanıtlanmıştır:`,
    en: `Your support ticket #${safeTicketNo} has been answered by our admin team:`,
    ar: `تم الرد على طلب الدعم رقم ${safeTicketNo} من قبل فريق الإدارة:`,
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; direction: ${dir}; text-align: ${textAlign}; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05); }
        .reply-box { background: #f8fafc; border-left: ${isRtl ? 'none' : '4px solid #2563eb'}; border-right: ${isRtl ? '4px solid #2563eb' : 'none'}; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; color: #1e293b; font-size: 15px; line-height: 1.6; }
        .footer { border-top: 1px solid #e2e8f0; margin-top: 28px; padding-top: 16px; font-size: 13px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <p>${greetings[lang]}</p>
        <p>${introTexts[lang]}</p>
        <div class="reply-box">${safeReplyMessage}</div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} MSK Labs — ${footerTexts[lang]}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject: subjects[lang], html };
}
