import { getStones } from '@/lib/data';
import StonesClient from './StonesClient';
import { Stone } from '@/lib/types';

export default async function StonesServer() {
  const stones: Stone[] = await getStones();
  return <StonesClient stones={stones} />;
}