'use client';

import { useEffect, useRef } from 'react';

const features = [
  {
    title: 'Ручная сборка',
    description: 'Каждый браслет собирается вручную индивидуально под размер клиента',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 20 v-9" />
        <path d="M11.5 20 v-12" />
        <path d="M15 20 v-13" />
        <path d="M18.5 20 v-11" />
        <path d="M22 20 v-7" />
        <path d="M7 20 q0 4 3 6 q3 2 6 2 h2 q3 0 5 -2 q2 -2 2 -5 v-2" />
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

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const ctx = gsap.context(() => {
        // Title animation
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
        );

        // Text animation
        gsap.fromTo(textRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
        );

        // Features animation on scroll
        gsap.fromTo(descRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top 85%',
            }
          }
        );

        const items = featuresRef.current?.children;
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
                trigger: featuresRef.current,
                start: 'top 80%',
              }
            }
          );
        }
      }, containerRef);

      // Store cleanup reference
      (window as any).__gsapHeroCtx = ctx;
    })();

    return () => {
      cancelled = true;
      const ctx = (window as any).__gsapHeroCtx;
      if (ctx) ctx.revert();
      delete (window as any).__gsapHeroCtx;
    };
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative overflow-hidden bg-[var(--white)]"
    >
      {/* Background image — cropped from top */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom opacity-25"
        style={{
          backgroundImage: 'url("/Fon.jpg")',
        }}
      />
      
      {/* First screen: mission text */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 pt-96">
        <div className="max-w-4xl text-center">
          <h1 ref={titleRef} className="font-display text-2xl sm:text-4xl md:text-7xl font-bold tracking-[0.15em] text-[#999999] mb-8 whitespace-nowrap">
            | Т Р Е Т Ь Я К О В |
          </h1>
          <p 
            ref={textRef}
            className="text-lg md:text-xl leading-relaxed text-black max-w-2xl mx-auto"
          >
            Браслеты — это больше, чем просто аксессуары. Это хронология твоего жизненного пути. 
            Коллекция личных символов, воспоминаний и образов. Мы решили сделать эти образы 
            современными, стильными и смелыми.
          </p>
        </div>

      </div>

      {/* Features section */}
      <div className="relative z-10 bg-[var(--white)] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="divider-thick mb-12" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8 text-[var(--ink)] text-center">
            Почему выбирают нас
          </h2>
          
          <p ref={descRef} className="text-[var(--ash)] mb-12 max-w-2xl mx-auto text-center">
            Мы не штампуем браслеты как на конвейере. Каждый браслет собирается вручную 
            индивидуально под размер клиента с особым вниманием к надёжности каждого изделия.
          </p>
          
          <div 
            ref={featuresRef}
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
          <div className="divider-thick mt-12" />
        </div>
      </div>
    </section>
  );
}