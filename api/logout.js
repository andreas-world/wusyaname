/**
 * api/logout.js  ->  endpoint POST /api/logout
 * Hapus cookie login.
 */
import { serializeCookie } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }
  res.setHeader('Set-Cookie', serializeCookie(req, '', 0));
  return res.status(200).json({ ok: true });
}
