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
