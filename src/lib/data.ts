'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owqzkqmjiiqzdmgjkrzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93cXprcW1qaWlxemRtZ2prcnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzcyNzgsImV4cCI6MjA5NDAxMzI3OH0.adqBT5P5vltkno8h1Shp4G0OUfneOXyQHzgHmVva6pY';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getStones() {
  const { data } = await supabase.from('stones').select('*').order('sort_order');
  return data || [];
}

export async function getProducts() {
  const { data } = await supabase.from('products').select('*').eq('is_published', true).order('sort_order');
  return data || [];
}

export async function getReviews() {
  const { data } = await supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
  return data || [];
}