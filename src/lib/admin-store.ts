'use server';

import { supabase } from './supabase';
import { products as defaultProducts } from './products-data';
import { stones as defaultStones } from './stones-data';
import { reviews as defaultReviews } from './reviews-data';
import type { Product, Stone, Order, Review, OrderItem } from './types';

// ─── Auto-seed on first use ─────────────────────────────────

async function ensureSeeded() {
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (productCount !== null && productCount === 0) {
    // Seed products
    for (const p of defaultProducts) {
      await supabase.from('products').insert({
        name: p.name,
        slug: p.slug,
        description: p.description,
        stone_composition: p.stone_composition,
        price: p.price,
        image_url: p.image_url,
        is_custom: p.is_custom ?? false,
        is_published: p.is_published ?? true,
        in_stock: p.in_stock ?? true,
        sort_order: p.sort_order ?? 0,
        historical_fact: p.historical_fact || null,
        advantages: p.advantages || [],
        stone_details: p.stone_details || null,
        size_info: p.size_info || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Seed stones
    for (const s of defaultStones) {
      await supabase.from('stones').insert({
        name_ru: s.name_ru,
        name_en: s.name_en,
        description: s.description,
        history_facts: s.history_facts,
        additional_fact: s.additional_fact,
        color: s.color,
        image_url: s.image_url,
        price_per_unit: s.price_per_unit,
        sort_order: s.sort_order ?? 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Seed reviews
    for (const r of defaultReviews) {
      await supabase.from('reviews').insert({
        author_name: r.author_name,
        author_avatar: r.author_avatar,
        rating: r.rating,
        text: r.text,
        source: r.source,
        avito_url: r.avito_url || null,
        is_approved: r.is_approved ?? true,
        created_at: new Date().toISOString(),
      });
    }
  }
}

// ─── Products ────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Failed to fetch products: ' + error.message);
  return (data || []).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return mapProduct(data);
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  await ensureSeeded();
  const { data: inserted, error } = await supabase
    .from('products')
    .insert({
      name: data.name || '',
      slug: data.slug || '',
      description: data.description || '',
      stone_composition: data.stone_composition || '',
      price: data.price || 0,
      image_url: data.image_url || null,
      is_custom: data.is_custom ?? false,
      is_published: data.is_published ?? true,
      in_stock: data.in_stock ?? true,
      sort_order: data.sort_order ?? 0,
      historical_fact: data.historical_fact || null,
      advantages: data.advantages || [],
      stone_details: data.stone_details || null,
      size_info: data.size_info || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error('Failed to create product: ' + error.message);
  return mapProduct(inserted);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  const updates: any = { ...data, updated_at: new Date().toISOString() };
  delete updates.id;

  const { data: updated, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return mapProduct(updated);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return !error;
}

// ─── Stones ──────────────────────────────────────────────────

export async function getStones(): Promise<Stone[]> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from('stones')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Failed to fetch stones: ' + error.message);
  return (data || []).map(mapStone);
}

export async function createStone(data: Partial<Stone>): Promise<Stone> {
  await ensureSeeded();
  const { data: inserted, error } = await supabase
    .from('stones')
    .insert({
      name_ru: data.name_ru || '',
      name_en: data.name_en || '',
      description: data.description || '',
      history_facts: data.history_facts || '',
      additional_fact: data.additional_fact || '',
      color: data.color || '',
      image_url: data.image_url || null,
      history_image: (data as any).history_image || null,
      price_per_unit: data.price_per_unit || 0,
      sort_order: data.sort_order ?? 0,
      properties: '',
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error('Failed to create stone: ' + error.message);
  return mapStone(inserted);
}

export async function updateStone(id: string, data: Partial<Stone>): Promise<Stone | null> {
  const updates: any = { ...data, updated_at: new Date().toISOString() };
  delete updates.id;

  const { data: updated, error } = await supabase
    .from('stones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return mapStone(updated);
}

export async function deleteStone(id: string): Promise<boolean> {
  const { error } = await supabase.from('stones').delete().eq('id', id);
  return !error;
}

// ─── Orders ──────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Failed to fetch orders: ' + error.message);
  return (data || []).map(mapOrder);
}

export async function createOrder(data: Partial<Order> & { items?: OrderItem[] }): Promise<Order> {
  await ensureSeeded();
  const now = new Date().toISOString();

  // Sequential order number
  const { count, error: countError } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  const orderNumber = `№${(count || 0) + 1}`;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: data.customer_name || '',
      customer_email: data.customer_email || null,
      customer_phone: data.customer_phone || null,
      delivery_address: data.delivery_address || null,
      total_amount: data.total_amount || 0,
      status: 'pending',
      payment_status: 'pending',
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (orderError) throw new Error('Failed to create order: ' + orderError.message);

  // Insert order items
  if (data.items && data.items.length > 0) {
    const orderItems = data.items.map((item: OrderItem) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      quantity: item.quantity || 1,
      unit_price: item.unit_price || 0,
      created_at: now,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) console.error('Failed to insert order items:', itemsError);
  }

  return mapOrder({ ...order, order_items: data.items || [] });
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  const { data: updated, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, order_items(*)')
    .single();

  if (error) return null;
  return mapOrder(updated);
}

// ─── Reviews ─────────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  await ensureSeeded();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error('Failed to fetch reviews: ' + error.message);
  return (data || []).map(mapReview);
}

export async function createReview(data: Partial<Review>): Promise<Review> {
  await ensureSeeded();
  const { data: inserted, error } = await supabase
    .from('reviews')
    .insert({
      author_name: data.author_name || '',
      author_avatar: data.author_avatar || null,
      rating: data.rating || 5,
      text: data.text || '',
      source: data.source || 'Сайт',
      avito_url: data.avito_url || null,
      is_approved: data.is_approved ?? false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error('Failed to create review: ' + error.message);
  return mapReview(inserted);
}

export async function updateReview(id: string, data: Partial<Review>): Promise<Review | null> {
  const updates: any = { ...data };
  delete updates.id;

  const { data: updated, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return mapReview(updated);
}

export async function deleteReview(id: string): Promise<boolean> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  return !error;
}

// ─── Mappers (DB shape → app types) ─────────────────────────

function mapProduct(db: any): Product {
  return {
    id: db.id,
    name: db.name,
    slug: db.slug,
    description: db.description || '',
    stone_composition: db.stone_composition || '',
    price: Number(db.price) || 0,
    image_url: db.image_url || null,
    is_custom: db.is_custom ?? false,
    is_published: db.is_published ?? true,
    in_stock: db.in_stock ?? true,
    sort_order: db.sort_order ?? 0,
    historical_fact: db.historical_fact || '',
    advantages: db.advantages || [],
    stone_details: db.stone_details || '',
    size_info: db.size_info || '',
  };
}

function mapStone(db: any): Stone {
  return {
    id: db.id,
    name_ru: db.name_ru,
    name_en: db.name_en || '',
    description: db.description || '',
    history_facts: db.history_facts || '',
    additional_fact: db.additional_fact || '',
    color: db.color || '',
    image_url: db.image_url || null,
    history_image: db.history_image || null,
    price_per_unit: Number(db.price_per_unit) || 0,
    sort_order: db.sort_order ?? 0,
  };
}

function mapOrder(db: any): Order {
  const items: OrderItem[] = (db.order_items || []).map((oi: any) => ({
    product_id: oi.product_id || '',
    product_name: '',
    stone_composition: '',
    quantity: oi.quantity || 1,
    unit_price: Number(oi.unit_price) || 0,
  }));

  return {
    id: db.id,
    order_number: db.order_number,
    customer_name: db.customer_name,
    customer_phone: db.customer_phone || null,
    customer_email: db.customer_email || null,
    delivery_address: db.delivery_address || null,
    total_amount: Number(db.total_amount) || 0,
    items,
    status: db.status || 'pending',
    payment_status: db.payment_status || 'pending',
    payment_id: db.payment_id || null,
    created_at: db.created_at,
  };
}

function mapReview(db: any): Review {
  return {
    id: db.id,
    author_name: db.author_name,
    author_avatar: db.author_avatar || null,
    rating: db.rating || 5,
    text: db.text || '',
    source: db.source || '',
    avito_url: db.avito_url || undefined,
    is_approved: db.is_approved ?? true,
    created_at: db.created_at,
  };
}
