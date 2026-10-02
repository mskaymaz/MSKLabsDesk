/**
 * MSKLabsDesk Backend Entry Point
 * Cloudflare Workers + TypeScript API Service
 */

import { handleSupportSubmission } from './routes/support';
import { EmailEnv } from './utils/email';

export interface Env extends EmailEnv {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health Check Endpoint
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'MSKLabsDesk API Engine',
          timestamp: new Date().toISOString(),
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=utf-8',
          },
        }
      );
    }

    // POST /api/support — Destek Formu Kaydı
    if (url.pathname === '/api/support' && request.method === 'POST') {
      const res = await handleSupportSubmission(request, env);
      Object.entries(corsHeaders).forEach(([key, val]) => res.headers.set(key, val));
      return res;
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
        },
      }
    );
  },
};
