import type { Ticket, TicketDetailResponse, CommentItem, Subscriber, StudioBlock, UnifiedInboxResponse, InboxSummaryResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://msklabsdesk-backend.msklabs-org.workers.dev/api' : 'http://localhost:8787/api');

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('msk_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface BroadcastCampaign {
  id: string;
  subject: string;
  target_category: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  delivery_rate: number;
  status: 'pending' | 'sending' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'GiriÅŸ baÅŸarÄ±sÄ±z.' }));
      throw new Error(err.error || 'GiriÅŸ yapÄ±lamadÄ±.');
    }
    return res.json();
  },

  // Tickets
  async getTickets(status?: string): Promise<{ tickets: Ticket[] }> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/admin/tickets${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Biletler yÃ¼klenemedi.');
    return res.json();
  },

  async getTicketDetail(id: string): Promise<TicketDetailResponse> {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Bilet detayÄ± yÃ¼klenemedi.');
    return res.json();
  },

  async replyTicket(id: string, reply_content: string) {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reply_content }),
    });
    if (!res.ok) throw new Error('Cevap gÃ¶nderilemedi.');
    return res.json();
  },

  async updateTicketStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Durum gÃ¼ncellenemedi.');
    return res.json();
  },

  async analyzeTicket(id: string) {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}/analyze`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Yapay zeka analizi Ã§alÄ±ÅŸtÄ±rÄ±lamadÄ±.');
    return res.json();
  },

  async analyzeAllTickets() {
    const res = await fetch(`${API_BASE}/admin/tickets/analyze-all`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Toplu analiz Ã§alÄ±ÅŸtÄ±rÄ±lamadÄ±.');
    return res.json();
  },

  async translateTicket(id: string) {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}/translate`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Ã‡eviri iÅŸlemi gerÃ§ekleÅŸtirilemedi.');
    return res.json() as Promise<{
      success: boolean;
      ticket_id: string;
      original_subject: string;
      original_content: string;
      detected_language: string;
      translated_subject: string;
      translated_content: string;
    }>;
  },

  // Comments
  async getComments(status?: string): Promise<{ comments: CommentItem[] }> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/admin/comments${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Yorumlar yÃ¼klenemedi.');
    return res.json();
  },

  async moderateComment(id: string, status: 'approved' | 'rejected') {
    const res = await fetch(`${API_BASE}/admin/comments/${id}/moderate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Yorum durumu gÃ¼ncellenemedi.');
    return res.json();
  },

  // Subscribers & Broadcast
  async getSubscribers(): Promise<{ subscribers: Subscriber[] }> {
    const res = await fetch(`${API_BASE}/admin/subscribers`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Aboneler yÃ¼klenemedi.');
    return res.json();
  },

  async broadcastNewsletter(data: {
    subject?: string;
    content_html?: string;
    category?: string;
    title?: string;
    content?: string;
    target_preference?: string;
  }) {
    const payload = {
      subject: data.subject || data.title,
      content_html: data.content_html || data.content,
      category: data.category || data.target_preference || 'all',
    };
    const res = await fetch(`${API_BASE}/admin/broadcast`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Duyuru gÃ¶nderilemedi.');
    }
    return res.json();
  },

  async getBroadcastHistory(): Promise<{ success: boolean; campaigns: BroadcastCampaign[] }> {
    const res = await fetch(`${API_BASE}/admin/broadcast/history`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Bülten geçmişi yüklenemedi.');
    return res.json();
  },

  async getUnifiedInbox(type?: string): Promise<UnifiedInboxResponse> {
    const url = type && type !== 'all' ? `${API_BASE}/admin/inbox/unified?type=${type}` : `${API_BASE}/admin/inbox/unified`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Bildirimler yüklenemedi.');
    return res.json();
  },

  async getInboxSummary(): Promise<InboxSummaryResponse> {
    const res = await fetch(`${API_BASE}/admin/inbox/summary`, { headers: getHeaders() });
    if (!res.ok) throw new Error('İletişim istasyonu özet verisi yüklenemedi.');
    return res.json();
  },

  // Headless CMS â€” Channels
  async getChannels() {
    const res = await fetch(`${API_BASE}/admin/channels`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Kanallar yÃ¼klenemedi.');
    return res.json();
  },

  async createChannel(data: any) {
    const res = await fetch(`${API_BASE}/admin/channels`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Kanal oluÅŸturulamadÄ±.');
    return res.json();
  },

  async updateChannel(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/channels/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Kanal gÃ¼ncellenemedi.');
    return res.json();
  },

  async deleteChannel(id: string) {
    const res = await fetch(`${API_BASE}/admin/channels/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Kanal silinemedi.');
    return res.json();
  },

  // Headless CMS â€” Posts & AI Translate
  async getPosts(channelId?: string) {
    const query = channelId ? `?channel_id=${channelId}` : '';
    const res = await fetch(`${API_BASE}/admin/posts${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('YazÄ±lar yÃ¼klenemedi.');
    return res.json();
  },

  async createPost(data: any) {
    const res = await fetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('YazÄ± eklenemedi.');
    return res.json();
  },

  async updatePost(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('YazÄ± gÃ¼ncellenemedi.');
    return res.json();
  },

  async updatePostStatus(id: string, status: 'published' | 'draft' | 'unpublished' | 'trash') {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Makale durumu gÃ¼ncellenemedi.');
    }
    return res.json();
  },

  async deletePost(id: string, permanent: boolean = false) {
    const query = permanent ? '?permanent=true' : '';
    const res = await fetch(`${API_BASE}/admin/posts/${id}${query}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'YazÄ± silinemedi.');
    }
    return res.json();
  },

  async translatePostAI(data: { title_tr: string; content_tr: string; summary_tr?: string }) {
    const res = await fetch(`${API_BASE}/admin/translate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('AI Ã§evirisi yapÄ±lamadÄ±.');
    return res.json();
  },

  // Headless CMS â€” Apps
  async getApps() {
    const res = await fetch(`${API_BASE}/admin/apps`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Uygulamalar yÃ¼klenemedi.');
    return res.json();
  },

  async createApp(data: any) {
    const res = await fetch(`${API_BASE}/admin/apps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Uygulama oluÅŸturulamadÄ±.');
    }
    return res.json();
  },

  async updateApp(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/apps/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Uygulama gÃ¼ncellenemedi.');
    }
    return res.json();
  },

  async deleteApp(id: string) {
    const res = await fetch(`${API_BASE}/admin/apps/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Uygulama silinemedi.');
    }
    return res.json();
  },

  async addAppVersion(appId: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/apps/${appId}/versions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'SÃ¼rÃ¼m eklenemedi.');
    }
    return res.json();
  },

  async deleteAppVersion(appId: string, versionId: string) {
    const res = await fetch(`${API_BASE}/admin/apps/${appId}/versions/${versionId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'SÃ¼rÃ¼m silinemedi.');
    }
    return res.json();
  },

  // Headless CMS â€” Templates & Ads
  async getTemplates() {
    const res = await fetch(`${API_BASE}/admin/templates`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Åablonlar yÃ¼klenemedi.');
    return res.json();
  },

  async updateTemplate(data: any) {
    const res = await fetch(`${API_BASE}/admin/templates`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Åablon gÃ¼ncellenemedi.');
    return res.json();
  },

  // Headless CMS â€” Ads Management (ADS-001 & ADS-002)
  async getAds() {
    const res = await fetch(`${API_BASE}/admin/ads`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Reklam ayarlarÄ± yÃ¼klenemedi.');
    return res.json();
  },

  async updateAd(slotKey: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/ads`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ ...data, slot_key: slotKey }),
    });
    if (!res.ok) throw new Error('Reklam ayarlarÄ± kaydedilemedi.');
    return res.json();
  },

  async createAd(data: any) {
    return this.updateAd(data.slot_key, data);
  },

  async updateAdMatrix(matrix: any) {
    const res = await fetch(`${API_BASE}/admin/ads`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ matrix }),
    });
    if (!res.ok) throw new Error('Sayfa reklam matrisi kaydedilemedi.');
    return res.json();
  },

  async deleteAd(slotKey: string) {
    const res = await fetch(`${API_BASE}/admin/ads?slot_key=${encodeURIComponent(slotKey)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Reklam alanÄ± silinemedi.');
    }
    return res.json();
  },

  // Media Management (API-010)
  async uploadMedia(file: File, altText?: string): Promise<{ success: boolean; data: { url: string; key: string } }> {
    const token = localStorage.getItem('msk_admin_token');
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('altText', altText);

    const res = await fetch(`${API_BASE}/v1/admin/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'GÃ¶rsel yÃ¼klenemedi.');
    }
    return res.json();
  },

  // Headless CMS â€” Corporate Pages (CMS-PAGES)
  async getPages() {
    const res = await fetch(`${API_BASE}/admin/pages`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Kurumsal sayfalar yÃ¼klenemedi.');
    return res.json();
  },

  async getPage(id: string) {
    const res = await fetch(`${API_BASE}/admin/pages/${encodeURIComponent(id)}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Sayfa detayÄ± yÃ¼klenemedi.');
    return res.json();
  },

  async createPage(data: any) {
    const res = await fetch(`${API_BASE}/admin/pages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Sayfa oluÅŸturulamadÄ±.');
    }
    return res.json();
  },

  async updatePage(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/pages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Sayfa gÃ¼ncellenemedi.');
    }
    return res.json();
  },

  async updatePageStatus(id: string, status: string) {
    return this.updatePage(id, { status });
  },

  async deletePage(id: string) {
    const res = await fetch(`${API_BASE}/admin/pages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Sayfa silinemedi.');
    }
    return res.json();
  },

  async translatePage(data: { title_tr?: string; content_tr?: string; summary_tr?: string; blocks?: StudioBlock[] }) {
    const res = await fetch(`${API_BASE}/admin/pages/translate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'AI Ã§eviri baÅŸarÄ±sÄ±z oldu.');
    }
    return res.json();
  },

  // TTS & Audio Management (CMS-TTS-002)
  async getTtsStatus(postId: number | string) {
    const res = await fetch(`${API_BASE}/admin/tts/status/${postId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'TTS durum bilgisi alınamadı.');
    }
    return res.json();
  },

  async generateTts(postId: number | string, language: string) {
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) || 1 : postId;
    const res = await fetch(`${API_BASE}/admin/tts/generate`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'X-Idempotency-Key': `tts_gen_${numericPostId}_${language}_${Date.now()}`,
      },
      body: JSON.stringify({ postId: numericPostId, language }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'TTS ses üretimi başlatılamadı.');
    }
    return res.json();
  },

  async regenerateTts(postId: number | string, language: string) {
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) || 1 : postId;
    const res = await fetch(`${API_BASE}/admin/tts/regenerate`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'X-Idempotency-Key': `tts_regen_${numericPostId}_${language}_${Date.now()}`,
      },
      body: JSON.stringify({ postId: numericPostId, language }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'TTS ses yeniden üretimi başlatılamadı.');
    }
    return res.json();
  },

  async approveTts(audioId: number, postId: number | string, language: string) {
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) || 1 : postId;
    const res = await fetch(`${API_BASE}/admin/tts/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ audioId, postId: numericPostId, language }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ses onaylanamadı.');
    }
    return res.json();
  },

  async unpublishTts(audioId: number, postId: number | string, language: string) {
    const numericPostId = typeof postId === 'string' ? parseInt(postId, 10) || 1 : postId;
    const res = await fetch(`${API_BASE}/admin/tts/unpublish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ audioId, postId: numericPostId, language }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Ses yayından kaldırılamadı.');
    }
    return res.json();
  },
};


