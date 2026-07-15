/**
 * lib/auth.js
 * ------------------------------------------------------------------
 * Login admin versi "stateless" pakai cookie yang ditandatangani.
 *
 * Kenapa bukan express-session lagi?
 * Di Vercel (serverless), tiap request bisa dijalankan oleh instance
 * yang beda, jadi menyimpan sesi di memori server TIDAK reliable.
 * Solusinya: pas login sukses, kita kasih cookie berisi token yang
 * "ditandatangani" pakai SESSION_SECRET. Tiap mau nyimpen konten,
 * kita cek tanda tangan cookie itu. Gak perlu nyimpen apa-apa di server.
 * ------------------------------------------------------------------
 */
import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || 'dev-secret-WAJIB-diganti-di-produksi';
const COOKIE_NAME = 'wusya_admin';
const MAX_AGE = 60 * 60 * 2; // 2 jam (dalam detik)

const b64url = (buf) => Buffer.from(buf).toString('base64url');

// Bikin token login baru yang ditandatangani.
export function createToken() {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + MAX_AGE * 1000 });
  const data = b64url(payload);
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

// Cek apakah token asli (tanda tangan cocok) & belum kedaluwarsa.
export function verifyToken(token) {
  if (!token || !token.includes('.')) return false;
  const [data, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

// Ambil nilai cookie dari header request.
export function getCookie(req, name = COOKIE_NAME) {
  const header = req.headers.cookie || '';
  const found = header
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + '='));
  return found ? decodeURIComponent(found.split('=').slice(1).join('=')) : null;
}

// Rangkai header Set-Cookie (buat login) atau menghapusnya (maxAge=0, buat logout).
export function serializeCookie(req, value, maxAge) {
  const isLocal = (req.headers.host || '').includes('localhost');
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ];
  if (!isLocal) parts.push('Secure'); // di produksi (https) wajib Secure
  return parts.join('; ');
}

// Shortcut: apakah request ini dari admin yang sudah login?
export function isLoggedIn(req) {
  return verifyToken(getCookie(req));
}

export { MAX_AGE };
