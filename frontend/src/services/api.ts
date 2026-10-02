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
  }
};
