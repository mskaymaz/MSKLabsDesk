export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  message_content: string;
  ai_summary?: string;
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
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  is_verified: boolean;
  preferences?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'moderator';
}
