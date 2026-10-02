export type Language = 'tr' | 'en' | 'ar';

export interface Translations {
  // Common & Nav
  dashboard: string;
  tickets: string;
  comments: string;
  broadcasts: string;
  subscribers: string;
  settings: string;
  logout: string;
  search: string;
  filter: string;
  all: string;
  save: string;
  close: string;
  cancel: string;
  submit: string;
  copy: string;
  copied: string;
  status: string;
  actions: string;
  loading: string;
  success: string;
  error: string;
  
  // Statuses
  pending: string;
  inProgress: string;
  resolved: string;
  rejected: string;
  approved: string;

  // Dashboard
  totalTickets: string;
  pendingComments: string;
  totalSubscribers: string;
  recentTickets: string;
  aiDraft: string;
  quickStats: string;

  // Tickets
  ticketDetails: string;
  ticketNo: string;
  category: string;
  userEmail: string;
  replyPlaceholder: string;
  sendReply: string;
  giveCoupon: string;
  aiAnalysis: string;

  // Comments
  postUrl: string;
  author: string;
  commentContent: string;
  approveComment: string;
  rejectComment: string;

  // Broadcast
  broadcastTitle: string;
  broadcastSubject: string;
  broadcastContent: string;
  sendBroadcast: string;
  targetPreferences: string;

  // Coupon
  couponModalTitle: string;
  couponCode: string;
  couponDiscount: string;
  generateCoupon: string;

  // Settings
  senderName: string;
  senderEmail: string;
  pushNotifications: string;
  enablePush: string;
  testNotification: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    dashboard: 'Özet Ekranı',
    tickets: 'Destek & Talepler',
    comments: 'Blog Yorumları',
    broadcasts: 'E-Posta Duyuru',
    subscribers: 'Bülten Aboneleri',
    settings: 'Ayarlar',
    logout: 'Çıkış Yap',
    search: 'Arama yap...',
    filter: 'Filtrele',
    all: 'Tümü',
    save: 'Kaydet',
    close: 'Kapat',
    cancel: 'İptal',
    submit: 'Gönder',
    copy: 'Kopyala',
    copied: 'Kopyalandı!',
    status: 'Durum',
    actions: 'İşlemler',
    loading: 'Yükleniyor...',
    success: 'İşlem Başarılı',
    error: 'Bir hata oluştu',

    pending: 'Bekliyor',
    inProgress: 'İşlemde',
    resolved: 'Çözüldü',
    rejected: 'Reddedildi',
    approved: 'Onaylandı',

    totalTickets: 'Toplam Bilet',
    pendingComments: 'Bekleyen Yorumlar',
    totalSubscribers: 'Toplam Abone',
    recentTickets: 'Son Gelen Destek Talepleri',
    aiDraft: 'Gemini AI Cevap Önerisi',
    quickStats: 'Hızlı İstatistikler',

    ticketDetails: 'Bilet Detayı',
    ticketNo: 'Bilet No',
    category: 'Kategori',
    userEmail: 'Kullanıcı E-Postası',
    replyPlaceholder: 'Kullanıcıya iletilecek yanıtı yazın...',
    sendReply: 'Yanıtı Gönder',
    giveCoupon: 'Kupon Tanımla & Teşekkür Et',
    aiAnalysis: 'AI Analizi & Özet',

    postUrl: 'Yazı Bağlantısı',
    author: 'Yazar / İsim',
    commentContent: 'Yorum İçeriği',
    approveComment: 'Yorumu Onayla',
    rejectComment: 'Spam / Reddet',

    broadcastTitle: 'Toplu E-Posta Duyurusu Oluştur',
    broadcastSubject: 'E-Posta Konusu',
    broadcastContent: 'Duyuru İçeriği (HTML desteklenir)',
    sendBroadcast: 'Duyuruyu Gönder',
    targetPreferences: 'Hedef Kitle Tercihleri',

    couponModalTitle: 'Hediye / Teşekkür Kuponu Tanımla',
    couponCode: 'Kupon Kodu',
    couponDiscount: 'İndirim / Hediye Oranı',
    generateCoupon: 'Kupon Oluştur & Gönder',

    senderName: 'E-Posta Gönderici Adı',
    senderEmail: 'E-Posta Gönderici Adresi',
    pushNotifications: 'Web Push Bildirimleri',
    enablePush: 'Push Bildirimlerini Etkinleştir',
    testNotification: 'Test Bildirimi Gönder',
  },

  en: {
    dashboard: 'Dashboard',
    tickets: 'Support Tickets',
    comments: 'Blog Comments',
    broadcasts: 'Email Broadcasts',
    subscribers: 'Subscribers',
    settings: 'Settings',
    logout: 'Logout',
    search: 'Search...',
    filter: 'Filter',
    all: 'All',
    save: 'Save',
    close: 'Close',
    cancel: 'Cancel',
    submit: 'Submit',
    copy: 'Copy',
    copied: 'Copied!',
    status: 'Status',
    actions: 'Actions',
    loading: 'Loading...',
    success: 'Success',
    error: 'An error occurred',

    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    approved: 'Approved',

    totalTickets: 'Total Tickets',
    pendingComments: 'Pending Comments',
    totalSubscribers: 'Total Subscribers',
    recentTickets: 'Recent Support Tickets',
    aiDraft: 'Gemini AI Draft Suggestion',
    quickStats: 'Quick Overview',

    ticketDetails: 'Ticket Details',
    ticketNo: 'Ticket ID',
    category: 'Category',
    userEmail: 'User Email',
    replyPlaceholder: 'Type your reply to the user...',
    sendReply: 'Send Reply',
    giveCoupon: 'Issue Coupon & Thank User',
    aiAnalysis: 'AI Analysis & Summary',

    postUrl: 'Post URL',
    author: 'Author / Name',
    commentContent: 'Comment Text',
    approveComment: 'Approve Comment',
    rejectComment: 'Mark Spam / Reject',

    broadcastTitle: 'Create Email Broadcast',
    broadcastSubject: 'Email Subject',
    broadcastContent: 'Broadcast Content (HTML supported)',
    sendBroadcast: 'Send Broadcast',
    targetPreferences: 'Audience Preferences',

    couponModalTitle: 'Issue Reward / Gift Coupon',
    couponCode: 'Coupon Code',
    couponDiscount: 'Discount / Gift Rate',
    generateCoupon: 'Generate & Email Coupon',

    senderName: 'Sender Name',
    senderEmail: 'Sender Email Address',
    pushNotifications: 'Web Push Notifications',
    enablePush: 'Enable Push Notifications',
    testNotification: 'Send Test Notification',
  },

  ar: {
    dashboard: 'لوحة التحكم',
    tickets: 'تذاكر الدعم والطلبات',
    comments: 'تعليقات المدونة',
    broadcasts: 'النشرات البريدية',
    subscribers: 'المشتركون',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    search: 'بحث...',
    filter: 'تصفية',
    all: 'الكل',
    save: 'حفظ',
    close: 'إغلاق',
    cancel: 'إلغاء',
    submit: 'إرسال',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    status: 'الحالة',
    actions: 'الإجراءات',
    loading: 'جاري التحميل...',
    success: 'تم بنجاح',
    error: 'حدث خطأ ما',

    pending: 'قيد الانتظار',
    inProgress: 'قيد المعالجة',
    resolved: 'تم التحلل',
    rejected: 'مرفوض',
    approved: 'مقبول',

    totalTickets: 'إجمالي التذاكر',
    pendingComments: 'تعليقات في الانتظار',
    totalSubscribers: 'إجمالي المشتركين',
    recentTickets: 'أحدث طلبات الدعم',
    aiDraft: 'مسودة الذكاء الاصطناعي Gemini',
    quickStats: 'نظرة سريعة',

    ticketDetails: 'تفاصيل التذكرة',
    ticketNo: 'رقم التذكرة',
    category: 'الفئة',
    userEmail: 'بريد المستخدم',
    replyPlaceholder: 'اكتب ردك للمستخدم هنا...',
    sendReply: 'إرسال الرد',
    giveCoupon: 'إصدار كوبون هدية وشكر',
    aiAnalysis: 'تحليل وتلخيص AI',

    postUrl: 'رابط المقال',
    author: 'الكاتب / الاسم',
    commentContent: 'محتوى التعليق',
    approveComment: 'الموافقة على التعليق',
    rejectComment: 'رفض / مزعج (Spam)',

    broadcastTitle: 'إنشاء نشرة بريدية جماعية',
    broadcastSubject: 'عنوان الرسالة',
    broadcastContent: 'محتوى النشرة (يدعم HTML)',
    sendBroadcast: 'إرسال النشرة',
    targetPreferences: 'تفضيلات الجمهور المستهدف',

    couponModalTitle: 'إصدار كوبون هدية أو شكر',
    couponCode: 'رمز الكوبون',
    couponDiscount: 'نسبة الخصم / الهدية',
    generateCoupon: 'إنشاء وإرسال الكوبون',

    senderName: 'اسم المرسل',
    senderEmail: 'عنوان بريد المرسل',
    pushNotifications: 'إشعارات الويب (Push)',
    enablePush: 'تفعيل إشعارات الويب',
    testNotification: 'إرسال إشعار تجريبي',
  },
};
