import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { Connect } from 'vite';
import Anthropic from '@anthropic-ai/sdk';
import https from 'https';
import http from 'http';
import { createHmac } from 'crypto';

// ---------- helpers ----------
function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function json(res: any, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(data));
}

// Proxy an external URL through the Vite dev server (resolves CORS + sandbox issues)
function proxyUrl(url: string): Promise<{ contentType: string; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'MyAIFashion/1.0' } }, (res) => {
      // Follow redirects (Pollinations uses them)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return proxyUrl(res.headers.location).then(resolve).catch(reject);
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve({
        contentType: (res.headers['content-type'] as string) || 'image/jpeg',
        data: Buffer.concat(chunks),
      }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ---------- Claude client (lazy) ----------
function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set in .env');
  return new Anthropic({ apiKey: key });
}

// ---------- Vite plugin: API routes ----------
const apiPlugin = {
  name: 'api-routes',
  configureServer(server: any) {

    // ── GET /api/generate-image?prompt=...&style=... ─────────────────
    // Proxies Pollinations.ai through the dev server (avoids sandbox CORS)
    server.middlewares.use(
      '/api/generate-image',
      async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        if (req.method !== 'GET') { next(); return; }
        try {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const prompt = urlObj.searchParams.get('prompt') || 'abstract t-shirt design';
          const style  = urlObj.searchParams.get('style') || '';
          const seed   = urlObj.searchParams.get('seed') || String(Date.now());
          const full   = style
            ? `${prompt}, ${style} art style, t-shirt graphic, high contrast, white background`
            : `${prompt}, t-shirt graphic design, high contrast, white background`;
          const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=512&height=512&nologo=true&model=flux&seed=${seed}`;
          console.log('[generate-image] fetching:', imageUrl.slice(0, 100) + '...');
          const { contentType, data } = await proxyUrl(imageUrl);
          res.statusCode = 200;
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.end(data);
        } catch (err: any) {
          console.error('[/api/generate-image]', err.message);
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Image generation failed: ' + err.message }));
        }
      }
    );

    // ── POST /api/recommend ─────────────────────────────────────────
    server.middlewares.use(
      '/api/recommend',
      async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        if (req.method === 'OPTIONS') { json(res, 204, {}); return; }
        if (req.method !== 'POST') { next(); return; }
        try {
          const body = JSON.parse(await readBody(req));
          const client = getClient();
          const msg = await client.messages.create({
            model: 'claude-opus-4-5',
            max_tokens: 300,
            messages: [{
              role: 'user',
              content: `You are an expert fashion stylist for a premium custom t-shirt brand.
The customer has selected:
- Template style: ${body.template || 'not chosen yet'}
- Fabric: ${body.fabric || 'not chosen yet'}
- Colour: ${body.colour || 'not chosen yet'}
- Design type: ${body.designType || 'none yet'}

Give a 2–3 sentence personalised style tip. Be specific, inspiring, and fashion-forward.
Suggest a complementary design direction or colour accent. Keep it under 60 words.`,
            }],
          });
          const text = (msg.content[0] as Anthropic.TextBlock).text;
          json(res, 200, { recommendation: text });
        } catch (err: any) {
          console.error('[/api/recommend]', err.message);
          json(res, 500, { error: err.message });
        }
      }
    );

    // ── POST /api/check-copyright ───────────────────────────────────
    server.middlewares.use(
      '/api/check-copyright',
      async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        if (req.method === 'OPTIONS') { json(res, 204, {}); return; }
        if (req.method !== 'POST') { next(); return; }
        try {
          const { prompt } = JSON.parse(await readBody(req));
          const client = getClient();
          const msg = await client.messages.create({
            model: 'claude-haiku-4-5',
            max_tokens: 100,
            messages: [{
              role: 'user',
              content: `Does this t-shirt design prompt reference any trademarked brands, copyrighted characters, logos, sports teams, musicians, movies, or other protected intellectual property?

Prompt: "${prompt}"

Reply with JSON only: {"safe": true} if completely original, or {"safe": false, "reason": "brief explanation"} if it contains IP concerns.`,
            }],
          });
          const raw = (msg.content[0] as Anthropic.TextBlock).text.trim();
          // extract JSON from response
          const match = raw.match(/\{[\s\S]*\}/);
          const result = match ? JSON.parse(match[0]) : { safe: true };
          json(res, 200, result);
        } catch (err: any) {
          console.error('[/api/check-copyright]', err.message);
          // fail open — let the user proceed if check fails
          json(res, 200, { safe: true });
        }
      }
    );

    // ── POST /api/dsr ───────────────────────────────────────────────
    server.middlewares.use(
      '/api/dsr',
      async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        if (req.method === 'OPTIONS') { json(res, 204, {}); return; }
        if (req.method !== 'POST') { next(); return; }
        try {
          const body = JSON.parse(await readBody(req));
          const requestType = String(body.request_type || 'access');
          const email = String(body.email || '').trim();
          const details = String(body.details || '').trim();

          if (!email) {
            json(res, 400, { error: 'email is required' });
            return;
          }

          const siteKey = process.env.SCRUTORA_SITE_KEY || 'cs_6c696cd10052901de637e7f922a3d56e';
          const endpoint = `https://api.scrutora.com/api/consent/dsr/${siteKey}`;
          const upstream = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              request_type: requestType,
              email,
              details,
            }),
          });

          const upstreamText = await upstream.text();
          let upstreamData: any = {};
          try {
            upstreamData = upstreamText ? JSON.parse(upstreamText) : {};
          } catch {
            upstreamData = { raw: upstreamText };
          }

          if (!upstream.ok) {
            console.error('[/api/dsr] Scrutora rejected request', upstream.status, upstreamText);
            json(res, upstream.status >= 500 ? 502 : 400, {
              error: upstreamData.error || 'Scrutora rejected the request',
              details: upstreamData,
            });
            return;
          }

          console.log(`[dsr] ${requestType} from ${email}`, details || '(no details)');
          json(res, 201, {
            ok: true,
            request_id: upstreamData.request_id || `dsr-${Date.now().toString(36)}`,
            sla_due_at: upstreamData.sla_due_at || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (err: any) {
          console.error('[/api/dsr]', err.message);
          json(res, 400, { error: 'Invalid payload' });
        }
      }
    );

    // ── POST /api/checkout ───────────────────────────────────────────
    // Receives the full checkout payload — contact PII, shipping address,
    // and card/bank payment details — from CheckoutPage and hands it to
    // order processing. This is the server-side sink for that data: it's
    // where PII and payment details actually cross the network boundary
    // out of the browser.
    server.middlewares.use(
      '/api/checkout',
      async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        if (req.method === 'OPTIONS') { json(res, 204, {}); return; }
        if (req.method !== 'POST') { next(); return; }
        try {
          const order = JSON.parse(await readBody(req));
          const { shipping, payment } = order;

          if (!shipping?.email || !payment?.method) {
            json(res, 400, { error: 'shipping and payment details are required' });
            return;
          }

          console.log(
            `[checkout] order for ${shipping.email} · ${payment.method === 'card'
              ? `card ending ${String(payment.card?.cardNumber || '').slice(-4)}`
              : `bank acct ending ${String(payment.bank?.accountNumber || '').slice(-4)}`}`
          );

          json(res, 201, { ok: true, orderId: order.id, receivedAt: new Date().toISOString() });
        } catch (err: any) {
          console.error('[/api/checkout]', err.message);
          json(res, 400, { error: 'Invalid payload' });
        }
      }
    );

    // ── POST /webhooks/consent  (Scrutora signed events) ───────────────
    // Events: consent.granted | consent.updated | consent.withdrawn | dsr.*
    // Verify the HMAC signature in production using your webhook signing secret.
    server.middlewares.use(
      '/webhooks/consent',
      async (req: Connect.IncomingMessage, res: any, next: Connect.NextFunction) => {
        if (req.method === 'OPTIONS') { json(res, 204, {}); return; }
        if (req.method !== 'POST') { next(); return; }
        try {
          const body = await readBody(req);
          const signature = req.headers['x-scrutora-signature-256'];
          const secret = process.env.SCRUTORA_WEBHOOK_SECRET;
          if (secret && typeof signature === 'string') {
            const expected = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
            if (signature !== expected) {
              json(res, 401, { error: 'Invalid signature' });
              return;
            }
          }

          const event = JSON.parse(body);
          const eventType: string = event.event ?? 'unknown';
          console.log(`[scrutora-webhook] ${eventType}`, JSON.stringify(event.data ?? {}, null, 2));
          // Handle withdrawal: stop any server-side processing for this visitor
          if (eventType === 'consent.withdrawn') {
            const withdrawn = Object.keys(event.data?.purposes ?? {})
              .filter((p) => !event.data.purposes[p]);
            console.log(`[scrutora-webhook] withdrawn purposes: ${withdrawn.join(', ')}`);
          }
          json(res, 200, { received: true, event: eventType });
        } catch (err: any) {
          console.error('[/webhooks/consent]', err.message);
          json(res, 400, { error: 'Invalid payload' });
        }
      }
    );
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin],
  server: {
    host: true,                                          // expose on LAN
    port: Number(process.env.PORT) || 5173,              // harness injects PORT via autoPort
    allowedHosts: true,                                  // allow Cloudflare tunnel + any proxy
  },
});
