# Cara deploy ke Vercel

Frontend (public/) tidak diubah. Yang baru: folder /api (fungsi serverless)
dan /lib (storage Redis + auth). Konten disimpan di Upstash Redis, bukan file.

## 1. Pasang storage Upstash Redis
Di dashboard Vercel > project kamu > tab **Storage** > **Create / Connect Store**
> pilih **Upstash (Redis / KV)** > buat store baru > **Connect** ke project ini.
Vercel otomatis mengisi environment variable koneksinya. Tidak perlu copy manual.

## 2. Set environment variable
Di **Settings > Environment Variables**, tambahkan:
- `ADMIN_USERNAME`  -> username admin (mis. admin)
- `ADMIN_PASSWORD`  -> password admin (ganti dari admin123!)
- `SESSION_SECRET`  -> teks acak panjang (mis. hasil generator password)

## 3. Deploy
Push ke GitHub, Vercel auto-deploy. Atau jalankan `vercel --prod`.

- Landing page : https://wusyaname.my.id/
- Dashboard    : https://wusyaname.my.id/admin.html

## 4. Domain
Domain wusyaname.my.id yang sudah kamu pasang tetap dipakai, tanpa perubahan.

## Jalankan lokal
`npm i -g vercel` lalu `vercel link`, `vercel env pull .env.local`, `vercel dev`.
