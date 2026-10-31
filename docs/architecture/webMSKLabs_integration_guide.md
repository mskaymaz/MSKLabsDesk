# MSKLabsDesk — webMSKLabs Entegrasyon Rehberi

Bu doküman `webMSKLabs` web sitesi ile `MSKLabsDesk` backend API servislerinin entegrasyonu için hazılanmıştır.

---

## 1. SDK Script'inin Eklenmesi
`webMSKLabs` sayfalarının `<head>` veya `<body>` sonuna aşağıdaki script'i ekleyin:

```html
<script src="https://msklabsdesk-api.mskaymaz.workers.dev/msklabs-desk-embed.js"></script>
```

---

## 2. Destek & Talep Formu Entegrasyonu (`webMSKLabs/support.html` veya `haydinamaza.html`)

```javascript
document.getElementById('supportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const result = await MSKDesk.submitSupportForm({
    sender_name: document.getElementById('name').value,
    sender_email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message_content: document.getElementById('message').value,
    category: 'application_feedback'
  });

  if (result.success) {
    alert(`Talebiniz alındı! Bilet Numaranız: ${result.ticket_no}`);
  } else {
    alert('Hata: ' + result.error);
  }
});
```

---

## 3. Blog Yorum Sistemi Entegrasyonu (`webMSKLabs/blog/blog.js`)

```javascript
// Onaylanmış Yorumları Listeleme
async function loadPostComments(postId) {
  const data = await MSKDesk.loadComments(postId);
  if (data.comments) {
    renderCommentsUI(data.comments);
  }
}

// Yorum Gönderme Formu
async function handleCommentSubmit(postId) {
  const result = await MSKDesk.submitComment({
    post_id: postId,
    author_name: document.getElementById('authorName').value,
    author_email: document.getElementById('authorEmail').value,
    content: document.getElementById('commentText').value
  });

  if (result.success) {
    alert('Yorumunuz incelemeye alındı. Teşekkür ederiz!');
  }
}
```

---

## 4. E-Bülten Abonelik Kutusu (`webMSKLabs/footer.html`)

```javascript
document.getElementById('subscribeBtn').addEventListener('click', async () => {
  const email = document.getElementById('newsletterEmail').value;
  const result = await MSKDesk.subscribeNewsletter(email, ['blog', 'apps']);
  
  if (result.success) {
    alert('Aboneliğiniz başarıyla başlatıldı!');
  }
});
```
