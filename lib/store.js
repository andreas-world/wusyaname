/**
 * lib/store.js
 * ------------------------------------------------------------------
 * Ini pengganti fungsi baca/tulis file JSON yang lama.
 * Sekarang konten disimpan di Upstash Redis (key-value store) yang
 * jalan mulus di Vercel serverless. Perubahan dari dashboard bakal
 * PERMANEN — gak ilang lagi kayak waktu nulis file.
 *
 * Kredensial Redis diinject otomatis sebagai environment variable
 * pas kamu pasang integrasi Upstash di Vercel Marketplace.
 * ------------------------------------------------------------------
 */
import { Redis } from '@upstash/redis';
import defaultContent from './default-content.js';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

const KEY = 'wusyaname:content';

// Baca konten. Kalau database masih kosong, pakai konten default.
export async function readContent() {
  const data = await redis.get(KEY);
  return data || defaultContent;
}

// Timpa konten dengan data baru dari dashboard.
export async function writeContent(data) {
  await redis.set(KEY, data);
  return true;
}
