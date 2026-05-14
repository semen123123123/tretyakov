'use client';

import { useRef, useState, useEffect } from 'react';

const PHOTOS = [
  '/photo/photo (1).jpg',
  '/photo/photo (2).jpg',
  '/photo/photo (3).jpg',
  '/photo/photo (4).jpg',
];

export default function BraceletSlider() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animStarted = useRef(false);

  // GSAP entrance animation
  useEffect(() => {
    if (animStarted.current) return;
    animStarted.current = true;

    let cancelled = false;
    (async () => {
      const gsap = (await import('gsap')).default;
      if (cancelled) return;
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    })();

    return () => { cancelled = true; };
  }, []);

  const next = () => {
    setCurrentIndex(prev => (prev + 1) % PHOTOS.length);
  };

  const prev = () => {
    setCurrentIndex(prev => (prev - 1 + PHOTOS.length) % PHOTOS.length);
  };

  const total = PHOTOS.length;

  return (
    <section id="gallery" className="py-24 px-6 bg-[var(--white)]">
      <div className="max-w-6xl mx-auto" ref={sectionRef}>
        {/* Section heading */}
        <div className="mb-10 md:mb-14">
          <p className="system-label mb-3">ГАЛЕРЕЯ</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-[var(--ink)]">
            Как смотрятся браслеты
          </h2>
        </div>

        {/* Gallery frame */}
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
          {/* Framed photo with soft gallery shadow */}
          <div className="relative overflow-hidden rounded-sm bg-[var(--white)] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]">
            <div className="flex transition-transform duration-600 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {PHOTOS.map((src, idx) => (
                <div key={idx} className="min-w-full bg-[var(--white)]">
                  <img
                    src={src}
                    alt={`Браслет на фото ${idx + 1}`}
                    className="w-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Previous arrow */}
            {total > 1 && (
              <button
                onClick={prev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-[var(--white)]/90 hover:bg-[var(--white)] border border-[var(--ash)]/50 hover:border-[var(--ink)] rounded-full transition-all hover:scale-105 active:scale-95 text-[var(--ink)] md:opacity-0 md:group-hover:opacity-100"
                aria-label="Предыдущее"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </button>
            )}

            {/* Next arrow */}
            {total > 1 && (
              <button
                onClick={next}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-[var(--white)]/90 hover:bg-[var(--white)] border border-[var(--ash)]/50 hover:border-[var(--ink)] rounded-full transition-all hover:scale-105 active:scale-95 text-[var(--ink)] md:opacity-0 md:group-hover:opacity-100"
                aria-label="Следующее"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6L15 12L9 18" />
                </svg>
              </button>
            )}
          </div>

          {/* Dots navigation */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2.5 mt-6">
              {PHOTOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-7 h-2 bg-[var(--ink)]'
                      : 'w-2 h-2 bg-[var(--ash)]/40 hover:bg-[var(--ash)]'
                  }`}
                  aria-label={`Фото ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
          </div>
        </div>
    </section>
  );
}
