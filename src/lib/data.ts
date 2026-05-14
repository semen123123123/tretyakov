'use server';

import { getProducts as getStoreProducts, getStones as getStoreStones, getReviews as getStoreReviews } from './admin-store';

export async function getStones() {
  return getStoreStones();
}

export async function getProducts() {
  const all = await getStoreProducts();
  // Only show published, in-stock products on the storefront
  return all.filter(p => p.is_published && p.in_stock);
}

export async function getReviews() {
  return getStoreReviews();
}