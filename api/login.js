/**
 * api/login.js  ->  endpoint POST /api/login
 * Cek username & password. Kalau benar, kirim cookie login.
 * Kredensial diambil dari environment variable (JANGAN di-hardcode).
 */
import { createToken, serializeCookie, MAX_AGE } from '../lib/auth.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { username, password } = body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.setHeader('Set-Cookie', serializeCookie(req, createToken(), MAX_AGE));
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Username atau password salah' });
}
