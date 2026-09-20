import express from 'express';
import type { Request, Response } from 'express';
import https from 'https';
import http from 'http';
import { createHmac } from 'crypto';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

// Standalone HTTP service for My AI Fashion. Holds every route that
// receives customer data — contact/shipping PII, card/bank payment
// details, DSR requests, and Scrutora consent webhooks — so it reads as
// a real service surface (not just Vite dev tooling) for data-mapping
// and compliance scanning.

export const app = express();
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
const jsonBody = express.json();

function proxyUrl(url: string): Promise<{ contentType: string; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'MyAIFashion/1.0' } }, (res) => {
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

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set in .env');
  return new Anthropic({ apiKey: key });
}

// ── GET /api/generate-image?prompt=...&style=... ───────────────────────
app.get('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const prompt = String(req.query.prompt || 'abstract t-shirt design');
    const style = String(req.query.style || '');
    const seed = String(req.query.seed || Date.now());
    const full = style
      ? `${prompt}, ${style} art style, t-shirt graphic, high contrast, white background`
      : `${prompt}, t-shirt graphic design, high contrast, white background`;
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(full)}?width=512&height=512&nologo=true&model=flux&seed=${seed}`;
    const { contentType, data } = await proxyUrl(imageUrl);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(data);
  } catch (err: any) {
    console.error('[/api/generate-image]', err.message);
    res.status(502).json({ error: 'Image generation failed: ' + err.message });
  }
});

// ── POST /api/recommend ─────────────────────────────────────────────────
app.post('/api/recommend', jsonBody, async (req: Request, res: Response) => {
  try {
    const body = req.body;
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
    res.status(200).json({ recommendation: text });
  } catch (err: any) {
    console.error('[/api/recommend]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/check-copyright ───────────────────────────────────────────
app.post('/api/check-copyright', jsonBody, async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
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
    const match = raw.match(/\{[\s\S]*\}/);
    const result = match ? JSON.parse(match[0]) : { safe: true };
    res.status(200).json(result);
  } catch (err: any) {
    console.error('[/api/check-copyright]', err.message);
    res.status(200).json({ safe: true });
  }
});

// ── POST /api/dsr ─────────────────────────────────────────────────────
// Data-subject request intake: forwards the requester's email and details
// to Scrutora's consent/DSR API.
app.post('/api/dsr', jsonBody, async (req: Request, res: Response) => {
  try {
    const requestType = String(req.body.request_type || 'access');
    const email = String(req.body.email || '').trim();
    const details = String(req.body.details || '').trim();

    if (!email) {
      res.status(400).json({ error: 'email is required' });
      return;
    }

    const siteKey = process.env.SCRUTORA_SITE_KEY || 'cs_6c696cd10052901de637e7f922a3d56e';
    const endpoint = `https://api.scrutora.com/api/consent/dsr/${siteKey}`;
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'Accept': 'application/json' },
      body: JSON.stringify({ request_type: requestType, email, details }),
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
      res.status(upstream.status >= 500 ? 502 : 400).json({
        error: upstreamData.error || 'Scrutora rejected the request',
        details: upstreamData,
      });
      return;
    }

    console.log(`[dsr] ${requestType} from ${email}`, details || '(no details)');
    res.status(201).json({
      ok: true,
      request_id: upstreamData.request_id || `dsr-${Date.now().toString(36)}`,
      sla_due_at: upstreamData.sla_due_at || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err: any) {
    console.error('[/api/dsr]', err.message);
    res.status(400).json({ error: 'Invalid payload' });
  }
});

// ── POST /api/checkout ────────────────────────────────────────────────
// Order intake: receives contact/shipping PII and card/bank payment
// details from the checkout form. This is the ingress point for the
// application's most sensitive data categories.
app.post('/api/checkout', jsonBody, async (req: Request, res: Response) => {
  try {
    const order = req.body;
    const { shipping, payment } = order;

    if (!shipping?.email || !payment?.method) {
      res.status(400).json({ error: 'shipping and payment details are required' });
      return;
    }

    console.log(
      `[checkout] order for ${shipping.email} · ${payment.method === 'card'
        ? `card ending ${String(payment.card?.cardNumber || '').slice(-4)}`
        : `bank acct ending ${String(payment.bank?.accountNumber || '').slice(-4)}`}`
    );

    res.status(201).json({ ok: true, orderId: order.id, receivedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error('[/api/checkout]', err.message);
    res.status(400).json({ error: 'Invalid payload' });
  }
});

// ── POST /webhooks/consent  (Scrutora signed events) ────────────────────
app.post('/webhooks/consent', express.text({ type: '*/*' }), async (req: Request, res: Response) => {
  try {
    const body = req.body as string;
    const signature = req.headers['x-scrutora-signature-256'];
    const secret = process.env.SCRUTORA_WEBHOOK_SECRET;
    if (secret && typeof signature === 'string') {
      const expected = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
      if (signature !== expected) {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }
    }

    const event = JSON.parse(body);
    const eventType: string = event.event ?? 'unknown';
    console.log(`[scrutora-webhook] ${eventType}`, JSON.stringify(event.data ?? {}, null, 2));
    if (eventType === 'consent.withdrawn') {
      const withdrawn = Object.keys(event.data?.purposes ?? {}).filter((p) => !event.data.purposes[p]);
      console.log(`[scrutora-webhook] withdrawn purposes: ${withdrawn.join(', ')}`);
    }
    res.status(200).json({ received: true, event: eventType });
  } catch (err: any) {
    console.error('[/webhooks/consent]', err.message);
    res.status(400).json({ error: 'Invalid payload' });
  }
});

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const port = Number(process.env.SERVER_PORT) || 8787;
  app.listen(port, () => {
    console.log(`My AI Fashion API listening on http://localhost:${port}`);
  });
}
