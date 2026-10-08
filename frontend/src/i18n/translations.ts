export type Language = 'tr' | 'en' | 'ar';

export interface NamespaceTranslations {
  common: {
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
    delete: string;
    edit: string;
    add: string;
    refresh: string;
    view: string;
    confirm: string;
    welcome: string;
  };
  auth: {
    loginTitle: string;
    loginSub: string;
    email: string;
    password: string;
    loginButton: string;
    loggingIn: string;
    loginError: string;
  };
  dashboard: {
    totalTickets: string;
    pendingComments: string;
    totalSubscribers: string;
    recentTickets: string;
    aiDraft: string;
    quickStats: string;
    channelsOverview: string;
  };
  tickets: {
    ticketDetails: string;
    ticketNo: string;
    category: string;
    userEmail: string;
    replyPlaceholder: string;
    sendReply: string;
    giveCoupon: string;
    aiAnalysis: string;
    count: string;
    pending: string;
    inProgress: string;
    resolved: string;
    rejected: string;
    replyError: string;
    statusError: string;
    loadError: string;
  };
  comments: {
    postUrl: string;
    author: string;
    commentContent: string;
    approveComment: string;
    rejectComment: string;
    pendingCount: string;
    updateError: string;
  };
  channels: {
    title: string;
    addChannel: string;
    channelName: string;
    slug: string;
    postCount: string;
  };
  posts: {
    title: string;
    newPost: string;
    postTitle: string;
    status: string;
    published: string;
    draft: string;
    revisions: string;
    editor: string;
    preview: string;
    fillTrFirst: string;
    aiSuccess: string;
  };
  apps: {
    title: string;
    newApp: string;
    appName: string;
    apiKey: string;
  };
  templates: {
    title: string;
    newTemplate: string;
    templateName: string;
  };
  broadcast: {
    broadcastTitle: string;
    broadcastSubject: string;
    broadcastContent: string;
    sendBroadcast: string;
    targetPreferences: string;
    sendError: string;
  };
  subscribers: {
    title: string;
    email: string;
    subscribedAt: string;
    export: string;
  };
  settings: {
    title: string;
    senderName: string;
    senderEmail: string;
    pushNotifications: string;
    enablePush: string;
    testNotification: string;
    pushDenied: string;
    pushUnsupported: string;
  };
  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
  };
  a11y: {
    mainNav: string;
    userMenu: string;
    searchModal: string;
  };
}

const trDict: NamespaceTranslations = {
  common: {
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
    delete: 'Sil',
    edit: 'Düzenle',
    add: 'Ekle',
    refresh: 'Yenile',
    view: 'Görüntüle',
    confirm: 'Onayla',
    welcome: 'Hoş geldiniz {{name}}',
  },
  auth: {
    loginTitle: 'MSKLabs Yönetim Paneli',
    loginSub: 'Giriş yapmak için bilgilerinizi giriniz',
    email: 'E-Posta Adresi',
    password: 'Şifre',
    loginButton: 'Giriş Yap',
    loggingIn: 'Giriş Yapılıyor...',
    loginError: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
  },
  dashboard: {
    totalTickets: 'Toplam Bilet',
    pendingComments: 'Bekleyen Yorumlar',
    totalSubscribers: 'Toplam Abone',
    recentTickets: 'Son Gelen Destek Talepleri',
    aiDraft: 'Gemini AI Cevap Önerisi',
    quickStats: 'Hızlı İstatistikler',
    channelsOverview: 'Kanal Genel Bakış',
  },
  tickets: {
    ticketDetails: 'Bilet Detayı',
    ticketNo: 'Bilet No',
    category: 'Kategori',
    userEmail: 'Kullanıcı E-Postası',
    replyPlaceholder: 'Kullanıcıya iletilecek yanıtı yazın...',
    sendReply: 'Yanıtı Gönder',
    giveCoupon: 'Kupon Tanımla & Teşekkür Et',
    aiAnalysis: 'AI Analizi & Özet',
    count: 'Toplam {{count}} bilet listeleniyor',
    pending: 'Bekliyor',
    inProgress: 'İşlemde',
    resolved: 'Çözüldü',
    rejected: 'Reddedildi',
    replyError: 'Cevap gönderilemedi.',
    statusError: 'Durum güncellenemedi.',
    loadError: 'Bilet detayı yüklenemedi.',
  },
  comments: {
    postUrl: 'Yazı Bağlantısı',
    author: 'Yazar / İsim',
    commentContent: 'Yorum İçeriği',
    approveComment: 'Yorumu Onayla',
    rejectComment: 'Spam / Reddet',
    pendingCount: 'Onay bekleyen {{count}} yorum var',
    updateError: 'Yorum durumu güncellenemedi.',
  },
  channels: {
    title: 'Kanal Yönetimi',
    addChannel: 'Yeni Kanal Ekle',
    channelName: 'Kanal Adı',
    slug: 'Slug',
    postCount: 'Yazı Sayısı',
  },
  posts: {
    title: 'İçerik & Blog Yönetimi',
    newPost: 'Yeni Yazı Ekle',
    postTitle: 'Yazı Başlığı',
    status: 'Yayın Durumu',
    published: 'Yayında',
    draft: 'Taslak',
    revisions: 'Revizyon Geçmişi',
    editor: 'İçerik Düzenleyici',
    preview: 'Önizleme',
    fillTrFirst: 'Lütfen önce Türkçe başlık ve içerik alanlarını doldurun!',
    aiSuccess: '✨ Gemini AI ile İngilizce ve Arapça çevirileri ile SEO özetleri başarıyla üretildi!',
  },
  apps: {
    title: 'Uygulama Entegrasyonları',
    newApp: 'Yeni Uygulama Ekle',
    appName: 'Uygulama Adı',
    apiKey: 'API Anahtarı',
  },
  templates: {
    title: 'Şablon Yönetimi',
    newTemplate: 'Yeni Şablon Ekle',
    templateName: 'Şablon Adı',
  },
  broadcast: {
    broadcastTitle: 'Toplu E-Posta Duyurusu Oluştur',
    broadcastSubject: 'E-Posta Konusu',
    broadcastContent: 'Duyuru İçeriği (HTML desteklenir)',
    sendBroadcast: 'Duyuruyu Gönder',
    targetPreferences: 'Hedef Kitle Tercihleri',
    sendError: 'Bülten gönderilemedi.',
  },
  subscribers: {
    title: 'Bülten Aboneleri',
    email: 'E-Posta',
    subscribedAt: 'Abonelik Tarihi',
    export: 'Dışa Aktar (CSV)',
  },
  settings: {
    title: 'Sistem Ayarları',
    senderName: 'E-Posta Gönderici Adı',
    senderEmail: 'E-Posta Gönderici Adresi',
    pushNotifications: 'Web Push Bildirimleri',
    enablePush: 'Push Bildirimlerini Etkinleştir',
    testNotification: 'Test Bildirimi Gönder',
    pushDenied: 'Bildirim izni reddedildi.',
    pushUnsupported: 'Bu tarayıcı Web Push bildirimlerini desteklemiyor.',
  },
  validation: {
    required: 'Bu alan zorunludur',
    invalidEmail: 'Geçersiz e-posta adresi',
    minLength: 'En az {{min}} karakter girilmelidir',
  },
  a11y: {
    mainNav: 'Ana Gezinme Menüsü',
    userMenu: 'Kullanıcı Menüsü',
    searchModal: 'Arama Penceresi',
  },
};

const enDict: NamespaceTranslations = {
  common: {
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
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    refresh: 'Refresh',
    view: 'View',
    confirm: 'Confirm',
    welcome: 'Welcome {{name}}',
  },
  auth: {
    loginTitle: 'MSKLabs Control Panel',
    loginSub: 'Enter your credentials to login',
    email: 'Email Address',
    password: 'Password',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    loginError: 'Login failed. Please check your credentials.',
  },
  dashboard: {
    totalTickets: 'Total Tickets',
    pendingComments: 'Pending Comments',
    totalSubscribers: 'Total Subscribers',
    recentTickets: 'Recent Support Tickets',
    aiDraft: 'Gemini AI Draft Suggestion',
    quickStats: 'Quick Overview',
    channelsOverview: 'Channels Overview',
  },
  tickets: {
    ticketDetails: 'Ticket Details',
    ticketNo: 'Ticket ID',
    category: 'Category',
    userEmail: 'User Email',
    replyPlaceholder: 'Type your reply to the user...',
    sendReply: 'Send Reply',
    giveCoupon: 'Issue Coupon & Thank User',
    aiAnalysis: 'AI Analysis & Summary',
    count: 'Showing {{count}} tickets',
    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
    replyError: 'Failed to send reply.',
    statusError: 'Failed to update status.',
    loadError: 'Failed to load ticket details.',
  },
  comments: {
    postUrl: 'Post URL',
    author: 'Author / Name',
    commentContent: 'Comment Text',
    approveComment: 'Approve Comment',
    rejectComment: 'Mark Spam / Reject',
    pendingCount: '{{count}} comments pending approval',
    updateError: 'Failed to update comment status.',
  },
  channels: {
    title: 'Channel Management',
    addChannel: 'Add New Channel',
    channelName: 'Channel Name',
    slug: 'Slug',
    postCount: 'Post Count',
  },
  posts: {
    title: 'Content & Blog Management',
    newPost: 'Add New Post',
    postTitle: 'Post Title',
    status: 'Publish Status',
    published: 'Published',
    draft: 'Draft',
    revisions: 'Revision History',
    editor: 'Content Editor',
    preview: 'Preview',
    fillTrFirst: 'Please fill in Turkish title and content fields first!',
    aiSuccess: '✨ Successfully generated EN & AR translations with SEO summaries via Gemini AI!',
  },
  apps: {
    title: 'App Integrations',
    newApp: 'Add New App',
    appName: 'App Name',
    apiKey: 'API Key',
  },
  templates: {
    title: 'Template Management',
    newTemplate: 'Add New Template',
    templateName: 'Template Name',
  },
  broadcast: {
    broadcastTitle: 'Create Email Broadcast',
    broadcastSubject: 'Email Subject',
    broadcastContent: 'Broadcast Content (HTML supported)',
    sendBroadcast: 'Send Broadcast',
    targetPreferences: 'Audience Preferences',
    sendError: 'Failed to send broadcast.',
  },
  subscribers: {
    title: 'Newsletter Subscribers',
    email: 'Email',
    subscribedAt: 'Subscription Date',
    export: 'Export (CSV)',
  },
  settings: {
    title: 'System Settings',
    senderName: 'Sender Name',
    senderEmail: 'Sender Email Address',
    pushNotifications: 'Web Push Notifications',
    enablePush: 'Enable Push Notifications',
    testNotification: 'Send Test Notification',
    pushDenied: 'Notification permission denied.',
    pushUnsupported: 'This browser does not support Web Push notifications.',
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    minLength: 'Must be at least {{min}} characters',
  },
  a11y: {
    mainNav: 'Main Navigation Menu',
    userMenu: 'User Menu',
    searchModal: 'Search Modal',
  },
};

const arDict: NamespaceTranslations = {
  common: {
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
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    refresh: 'تحديث',
    view: 'عرض',
    confirm: 'تأكيد',
    welcome: 'مرحباً بك {{name}}',
  },
  auth: {
    loginTitle: 'لوحة إدارة MSKLabs',
    loginSub: 'أدخل بيانات الاعتماد لتسجيل الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    loggingIn: 'جاري تسجيل الدخول...',
    loginError: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
  },
  dashboard: {
    totalTickets: 'إجمالي التذاكر',
    pendingComments: 'تعليقات في الانتظار',
    totalSubscribers: 'إجمالي المشتركين',
    recentTickets: 'أحدث طلبات الدعم',
    aiDraft: 'مسودة الذكاء الاصطناعي Gemini',
    quickStats: 'نظرة سريعة',
    channelsOverview: 'نظرة عامة على القنوات',
  },
  tickets: {
    ticketDetails: 'تفاصيل التذكرة',
    ticketNo: 'رقم التذكرة',
    category: 'الفئة',
    userEmail: 'بريد المستخدم',
    replyPlaceholder: 'اكتب ردك للمستخدم هنا...',
    sendReply: 'إرسال الرد',
    giveCoupon: 'إصدار كوبون هدية وشكر',
    aiAnalysis: 'تحليل وتلخيص AI',
    count: 'عرض {{count}} تذاكر',
    pending: 'قيد الانتظار',
    inProgress: 'قيد المعالجة',
    resolved: 'تم التحلل',
    rejected: 'مرفوض',
    replyError: 'فشل إرسال الرد.',
    statusError: 'فشل تحديث الحالة.',
    loadError: 'فشل تحميل تفاصيل التذكرة.',
  },
  comments: {
    postUrl: 'رابط المقال',
    author: 'الكاتب / الاسم',
    commentContent: 'محتوى التعليق',
    approveComment: 'الموافقة على التعليق',
    rejectComment: 'رفض / مزعج (Spam)',
    pendingCount: 'هناك {{count}} تعليق في انتظار الموافقة',
    updateError: 'فشل تحديث حالة التعليق.',
  },
  channels: {
    title: 'إدارة القنوات',
    addChannel: 'إضافة قناة جديدة',
    channelName: 'اسم القناة',
    slug: 'Slug',
    postCount: 'عدد المقالات',
  },
  posts: {
    title: 'إدارة المحتوى والمدونة',
    newPost: 'إضافة مقال جديد',
    postTitle: 'عنوان المقال',
    status: 'حالة النشر',
    published: 'منشور',
    draft: 'مسودة',
    revisions: 'سجل التعديلات',
    editor: 'محرر المحتوى',
    preview: 'معاينة',
    fillTrFirst: 'يرجى ملء حقول العنوان والمحتوى باللغة التركية أولاً!',
    aiSuccess: '✨ تم إنشاء الترجمات باللغة الإنجليزية والعربية مع ملخصات SEO بنجاح عبر Gemini AI!',
  },
  apps: {
    title: 'تكامل التطبيقات',
    newApp: 'إضافة تطبيق جديد',
    appName: 'اسم التطبيق',
    apiKey: 'مفتاح API',
  },
  templates: {
    title: 'إدارة القوالب',
    newTemplate: 'إضافة قالب جديد',
    templateName: 'اسم القالب',
  },
  broadcast: {
    broadcastTitle: 'إنشاء نشرة بريدية جماعية',
    broadcastSubject: 'عنوان الرسالة',
    broadcastContent: 'محتوى النشرة (يدعم HTML)',
    sendBroadcast: 'إرسال النشرة',
    targetPreferences: 'تفضيلات الجمهور المستهدف',
    sendError: 'فشل إرسال النشرة.',
  },
  subscribers: {
    title: 'المشتركون في النشرة',
    email: 'البريد الإلكتروني',
    subscribedAt: 'تاريخ الاشتراك',
    export: 'تصدير (CSV)',
  },
  settings: {
    title: 'إعدادات النظام',
    senderName: 'اسم المرسل',
    senderEmail: 'عنوان بريد المرسل',
    pushNotifications: 'إشعارات الويب (Push)',
    enablePush: 'تفعيل إشعارات الويب',
    testNotification: 'إرسال إشعار تجريبي',
    pushDenied: 'تم رفض إذن الإشعارات.',
    pushUnsupported: 'هذا المتصفح لا يدعم إشعارات الويب.',
  },
  validation: {
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'عنوان بريد إلكتروني غير صاليح',
    minLength: 'يجب أن يتكون من {{min}} أحرف على الأقل',
  },
  a11y: {
    mainNav: 'قائمة التنقل الرئيسية',
    userMenu: 'قائمة المستخدم',
    searchModal: 'نافذة البحث',
  },
};

function createMergedDictionary(dict: NamespaceTranslations) {
  return {
    ...dict,
    dashboard: dict.common.dashboard,
    tickets: dict.common.tickets,
    comments: dict.common.comments,
    broadcasts: dict.common.broadcasts,
    subscribers: dict.common.subscribers,
    settings: dict.common.settings,
    logout: dict.common.logout,
    search: dict.common.search,
    filter: dict.common.filter,
    all: dict.common.all,
    save: dict.common.save,
    close: dict.common.close,
    cancel: dict.common.cancel,
    submit: dict.common.submit,
    copy: dict.common.copy,
    copied: dict.common.copied,
    status: dict.common.status,
    actions: dict.common.actions,
    loading: dict.common.loading,
    success: dict.common.success,
    error: dict.common.error,
    pending: dict.tickets.pending,
    inProgress: dict.tickets.inProgress,
    resolved: dict.tickets.resolved,
    rejected: dict.tickets.rejected,
    approved: 'Onaylandı',
    totalTickets: dict.dashboard.totalTickets,
    pendingComments: dict.dashboard.pendingComments,
    totalSubscribers: dict.dashboard.totalSubscribers,
    recentTickets: dict.dashboard.recentTickets,
    aiDraft: dict.dashboard.aiDraft,
    quickStats: dict.dashboard.quickStats,
    ticketDetails: dict.tickets.ticketDetails,
    ticketNo: dict.tickets.ticketNo,
    category: dict.tickets.category,
    userEmail: dict.tickets.userEmail,
    replyPlaceholder: dict.tickets.replyPlaceholder,
    sendReply: dict.tickets.sendReply,
    giveCoupon: dict.tickets.giveCoupon,
    aiAnalysis: dict.tickets.aiAnalysis,
    postUrl: dict.comments.postUrl,
    author: dict.comments.author,
    commentContent: dict.comments.commentContent,
    approveComment: dict.comments.approveComment,
    rejectComment: dict.comments.rejectComment,
    broadcastTitle: dict.broadcast.broadcastTitle,
    broadcastSubject: dict.broadcast.broadcastSubject,
    broadcastContent: dict.broadcast.broadcastContent,
    sendBroadcast: dict.broadcast.sendBroadcast,
    targetPreferences: dict.broadcast.targetPreferences,
    couponModalTitle: 'Hediye / Teşekkür Kuponu Tanımla',
    couponCode: 'Kupon Kodu',
    couponDiscount: 'İndirim / Hediye Oranı',
    generateCoupon: 'Kupon Oluştur & Gönder',
    senderName: dict.settings.senderName,
    senderEmail: dict.settings.senderEmail,
    pushNotifications: dict.settings.pushNotifications,
    enablePush: dict.settings.enablePush,
    testNotification: dict.settings.testNotification,
  };
}

export const translations: Record<Language, any> = {
  tr: createMergedDictionary(trDict),
  en: createMergedDictionary(enDict),
  ar: createMergedDictionary(arDict),
};
