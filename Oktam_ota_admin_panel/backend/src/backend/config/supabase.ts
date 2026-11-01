/**
 * O‘ktam ota choyxonasi - Supabase Client Configuration
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'choyxona-media';

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_URL !== 'https://your-project-id.supabase.co' && 
    SUPABASE_ANON_KEY && 
    SUPABASE_ANON_KEY !== 'your-anon-public-key'
  );
}

/**
 * Anon Client: Ommaviy va RLS bilan himoyalangan so'rovlar uchun.
 */
export function createPublicClient(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
let anonClientInstance: SupabaseClient | null = null;
export function getAnonClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase sozlanmagan! .env faylida SUPABASE_URL va SUPABASE_ANON_KEY o‘zgaruvchilarini to‘ldiring.'
    );
  }
  if (!anonClientInstance) {
    anonClientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return anonClientInstance;
}

/**
 * Foydalanuvchi JWT tokeni bilan ishlovchi Supabase mijozi (RLS ga to'liq bo'ysunadi).
 */
export function getAuthClient(accessToken: string): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase sozlanmagan!');
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * Service Role Client:
 * XAVFSIZLIK: Faqat server ichidagi maxsus amallar uchun (masalan, birinchi adminni yaratish).
 * Oddiy so'rovlarda RLS'ni chetlab o'tish uchun ishlatilmaydi!
 */
let serviceClientInstance: SupabaseClient | null = null;
export function getServiceClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY === 'your-service-role-key') {
    throw new Error(
      'Supabase Service Role sozlanmagan! .env faylida SUPABASE_SERVICE_ROLE_KEY ko‘rsatilishi shart.'
    );
  }
  if (!serviceClientInstance) {
    serviceClientInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return serviceClientInstance;
}
