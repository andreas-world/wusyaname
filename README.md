# Wusyaname + Dashboard Admin (tanpa WordPress)

Landing page Wusyaname yang isinya (hero, tentang, testimoni, FAQ) bisa
diubah lewat dashboard admin, tanpa WordPress — pakai Node.js + Express
+ file JSON sebagai "database".

## Cara menjalankan

1. Pastikan Node.js sudah terinstall (cek dengan `node -v`).
2. Buka folder ini di terminal, lalu jalankan:
   ```
   npm install
   npm start
   ```
3. Buka di browser:
   - Landing page: http://localhost:3000/index.html
   - Dashboard admin: http://localhost:3000/admin.html

## Login admin (default)

- Username: `admin`
- Password: `admin123`

Bisa diganti di `server.js`, cari variabel `ADMIN_USERNAME` dan `ADMIN_PASSWORD`.

## Cara kerjanya (buat dijelasin ke dosen)

```
public/index.html  --GET /api/content-->  server.js  --baca-->  data/content.json
public/admin.html  --PUT /api/content-->  server.js  --tulis--> data/content.json
```

- `data/content.json` adalah tempat semua teks landing page disimpan
  (dianggap sebagai "database" sederhana).
- `server.js` adalah backend Express yang punya beberapa endpoint API:
  - `GET  /api/content`  → publik, dipakai landing page buat ambil teks terbaru
  - `PUT  /api/content`  → hanya admin yang login yang boleh akses, dipakai buat simpan perubahan
  - `POST /api/login`, `POST /api/logout`, `GET /api/session` → untuk autentikasi admin sederhana (session-based)
- `public/main.js` sudah dimodifikasi supaya, saat landing page dibuka,
  ia mengambil data dari `/api/content` lalu mengisi teks-teks yang
  tadinya hardcode (hero, about, testimoni, FAQ).
- `public/admin.html` + `admin.js` adalah dashboard-nya: form untuk
  mengedit tiap bagian, termasuk tambah/hapus testimoni & FAQ, lalu
  tombol "Simpan" yang mengirim semua data ke `PUT /api/content`.

## Kalau mau dikembangkan lagi

- Ganti `data/content.json` dengan database beneran (SQLite/MySQL) —
  cukup ubah fungsi `readContent()` dan `writeContent()` di `server.js`,
  bagian API di atasnya tidak perlu diubah.
- Tambah section lain (features, benefits, how-it-works) ke pola yang
  sama: tambah field di `content.json` → tambah `id`/`data-*` di
  `index.html` → tambah logic ambil-isi di `main.js` → tambah form di
  `admin.html`/`admin.js`.
- Ganti sistem login plaintext ini dengan hash password (misal pakai
  `bcrypt`) kalau mau dipakai lebih serius dari sekadar tugas kuliah.
