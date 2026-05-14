import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://owqzkqmjiiqzdmgjkrzm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cXprcW1qaWlxemRtZ2prcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzcyNzgsImV4cCI6MjA5NDAxMzI3OH0.adqBT5P5vltkno8h1Shp4G0OUfneOXyQHzgHmVva6pY';

// RLS is disabled on all tables, anon key has full access
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  realtime: { params: { eventsPerSecond: 0 } },
});
