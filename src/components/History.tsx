'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function History() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image slides in from left edge
      gsap.fromTo(imageRef.current,
        { x: '-100%', opacity: 0 },
        {
          x: '0%',
          opacity: 1,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Text slides up from below
      gsap.fromTo(textRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="history"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--white)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Image - left side */}
        <div ref={imageRef} className="w-full">
          <div className="relative w-full aspect-square">
            {/* Blurred background layer */}
            <div 
              className="absolute inset-0 scale-110"
              style={{
                backgroundImage: 'url(/%D0%A0%D0%B5%D0%BA%D0%B0.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(12px)',
                opacity: 0.35,
              }}
            />
            {/* Sharp foreground with edge fade */}
            <div 
              className="absolute inset-0"
              style={{ 
                maskImage: 'radial-gradient(ellipse 92% 92% at center, black 82%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 92% 92% at center, black 82%, transparent 100%)',
              }}
            >
              <img
                src="/%D0%A0%D0%B5%D0%BA%D0%B0.jpg"
                alt="Река — философия бренда"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text - right side */}
        <div ref={textRef}>
          <p className="system-label mb-6">ФИЛОСОФИЯ БРЕНДА</p>
          
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8 text-[var(--ink)]">
            История в каждом камне
          </h2>
          
          <p className="text-lg md:text-xl leading-relaxed text-[var(--ash)] mb-8">
            Бренд родился из идеи, что украшения — это не просто декор, а личные символы. 
            Каждый браслет — как послание из мира камней, которое человек носит на запястье.
          </p>
          
          <p className="text-base leading-relaxed text-[var(--ash)]">
            Произвольная форма гематита и индивидуальный рисунок камней делают каждый браслет уникальным. 
            Мы внимательно относимся к надёжности изделий. Наше правило — личная ответственность 
            за сборку каждого браслета. Потому что символы, как и стиль, не подвластны времени и живут вечно.
          </p>
        </div>
      </div>
    </section>
  );
}
