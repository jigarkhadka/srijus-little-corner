import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

/**
 * Generic key/value storage for the app, backed by Vercel KV.
 *
 * GET  /api/state?key=sriju_bucket        -> { key, value }
 * POST /api/state  { key, value }         -> { key, ok: true }
 *
 * Every piece of app state (bucket list, diary, mixtape, budget, timeline memories, etc.)
 * is stored under its own key, namespaced below so it can't collide with anything else
 * you might put in the same KV database later.
 *
 * SETUP (one time):
 *   1. In the Vercel dashboard: your project -> Storage -> Create Database -> KV.
 *      Connect it to this project. Vercel automatically adds the KV_REST_API_URL /
 *      KV_REST_API_TOKEN env vars for you -- nothing to copy by hand.
 *   2. `npm install @vercel/kv` in your project.
 *   3. Deploy. That's it -- useCloudStorage() in App.tsx will start reading/writing here.
 *
 * NOTE ON PRIVACY: this endpoint has no authentication. That's fine for a private link only
 * the two of you know, but anyone who discovers the URL could read or overwrite the data by
 * calling the API directly. If you want real protection, the simplest upgrade is a shared
 * passphrase gate in front of the whole site (ask and I'll add one) rather than trying to
 * secure this endpoint alone.
 */

const NAMESPACE = 'tingu-app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const key = req.query.key;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" query param' });
        return;
      }
      const value = await kv.get(`${NAMESPACE}:${key}`);
      res.status(200).json({ key, value: value ?? null });
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const key = body?.key;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'Missing "key" in request body' });
        return;
      }
      await kv.set(`${NAMESPACE}:${key}`, body.value);
      res.status(200).json({ key, ok: true });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('KV storage error:', err);
    res.status(500).json({ error: 'Storage error' });
  }
}
