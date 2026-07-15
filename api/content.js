/**
 * api/content.js  ->  endpoint /api/content
 * GET  : dipakai landing page buat nampilin konten terbaru (publik).
 * PUT  : dipakai dashboard buat menyimpan konten (harus login).
 */
import { readContent, writeContent } from '../lib/store.js';
import { isLoggedIn } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      return res.status(200).json(await readContent());
    } catch (e) {
      return res.status(500).json({ error: 'Gagal membaca konten' });
    }
  }

  if (req.method === 'PUT') {
    if (!isLoggedIn(req)) {
      return res.status(401).json({ error: 'Belum login. Silakan login dulu di /admin.html' });
    }
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await writeContent(body);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Gagal menyimpan konten' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method tidak diizinkan' });
}
