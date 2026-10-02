/**
 * MSKLabsDesk Client Embed & Web Entegrasyonu SDK
 * webMSKLabs ve diğer web sitelerinden destek formu, yorum ve bülten aboneliği için kullanılır.
 */
(function (window) {
  var API_BASE = window.MSK_DESK_API_URL || 'https://msklabsdesk-api.mskaymaz.workers.dev/api';

  window.MSKDesk = {
    // 1. Destek Formu Gönderimi
    submitSupportForm: async function (data) {
      var res = await fetch(API_BASE + '/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },

    // 2. E-Bülten Aboneliği
    subscribeNewsletter: async function (email, preferences) {
      var res = await fetch(API_BASE + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, preferences: preferences || ['all'] }),
      });
      return res.json();
    },

    // 3. Blog Yorum Gönderimi
    submitComment: async function (data) {
      var res = await fetch(API_BASE + '/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
