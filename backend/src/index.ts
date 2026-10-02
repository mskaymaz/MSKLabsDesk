/**
 * MSKLabsDesk Backend Entry Point
 * Cloudflare Workers + TypeScript API Service
 */

import { handleSupportSubmission } from './routes/support';
import { handleCommentSubmission, handleGetApprovedComments } from './routes/comments';
import { handleSubscribe, handleUnsubscribe } from './routes/subscribe';
import { handleAdminLogin } from './routes/adminAuth';
import { handleAdminGetTickets, handleAdminGetTicketDetail, handleAdminReplyTicket, handleAdminUpdateTicketStatus } from './routes/adminTickets';
import { handleAdminGetComments, handleAdminModerateComment } from './routes/adminComments';
import { handleAdminGetSubscribers, handleAdminBroadcastNewsletter } from './routes/adminBroadcast';
import { handleCmsChannels } from './routes/cmsChannels';
import { handleCmsPosts } from './routes/cmsPosts';
import { handleCmsApps } from './routes/cmsApps';
import { handleCmsTemplates } from './routes/cmsTemplates';
import { handleCmsPublic } from './routes/cmsPublic';
import { EmailEnv } from './utils/email';
import { AIEnv } from './utils/ai';
import { AuthEnv } from './utils/auth';

export interface Env extends EmailEnv, AIEnv, AuthEnv {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    let response: Response;

    // 1. Kamusal & Headless CMS Public API V1 Endpoint'leri
    if (path.startsWith('/api/v1/')) {
      response = await handleCmsPublic(request, env);
    } else if (path === '/api/health') {
      response = new Response(JSON.stringify({ status: 'ok', service: 'MSKLabsDesk API Engine', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    } else if (path === '/api/support' && request.method === 'POST') {
      response = await handleSupportSubmission(request, env);
    } else if (path === '/api/comments' && request.method === 'POST') {
      response = await handleCommentSubmission(request, env);
    } else if (path === '/api/comments' && request.method === 'GET') {
      response = await handleGetApprovedComments(request, env);
    } else if (path === '/api/subscribe' && request.method === 'POST') {
      response = await handleSubscribe(request, env);
    } else if (path === '/api/unsubscribe' && request.method === 'POST') {
      response = await handleUnsubscribe(request, env);
    } 
    // 2. Headless CMS Admin API Endpoint'leri
    else if (path.startsWith('/api/admin/channels')) {
      response = await handleCmsChannels(request, env);
    } else if (path.startsWith('/api/admin/posts') || path === '/api/admin/translate') {
      response = await handleCmsPosts(request, env);
    } else if (path.startsWith('/api/admin/apps')) {
      response = await handleCmsApps(request, env);
    } else if (path.startsWith('/api/admin/templates')) {
      response = await handleCmsTemplates(request, env);
    }
    // 3. Destek & Bülten Admin API Endpoint'leri
    else if (path === '/api/admin/login' && request.method === 'POST') {
      response = await handleAdminLogin(request, env);
    } else if (path === '/api/admin/tickets' && request.method === 'GET') {
      response = await handleAdminGetTickets(request, env);
    } else if (path.startsWith('/api/admin/tickets/') && path.endsWith('/reply') && request.method === 'POST') {
      const ticketId = path.split('/')[4];
      response = await handleAdminReplyTicket(ticketId, request, env);
    } else if (path.startsWith('/api/admin/tickets/') && path.endsWith('/status') && request.method === 'POST') {
      const ticketId = path.split('/')[4];
      response = await handleAdminUpdateTicketStatus(ticketId, request, env);
    } else if (path.startsWith('/api/admin/tickets/') && request.method === 'GET') {
      const ticketId = path.split('/')[4];
      response = await handleAdminGetTicketDetail(ticketId, request, env);
    } else if (path === '/api/admin/comments' && request.method === 'GET') {
      response = await handleAdminGetComments(request, env);
    } else if (path.startsWith('/api/admin/comments/') && path.endsWith('/moderate') && request.method === 'POST') {
      const commentId = path.split('/')[4];
      response = await handleAdminModerateComment(commentId, request, env);
    } else if (path === '/api/admin/subscribers' && request.method === 'GET') {
      response = await handleAdminGetSubscribers(request, env);
    } else if (path === '/api/admin/broadcast' && request.method === 'POST') {
      response = await handleAdminBroadcastNewsletter(request, env);
    } else {
      response = new Response(JSON.stringify({ error: 'Endpoint bulunamadı.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  },
};

