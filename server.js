/**
 * server.js
 * -----------------------------------------------------------
 * Backend sederhana untuk landing page Wusyaname yang bisa
 * diedit lewat dashboard admin, TANPA WordPress.
 *
 * Konsepnya:
 * 1. Semua teks landing page (hero, about, testimoni, FAQ)
 *    disimpan di file data/content.json  -> ini "database"-nya.
 * 2. index.html TIDAK hardcode teks lagi, tapi mengambil data
 *    lewat GET /api/content saat halaman dibuka.
 * 3. Admin login di /admin.html, lalu bisa mengubah data
 *    lewat form -> dikirim ke server lewat PUT /api/content.
 * 4. Server menimpa (overwrite) content.json dengan data baru.
 *
 * Kenapa pakai file JSON, bukan MySQL/dsb?
 * Karena ini paling gampang dipahami untuk pemula: tidak perlu
 * install database server, tinggal baca/tulis 1 file JSON.
 * Kalau nanti sudah lebih jago, tinggal ganti bagian
 * readContent()/writeContent() supaya baca/tulis ke database
 * beneran (MySQL/SQLite/dst) — struktur API di atasnya TIDAK
 * perlu berubah.
 * -----------------------------------------------------------
 */

const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const CONTENT_PATH = path.join(__dirname, 'data', 'content.json');

// ── GANTI INI kalau mau, ini kredensial admin (super sederhana, buat tugas kuliah) ──
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ganti-dengan-teks-rahasia-bebas',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // sesi login berlaku 2 jam
}));

// ── Helper baca & tulis content.json ──
function readContent() {
  const raw = fs.readFileSync(CONTENT_PATH, 'utf-8');
  return JSON.parse(raw);
}
function writeContent(data) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Middleware: cek apakah request datang dari admin yang sudah login ──
function requireLogin(req, res, next) {
  if (req.session && req.session.loggedIn) return next();
  return res.status(401).json({ error: 'Belum login. Silakan login dulu di /admin.html' });
}

// ══ AUTH ══
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Username atau password salah' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ loggedIn: !!(req.session && req.session.loggedIn) });
});

// ══ CONTENT ══
// Publik: dipakai landing page (index.html) buat nampilin konten terbaru
app.get('/api/content', (req, res) => {
  try {
    res.json(readContent());
  } catch (err) {
    res.status(500).json({ error: 'Gagal membaca konten' });
  }
});

// Terproteksi: hanya admin yang sudah login yang boleh mengubah konten
app.put('/api/content', requireLogin, (req, res) => {
  try {
    writeContent(req.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan konten' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
  console.log(`   Landing page : http://localhost:${PORT}/index.html`);
  console.log(`   Admin panel  : http://localhost:${PORT}/admin.html`);
});
