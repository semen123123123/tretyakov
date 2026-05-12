import { getStones } from '@/lib/data';
import Constructor from './Constructor';
import { Stone } from '@/lib/types';

export default async function ConstructorServer() {
  const allStones: Stone[] = await getStones();
  return <Constructor stones={allStones} />;
}
