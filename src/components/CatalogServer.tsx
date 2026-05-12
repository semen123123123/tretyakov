import { getProducts } from '@/lib/data';
import CatalogClient from './CatalogClient';
import { Product } from '@/lib/types';

export default async function CatalogServer() {
  const products: Product[] = await getProducts();
  return <CatalogClient products={products} />;
}