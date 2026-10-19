export type TicketStatus = 'new' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  email_status?: 'valid' | 'invalid' | 'bounced';
  message_content?: string;
  content?: string;
  ai_summary?: string;
  ai_draft?: string;
  ai_suggested_reply?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketEvent {
  id: number;
  message_id: string;
  actor: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface TicketReply {
  id: string;
  message_id: string;
  admin_name: string;
  reply_content: string;
  sent_at: string;
}

export interface TicketDetailResponse {
  success: boolean;
  ticket: Ticket;
  events: TicketEvent[];
  replies: TicketReply[];
}

export interface CommentItem {
  id: string;
  post_id: string;
  post_type?: 'bizce' | 'aniltilar' | 'guncel' | string;
  post_slug?: string;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'unverified';
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  is_verified: boolean;
  kvkk_consent?: boolean;
  unsubscribed_at?: string;
  preferences?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'moderator' | 'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'SUPPORT_AGENT';
}

export interface BlogChannel {
  id: string;
  slug: string;
  name_tr: string;
  name_en?: string;
  name_ar?: string;
  description_tr?: string;
  description_en?: string;
  description_ar?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean | number;
}

export interface BlogPost {
  id: string;
  channel_id: string;
  channel_name?: string;
  channel_slug?: string;
  slug: string;
  title_tr: string;
  title_en?: string;
  title_ar?: string;
  content_tr: string;
  content_en?: string;
  content_ar?: string;
  summary_tr?: string;
  summary_en?: string;
  summary_ar?: string;
  cover_image?: string;
  video_url?: string;
  meta_keywords?: string;
  author_name?: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived' | 'unpublished' | 'trash';
  views_count?: number;
  published_at?: string;
  created_at?: string;
}

export interface AppVersion {
  id: string;
  app_id: string;
  version_name: string;
  version_code?: number;
  changelog_tr?: string;
  changelog_en?: string;
  changelog_ar?: string;
  download_url: string;
  platform?: string;
  file_size_mb?: number;
  is_mandatory?: boolean;
  released_at?: string;
}

export interface AppStoreLinks {
  google_play?: string;
  app_store?: string;
  github?: string;
  web_url?: string;
  direct_apk?: string;
}

export interface AppFeatureCard {
  id?: string;
  icon: string;
  title_tr: string;
  title_en?: string;
  title_ar?: string;
  description_tr: string;
  description_en?: string;
  description_ar?: string;
}

export interface AppItem {
  id: string;
  app_id: string;
  name_tr: string;
  name_en?: string;
  name_ar?: string;
  description_tr: string;
  description_en?: string;
  description_ar?: string;
  features_tr?: string;
  features_en?: string;
  features_ar?: string;
  icon_url?: string;
  cover_url?: string;
  category?: string;
  platform?: string;
  display_order?: number;
  is_active?: boolean;
  store_links?: AppStoreLinks;
  store_links_json?: string;
  feature_cards?: AppFeatureCard[];
  feature_cards_json?: string;
  screenshots_json?: string;
  downloads_count?: number;
  latest_version?: string;
  latest_download_url?: string;
  versions?: AppVersion[];
}

export interface SiteTemplate {
  id: string;
  key_name: string;
  content_tr?: string;
  content_en?: string;
  content_ar?: string;
  meta_json?: string;
  is_active?: boolean;
}

