/**
 * MSKLabsDesk Backend Entry Point
 * Cloudflare Workers + TypeScript API Service
 */

import { handleSupportSubmission } from './routes/support';
import { handleCommentSubmission, handleGetApprovedComments, handleVerifyComment } from './routes/comments';
import { handleSubscribe, handleUnsubscribe } from './routes/subscribe';
import { handleAdminLogin } from './routes/adminAuth';
import { handleAdminGetTickets, handleAdminGetTicketDetail, handleAdminReplyTicket, handleAdminUpdateTicketStatus, handleAdminAnalyzeTicket, handleAdminAnalyzeAllTickets, handleAdminTranslateTicket } from './routes/adminTickets';
import { handleAdminGetComments, handleAdminModerateComment } from './routes/adminComments';
import { handleAdminGetSubscribers, handleAdminBroadcastNewsletter } from './routes/adminBroadcast';
import { handleAdminMediaUpload, handleAdminMediaDelete } from './routes/adminMedia';
import { handleAdminTTSGenerate, handleAdminTTSStatus, handleAdminTTSApprove, handleAdminTTSUnpublish, handleAdminTTSRegenerate, handlePublicAudioDelivery } from './routes/adminTts';
import { handleCmsChannels } from './routes/cmsChannels';
import { handleCmsPosts } from './routes/cmsPosts';
import { handleCmsApps } from './routes/cmsApps';
import { handleCmsTemplates } from './routes/cmsTemplates';
import { handleCmsPublic } from './routes/cmsPublic';
import { EmailEnv } from './utils/email';
import { AIEnv } from './utils/ai';
import { AuthEnv } from './utils/auth';
import { handleInboundEmail } from './services/emailInbound';

export interface Env extends EmailEnv, AIEnv, AuthEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
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

    // 1. Kamusal & Destek API Base Endpoint'leri
    if ((path === '/api/comments' || path === '/api/v1/comments') && request.method === 'POST') {
      response = await handleCommentSubmission(request, env);
    } else if ((path === '/api/comments/verify' || path === '/api/v1/comments/verify') && request.method === 'GET') {
      response = await handleVerifyComment(request, env);
    } else if ((path === '/api/comments' || path === '/api/v1/comments') && request.method === 'GET') {
      response = await handleGetApprovedComments(request, env);
    } else if (path === '/api/health') {
      response = new Response(JSON.stringify({ status: 'ok', service: 'MSKLabsDesk API Engine', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    } else if (path === '/api/support' && request.method === 'POST') {
      response = await handleSupportSubmission(request, env);
    } else if (path === '/api/subscribe' && request.method === 'POST') {
      response = await handleSubscribe(request, env);
    } else if (path === '/api/unsubscribe' && request.method === 'POST') {
      response = await handleUnsubscribe(request, env);
    } 
    // 2. Headless CMS Admin API Endpoint'leri
    else if (path.startsWith('/api/admin/channels') || path.startsWith('/api/v1/admin/channels')) {
      response = await handleCmsChannels(request, env);
    } else if (path.startsWith('/api/admin/posts') || path.startsWith('/api/v1/admin/posts') || path === '/api/admin/translate' || path === '/api/v1/admin/translate') {
      response = await handleCmsPosts(request, env);
    } else if (path.startsWith('/api/admin/apps') || path.startsWith('/api/v1/admin/apps')) {
      response = await handleCmsApps(request, env);
    } else if (path.startsWith('/api/admin/templates') || path.startsWith('/api/v1/admin/templates')) {
      response = await handleCmsTemplates(request, env);
    }
    // 3. Destek & Bülten Admin API Endpoint'leri
    else if (path === '/api/admin/login' && request.method === 'POST') {
      response = await handleAdminLogin(request, env);
    } else if ((path === '/api/admin/tickets' || path === '/api/v1/admin/tickets') && request.method === 'GET') {
      response = await handleAdminGetTickets(request, env);
    } else if ((path === '/api/admin/tickets/analyze-all' || path === '/api/v1/admin/tickets/analyze-all') && request.method === 'POST') {
      response = await handleAdminAnalyzeAllTickets(request, env);
    } else if ((path.startsWith('/api/admin/tickets/') || path.startsWith('/api/v1/admin/tickets/')) && path.endsWith('/analyze') && request.method === 'POST') {
      const ticketId = path.split('/')[4];
      response = await handleAdminAnalyzeTicket(ticketId, request, env);
    } else if ((path.startsWith('/api/admin/tickets/') || path.startsWith('/api/v1/admin/tickets/')) && path.endsWith('/reply') && request.method === 'POST') {
      const ticketId = path.split('/')[4];
      response = await handleAdminReplyTicket(ticketId, request, env);
    } else if ((path.startsWith('/api/admin/tickets/') || path.startsWith('/api/v1/admin/tickets/')) && path.endsWith('/translate') && request.method === 'POST') {
      const ticketId = path.split('/')[4];
      response = await handleAdminTranslateTicket(ticketId, request, env);
    } else if ((path.startsWith('/api/admin/tickets/') || path.startsWith('/api/v1/admin/tickets/')) && path.endsWith('/status') && request.method === 'POST') {
      const ticketId = path.split('/')[4];
      response = await handleAdminUpdateTicketStatus(ticketId, request, env);
    } else if ((path.startsWith('/api/admin/tickets/') || path.startsWith('/api/v1/admin/tickets/')) && request.method === 'GET') {
      const ticketId = path.split('/')[4];
      response = await handleAdminGetTicketDetail(ticketId, request, env);
    } else if ((path === '/api/admin/comments' || path === '/api/v1/admin/comments') && request.method === 'GET') {
      response = await handleAdminGetComments(request, env);
    } else if ((path.startsWith('/api/admin/comments/') || path.startsWith('/api/v1/admin/comments/')) && path.endsWith('/moderate') && request.method === 'POST') {
      const commentId = path.split('/')[4];
      response = await handleAdminModerateComment(commentId, request, env);
    } else if ((path === '/api/admin/subscribers' || path === '/api/v1/admin/subscribers') && request.method === 'GET') {
      response = await handleAdminGetSubscribers(request, env);
    } else if ((path === '/api/admin/broadcast' || path === '/api/v1/admin/broadcast') && request.method === 'POST') {
      response = await handleAdminBroadcastNewsletter(request, env);
    } else if ((path === '/api/v1/admin/media/upload' || path === '/api/admin/media/upload') && request.method === 'POST') {
      response = await handleAdminMediaUpload(request, env);
    } else if ((path.startsWith('/api/v1/admin/media/') || path.startsWith('/api/admin/media/')) && request.method === 'DELETE') {
      const keyParam = path.startsWith('/api/v1/admin/media/') ? path.substring('/api/v1/admin/media/'.length) : path.substring('/api/admin/media/'.length);
      response = await handleAdminMediaDelete(keyParam, request, env);
    } else if ((path === '/api/v1/admin/tts/generate' || path === '/api/admin/tts/generate') && request.method === 'POST') {
      response = await handleAdminTTSGenerate(request, env);
    } else if ((path === '/api/v1/admin/tts/regenerate' || path === '/api/admin/tts/regenerate') && request.method === 'POST') {
      response = await handleAdminTTSRegenerate(request, env);
    } else if ((path.startsWith('/api/v1/admin/tts/status/') || path.startsWith('/api/admin/tts/status/')) && request.method === 'GET') {
      const postIdParam = path.startsWith('/api/v1/admin/tts/status/') ? path.substring('/api/v1/admin/tts/status/'.length) : path.substring('/api/admin/tts/status/'.length);
      response = await handleAdminTTSStatus(postIdParam, request, env);
    } else if ((path === '/api/v1/admin/tts/approve' || path === '/api/admin/tts/approve') && request.method === 'POST') {
      response = await handleAdminTTSApprove(request, env);
    } else if ((path === '/api/v1/admin/tts/unpublish' || path === '/api/admin/tts/unpublish') && request.method === 'POST') {
      response = await handleAdminTTSUnpublish(request, env);
    } else if ((path.startsWith('/api/v1/public/audio/') || path.startsWith('/api/public/audio/')) && request.method === 'GET') {
      const parts = path.split('/').filter(Boolean);
      const audioIdx = parts.indexOf('audio');
      const param1 = parts[audioIdx + 1];
      const param2 = parts[audioIdx + 2];

      if (param2) {
        const postId = parseInt(param1, 10);
        response = await handlePublicAudioDelivery(request, env, { postId, language: param2 });
      } else if (param1) {
        const audioId = parseInt(param1, 10);
        response = await handlePublicAudioDelivery(request, env, { audioId });
      } else {
        response = new Response(JSON.stringify({ error: 'Geçersiz audio parametreleri.' }), { status: 400 });
      }
    } 
    // 4. Kamusal Headless CMS Public API V1 Fallback
    else if (path.startsWith('/api/v1/')) {
      response = await handleCmsPublic(request, env);
    } else {
      response = new Response(JSON.stringify({ error: 'Endpoint bulunamadı.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    try {
      Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    } catch {
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
  },

  async email(message: any, env: Env, ctx: ExecutionContext): Promise<void> {
    await handleInboundEmail(message, env, ctx);
  },
};
