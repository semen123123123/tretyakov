'use client';

import { useEffect, useRef, useState } from 'react';

const SLIDE_COUNT = 3;

const BACKGROUND_IMAGES = [
  '/Fon/Fon.jpg',
  '/Fon/Fon3.jpg',
  '/Fon/Fon4.jpg',
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Preload all background images into browser cache
  useEffect(() => {
    BACKGROUND_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = encodeURI(src);
    });
  }, []);

  // Animate title + subtitle — fade up from below
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const gsap = (await import('gsap')).default;
      if (cancelled || !titleRef.current) return;

      const titleEl = titleRef.current;
      const subtitleEl = titleEl.nextElementSibling as HTMLElement | null;

      // Set initial state
      gsap.set([titleEl, subtitleEl], { opacity: 0, y: 40 });

      // Animate both together: rise and fade in
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(titleEl, { opacity: 1, y: 0, duration: 1, delay: 0.4 }, 0);
      tl.to(subtitleEl, { opacity: 1, y: 0, duration: 1, delay: 0.6 }, 0);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-slide background every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDE_COUNT);
        setIsTransitioning(false);
      }, 700);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Determine slide transform based on current state
  function getSlideTransform(index: number): string {
    const nextIndex = (currentIndex + 1) % SLIDE_COUNT;

    if (!isTransitioning) {
      // Idle: current center, next off-right (ready to enter from right), rest off-left
      if (index === currentIndex) return 'translateX(0%)';
      if (index === nextIndex) return 'translateX(100%)';
      return 'translateX(-100%)';
    } else {
      // Transitioning: current slides left out, next enters from right
      if (index === currentIndex) return 'translateX(-100%)';
      if (index === nextIndex) return 'translateX(0%)';
      return 'translateX(-100%)';
    }
  }

  function shouldTransition(index: number): boolean {
    if (!isTransitioning) return false;
    const nextIndex = (currentIndex + 1) % SLIDE_COUNT;
    return index === currentIndex || index === nextIndex;
  }

  // GSAP animations for features section on scroll
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          descRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top 85%',
            },
          }
        );

        gsap.fromTo(
          Array.from(featuresRef.current!.children),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
            },
          }
        );
      }, featuresRef);
      return () => ctx.revert();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[var(--white)]"
    >
      {/* Background slideshow — shifted up 200px to crop top */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ top: '-200px', height: 'calc(100% + 200px)' }}
      >
        {BACKGROUND_IMAGES.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center opacity-100"
            style={{
              backgroundImage: `url("${encodeURI(src)}")`,
              transform: getSlideTransform(index),
              transition: shouldTransition(index)
                ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Spacer — full screen with animated title below center */}
      <div className="relative z-10 min-h-screen">
        <div className="absolute left-1/2 -translate-x-1/2 top-[55%]">
          <h1
            ref={titleRef}
            className="font-display text-2xl sm:text-4xl md:text-7xl font-bold tracking-[0.15em] whitespace-nowrap select-none"
            style={{
              color: '#ffffff',
              textShadow: '0 0 40px rgba(255,255,255,0.10), 0 0 80px rgba(255,255,255,0.05)',
            }}
          >
            | Т Р Е Т Ь Я К О В |
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto mt-6 md:mt-8 select-none"
            style={{ color: '#ffffff' }}
          >
            Браслеты — это больше, чем просто аксессуары. Это хронология твоего жизненного пути.
            Коллекция личных символов, воспоминаний и образов. Мы решили сделать эти образы
            современными, стильными и смелыми.
          </p>
        </div>
      </div>

      {/* Features section */}
      <div className="relative z-10 bg-[var(--raw-paper)] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="divider-thick mb-12" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-8 text-[var(--ink)] text-center">
            Почему выбирают нас
          </h2>

          <p
            ref={descRef}
            className="text-[var(--ash)] mb-12 max-w-2xl mx-auto text-center"
          >
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
