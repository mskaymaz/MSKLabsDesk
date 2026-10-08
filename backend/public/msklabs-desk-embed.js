/**
 * MSKLabsDesk Client Embed & Web Entegrasyonu SDK
 * webMSKLabs ve diğer web sitelerinden destek formu, yorum ve bülten aboneliği için kullanılır.
 * i18n: TR, EN, AR dillerini otomatik algılar (navigator.language) ve varsayılan olarak TR'ye düşer.
 */
(function (window) {
  var API_BASE = window.MSK_DESK_API_URL || 'https://msklabsdesk-api.mskaymaz.workers.dev/api';

  var MESSAGES = {
    tr: {
      nameLabel: 'Adınız Soyadınız',
      emailLabel: 'E-Posta Adresiniz',
      categoryLabel: 'Kategori',
      messageLabel: 'Mesajınız',
      submitBtn: 'Destek Talebi Oluştur',
      subscribeBtn: 'Bültene Abone Ol',
      successSupport: 'Destek talebiniz başarıyla alındı. Teşekkür ederiz.',
      successSubscribe: 'Bültene başarıyla abone oldunuz.',
      successComment: 'Yorumunuz alındı. Onay sonrası yayınlanacaktır.',
      errorGeneric: 'Bir hata oluştu. Lütfen tekrar deneyiniz.',
      validationEmail: 'Lütfen geçerli bir e-posta adresi girin.',
      validationRequired: 'Lütfen tüm zorunlu alanları doldurun.'
    },
    en: {
      nameLabel: 'Your Full Name',
      emailLabel: 'Your Email Address',
      categoryLabel: 'Category',
      messageLabel: 'Your Message',
      submitBtn: 'Submit Support Ticket',
      subscribeBtn: 'Subscribe to Newsletter',
      successSupport: 'Support ticket successfully submitted. Thank you.',
      successSubscribe: 'Successfully subscribed to newsletter.',
      successComment: 'Your comment has been submitted and is pending approval.',
      errorGeneric: 'An error occurred. Please try again.',
      validationEmail: 'Please enter a valid email address.',
      validationRequired: 'Please fill in all required fields.'
    },
    ar: {
      nameLabel: 'الاسم الكامل',
      emailLabel: 'عنوان البريد الإلكتروني',
      categoryLabel: 'الفئة',
      messageLabel: 'رسالتك',
      submitBtn: 'إرسال طلب الدعم',
      subscribeBtn: 'الاشتراك في النشرة',
      successSupport: 'تم إرسال طلب الدعم بنجاح. شكراً لك.',
      successSubscribe: 'تم الاشتراك في النشرة بنجاح.',
      successComment: 'تم استلام تعليقك وسيتم نشره بعد الموافقة.',
      errorGeneric: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      validationEmail: 'يرجى إدخال عنوان بريد إلكتروني صاليح.',
      validationRequired: 'يرجى ملء جميع الحقول المطلوبة.'
    }
  };

  function detectLanguage() {
    var raw = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
    var code = raw.split('-')[0];
    if (code === 'en' || code === 'ar' || code === 'tr') {
      return code;
    }
    return 'tr';
  }

  var currentLang = detectLanguage();

  window.MSKDesk = {
    detectLanguage: detectLanguage,
    setLanguage: function(lang) {
      if (MESSAGES[lang]) {
        currentLang = lang;
      }
    },
    getLocaleMessages: function(lang) {
      var target = lang || currentLang;
      return MESSAGES[target] || MESSAGES.tr;
    },

    // 1. Destek Formu Gönderimi
    submitSupportForm: async function (data) {
      var res = await fetch(API_BASE + '/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ lang: currentLang }, data)),
      });
      return res.json();
    },

    // 2. E-Bülten Aboneliği
    subscribeNewsletter: async function (email, preferences) {
      var res = await fetch(API_BASE + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, preferences: preferences || ['all'], lang: currentLang }),
      });
      return res.json();
    },

    // 3. Blog Yorum Gönderimi
    submitComment: async function (data) {
      var res = await fetch(API_BASE + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ lang: currentLang }, data)),
      });
      return res.json();
    },

    // 4. Onaylanmış Blog Yorumlarını Çekme
    loadComments: async function (postId) {
      var res = await fetch(API_BASE + '/comments?post_id=' + encodeURIComponent(postId));
      return res.json();
    }
  };
})(window);
