'use client';

import { Review } from '@/lib/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-amber-600' : 'text-[var(--ash)]/40'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 px-6 bg-[var(--raw-paper)]">
      <div className="max-w-6xl mx-auto">
        <div className="divider-thick mb-12" />
        
        <p className="system-label mb-4">ОТЗЫВЫ</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-2 text-[var(--ink)]">
          Что говорят клиенты
        </h2>
        <p className="font-mono text-sm text-[var(--ash)] mb-16">
          {reviews.length} отзыв{reviews.length === 1 ? '' : reviews.length < 5 ? 'а' : 'ов'}
        </p>

        {/* Masonry columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((review) => (
            <div key={review.id} className="flex">
              <div className="bg-[var(--white)] border-l-2 border-[var(--ink)] p-6 relative flex flex-col w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">                {/* Decorative quote */}
                <div className="text-6xl font-display text-[var(--ink)]/5 leading-none mb-2 select-none">
                  &ldquo;
                </div>
                
                {/* Avito badge */}
                {review.avito_url && (
                  <a
                    href={review.avito_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 text-[9px] font-mono tracking-widest uppercase text-[var(--ash)] hover:text-[var(--ink)] transition-colors"
                  >
                    Avito ↗
                  </a>
                )}
                
                <p className="text-sm text-[var(--ink)] leading-relaxed mb-5 flex-1">
                  {review.text}
                </p>
                
                {/* Author row */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--ink)]/10">
                  <div className="w-8 h-8 rounded-full bg-[var(--ink)] text-[var(--white)] flex items-center justify-center font-mono text-xs flex-shrink-0">
                    {review.author_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-[var(--ink)] truncate">
                      {review.author_name}
                    </p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="divider-thick mt-20" />
      </div>
    </section>
  );
}
