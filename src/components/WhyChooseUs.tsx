'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Ручная сборка',
    description: 'Каждый браслет собирается вручную индивидуально под размер клиента',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="1.5">
        <path d="M12 8 C12 4, 16 2, 20 4 C24 6, 24 12, 20 14 L24 18 L22 20 L18 16 C16 18, 12 18, 10 16 L6 20 L4 18 L8 14 C6 10, 8 6, 12 8Z" />
      </svg>
    ),
  },
  {
    title: 'Натуральные камни',
    description: 'Используем только настоящие камни с проверенных месторождений',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="1.5">
        <polygon points="16,4 26,12 22,26 10,26 6,12" />
        <line x1="16" y1="4" x2="16" y2="26" />
        <line x1="6" y1="12" x2="26" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Гарантия качества',
    description: 'Личная ответственность за сборку каждого браслета',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="1.5">
        <path d="M16 4 L20 10 L28 12 L22 18 L24 26 L16 22 L8 26 L10 18 L4 12 L12 10 Z" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = contentRef.current?.children;
      if (items) {
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="why-us"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--white)]"
    >
      <div className="max-w-6xl mx-auto">
        <p className="system-label mb-4">ПРЕИМУЩЕСТВА</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8 text-[var(--ink)]">
          Почему выбирают нас
        </h2>
        
        <p className="text-[var(--ash)] mb-12 max-w-2xl">
          Мы не штампуем браслеты как на конвейере. Каждый браслет собирается вручную 
          индивидуально под размер клиента с особым вниманием к надёжности каждого изделия.
        </p>
        
        <div 
          ref={contentRef}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="font-mono text-sm uppercase tracking-wide text-[var(--ink)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--ash)] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}