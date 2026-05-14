import { getStones, getProducts } from '@/lib/data';
import StonesClient from './StonesClient';
import { Stone, Product } from '@/lib/types';

export default async function StonesServer() {
  const [stones, products]: [Stone[], Product[]] = await Promise.all([getStones(), getProducts()]);
  return <StonesClient stones={stones} products={products} />;
}
