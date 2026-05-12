'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

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

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setReviews(data);
      }
      setLoading(false);
    }
    fetchReviews();
  }, []);

  useEffect(() => {
    if (!loading && reviews.length > 0) {
      const ctx = gsap.context(() => {
        const cards = gridRef.current?.children;
        if (cards) {
          gsap.fromTo(cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 80%',
              }
            }
          );
        }
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, reviews]);

  return (
    <section 
      id="reviews"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--white)]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="divider-thick mb-12" />
        
        <p className="system-label mb-4">ОТЗЫВЫ</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 text-[var(--ink)]">
          Что говорят клиенты
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--ash)]">Загрузка...</p>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[var(--ink)] text-[var(--white)] flex items-center justify-center font-mono text-sm">
                    {review.author_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-[var(--ink)]">
                      {review.author_name}
                    </p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                
                <p className="text-sm text-[var(--ash)] leading-relaxed">
                  {review.text}
                </p>
                
                {review.source && (
                  <p className="system-label mt-4 text-[var(--ash)]">
                    {review.source.toUpperCase()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="divider-thick mt-12" />
      </div>
    </section>
  );
}