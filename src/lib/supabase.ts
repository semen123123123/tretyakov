import { createClient } from '@supabase/supabase-js';
import type { Stone, Product, Order, Review, CartItem } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://owqzkqmjiiqzdmgjkrzm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cXprcW1qaWlxemRtZ2prcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzcyNzgsImV4cCI6MjA5NDAxMzI3OH0.adqBT5P5vltkno8h1Shp4G0OUfneOXyQHzgHmVva6pY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  realtime: { params: { eventsPerSecond: 0 } },
  global: {
    fetch: (url, opts) =>
      fetch(url, { ...opts, signal: AbortSignal.timeout(8000) }),
  },
});

export type { Stone, Product, Order, Review, CartItem };