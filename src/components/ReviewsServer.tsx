import { getReviews } from '@/lib/data';
import ReviewsClient from './ReviewsClient';
import { Review } from '@/lib/types';

export default async function ReviewsServer() {
  const reviews: Review[] = await getReviews();
  return <ReviewsClient reviews={reviews} />;
}