/**
 * api/session.js  ->  endpoint GET /api/session
 * Dipakai dashboard buat cek: user ini udah login apa belum.
 */
import { isLoggedIn } from '../lib/auth.js';

export default async function handler(req, res) {
  return res.status(200).json({ loggedIn: isLoggedIn(req) });
}
