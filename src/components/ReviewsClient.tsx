'use client';

import { Review } from '@/lib/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[var(--ink)]' : 'text-[var(--ash)]'}`}
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

  const [featured, ...rest] = reviews;

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

        {/* === Featured Review === */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="text-7xl md:text-9xl font-display text-[var(--ink)]/10 leading-none mb-2 select-none">
            &ldquo;
          </div>
          <p className="font-display text-xl md:text-2xl text-[var(--ink)] leading-relaxed mb-8">
            {featured.text}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[var(--ink)] text-[var(--white)] flex items-center justify-center font-mono text-sm flex-shrink-0">
              {featured.author_name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="font-mono text-sm font-semibold text-[var(--ink)]">
                {featured.author_name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={featured.rating} />
                {featured.avito_url && (
                  <span className="text-[10px] font-mono text-[var(--ash)] ml-1">
                    &middot; Avito
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* === Remaining Reviews === */}
        {rest.length > 0 && (
          <div className="relative">
            {/* Mobile scroll hint */}
            <div className="flex items-center justify-between mb-5 md:mb-8">
              <p className="system-label text-xs">ЕЩЁ ОТЗЫВЫ</p>
              <span className="md:hidden text-[10px] font-mono text-[var(--ash)] tracking-widest uppercase flex items-center gap-1">
                Листайте
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                  <path d="M4 2l4 4-4 4" />
                </svg>
              </span>
            </div>
            
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto snap-x snap-mandatory pb-2 md:overflow-visible md:snap-none scrollbar-none">
              {rest.map((review) => (
                <div
                  key={review.id}
                  className="min-w-[280px] md:min-w-0 snap-start"
                >
                  <div className="bg-[var(--white)] p-6 border-l-2 border-[var(--ink)] h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--ink)] text-[var(--white)] flex items-center justify-center font-mono text-xs flex-shrink-0">
                        {review.author_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold text-[var(--ink)] truncate">
                          {review.author_name}
                        </p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    
                    <p className="text-sm text-[var(--ash)] leading-relaxed flex-1">
                      &laquo;{review.text}&raquo;
                    </p>
                    
                    {review.avito_url && (
                      <a
                        href={review.avito_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-mono tracking-widest uppercase text-[var(--ash)] hover:text-[var(--ink)] transition-colors w-fit"
                      >
                        Avito ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="divider-thick mt-20" />
      </div>
    </section>
  );
}