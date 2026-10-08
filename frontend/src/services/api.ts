import type { Ticket, TicketDetailResponse, CommentItem, Subscriber } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('msk_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(username: string, password_hash: string) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password_hash }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Giriş başarısız.' }));
      throw new Error(err.error || 'Giriş yapılamadı.');
    }
    return res.json();
  },

  // Tickets
  async getTickets(status?: string): Promise<{ tickets: Ticket[] }> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/admin/tickets${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Biletler yüklenemedi.');
    return res.json();
  },

  async getTicketDetail(id: string): Promise<TicketDetailResponse> {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Bilet detayı yüklenemedi.');
    return res.json();
  },

  async replyTicket(id: string, reply_content: string) {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reply_content }),
    });
    if (!res.ok) throw new Error('Cevap gönderilemedi.');
    return res.json();
  },

  async updateTicketStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/tickets/${id}/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Durum güncellenemedi.');
    return res.json();
  },

  // Comments
  async getComments(status?: string): Promise<{ comments: CommentItem[] }> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`${API_BASE}/admin/comments${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Yorumlar yüklenemedi.');
    return res.json();
  },

  async moderateComment(id: string, status: 'approved' | 'rejected') {
    const res = await fetch(`${API_BASE}/admin/comments/${id}/moderate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Yorum durumu güncellenemedi.');
    return res.json();
  },

  // Subscribers & Broadcast
  async getSubscribers(): Promise<{ subscribers: Subscriber[] }> {
    const res = await fetch(`${API_BASE}/admin/subscribers`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Aboneler yüklenemedi.');
    return res.json();
  },

  async broadcastNewsletter(data: { title: string; content: string; target_preference?: string }) {
    const res = await fetch(`${API_BASE}/admin/broadcast`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Duyuru gönderilemedi.');
    return res.json();
  },

  // Headless CMS — Channels
  async getChannels() {
    const res = await fetch(`${API_BASE}/admin/channels`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Kanallar yüklenemedi.');
    return res.json();
  },

  async createChannel(data: any) {
    const res = await fetch(`${API_BASE}/admin/channels`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Kanal oluşturulamadı.');
    return res.json();
  },

  async updateChannel(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/channels/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Kanal güncellenemedi.');
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

  // Headless CMS — Posts & AI Translate
  async getPosts(channelId?: string) {
    const query = channelId ? `?channel_id=${channelId}` : '';
    const res = await fetch(`${API_BASE}/admin/posts${query}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Yazılar yüklenemedi.');
    return res.json();
  },

  async createPost(data: any) {
    const res = await fetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Yazı eklenemedi.');
    return res.json();
  },

  async updatePost(id: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Yazı güncellenemedi.');
    return res.json();
  },

  async deletePost(id: string) {
    const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Yazı silinemedi.');
    return res.json();
  },

  async translatePostAI(data: { title_tr: string; content_tr: string; summary_tr?: string }) {
    const res = await fetch(`${API_BASE}/admin/translate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('AI çevirisi yapılamadı.');
    return res.json();
  },

  // Headless CMS — Apps
  async getApps() {
    const res = await fetch(`${API_BASE}/admin/apps`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Uygulamalar yüklenemedi.');
    return res.json();
  },

  async createApp(data: any) {
    const res = await fetch(`${API_BASE}/admin/apps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Uygulama oluşturulamadı.');
    return res.json();
  },

  async addAppVersion(appId: string, data: any) {
    const res = await fetch(`${API_BASE}/admin/apps/${appId}/versions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Sürüm eklenemedi.');
    return res.json();
  },

  // Headless CMS — Templates & Ads
  async getTemplates() {
    const res = await fetch(`${API_BASE}/admin/templates`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Şablonlar yüklenemedi.');
    return res.json();
  },

  async updateTemplate(data: any) {
    const res = await fetch(`${API_BASE}/admin/templates`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Şablon güncellenemedi.');
    return res.json();
  },

  // Headless CMS — Ads Management (ADS-001 & ADS-002)
  async getAds() {
    const res = await fetch(`${API_BASE}/v1/admin/ads`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Reklam ayarları yüklenemedi.');
    return res.json();
  },

  async updateAd(id: number | string, data: any) {
    const res = await fetch(`${API_BASE}/v1/admin/ads/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || 'Reklam ayarları güncellenemedi.');
    }
    return res.json();
  },

  async createAd(data: any) {
    const res = await fetch(`${API_BASE}/v1/admin/ads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || 'Reklam alanı oluşturulamadı.');
    }
    return res.json();
  },
};

