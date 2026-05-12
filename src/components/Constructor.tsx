'use client';

import { useState, useEffect, useRef } from 'react';
import { Stone } from '@/lib/types';
import { useCart } from '@/lib/cart';

const AVAILABLE_STONES = [
  'Гематит', 'Амазонит', 'Лазурит', 'Сердолик', 'Цитрин', 'Аметист'
];

const BASE_PRICE = 2500;
const STONE_PRICE = 250;

interface ConstructorProps {
  stones: Stone[];
}

export default function Constructor({ stones }: ConstructorProps) {
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const ctx = gsap.context(() => {
        // Image slides in from left
        gsap.fromTo(imageRef.current,
          { x: '-100%', opacity: 0 },
          {
            x: '0%',
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            }
          }
        );

        // Content slides in from right
        gsap.fromTo(contentRef.current,
          { x: '15%', opacity: 0 },
          {
            x: '0%',
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }, containerRef);

      (window as any).__gsapConstructorCtx = ctx;
    })();

    return () => {
      cancelled = true;
      const ctx = (window as any).__gsapConstructorCtx;
      if (ctx) ctx.revert();
      delete (window as any).__gsapConstructorCtx;
    };
  }, []);

  const toggleStone = (stoneName: string) => {
    if (selectedStones.includes(stoneName)) {
      setSelectedStones(prev => prev.filter(s => s !== stoneName));
    } else if (selectedStones.length < 2) {
      setSelectedStones(prev => [...prev, stoneName]);
    }
  };

  const totalPrice = BASE_PRICE + (selectedStones.length * STONE_PRICE);

  const handleAddToCart = () => {
    const selectedStoneObjects = stones.filter(s => selectedStones.includes(s.name_ru));
    
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: 'Кастомный браслет',
      slug: 'custom-bracelet',
      description: `Браслет с камнями: ${selectedStones.join(', ')}`,
      stone_composition: selectedStones.join(', '),
      price: totalPrice,
      image_url: null,
      is_custom: true,
      is_published: true,
      sort_order: 0,
    } as any;
    
    addItem(customProduct, selectedStoneObjects, true);
    setSelectedStones([]);
    alert('Браслет добавлен в корзину!');
  };

  return (
    <section 
      id="constructor"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--white)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <p className="system-label mb-4 text-center">КОНСТРУКТОР</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 text-[var(--ink)] text-center">
          Создай свой браслет
        </h2>
        
        <p className="text-[var(--ash)] mb-12 max-w-2xl mx-auto text-center">
          Собери уникальный браслет из натуральных камней. Выбери до 2 камней в дополнение к основе из гематита.
        </p>
        
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Image - left side */}
          <div ref={imageRef} className="w-full h-full flex">
            <div className="relative w-full h-full overflow-hidden rounded-sm shadow-sm shadow-black/20">
              <img
                src="/sbroka.jpg"
                alt="Браслет"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content - right side */}
          <div ref={contentRef}>
            <div className="bg-[var(--raw-paper)] p-6 mb-6">
              <div className="text-center mb-4">
                <p className="system-label mb-1">ОСНОВА</p>
                <p className="font-mono text-lg text-[var(--ink)]">Гематит</p>
                
                {selectedStones.length > 0 && (
                  <>
                    <div className="divider my-3 mx-auto max-w-[60px]" />
                    <p className="system-label mb-2">ДОБАВЛЕННЫЕ КАМНИ</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {selectedStones.map((stone, i) => (
                        <span key={i} className="font-mono text-sm text-[var(--ink)]">
                          + {stone}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <p className="system-label mb-4">ВЫБЕРИ КАМНИ (до 2)</p>
            
            <div className="space-y-2">
                {stones.map((stone) => {
                  const isSelected = selectedStones.includes(stone.name_ru);
                  const isDisabled = !isSelected && selectedStones.length >= 2;
                  
                  return (
                    <button
                      key={stone.id}
                      onClick={() => toggleStone(stone.name_ru)}
                      disabled={isDisabled}
                      className={`w-full p-4 flex items-center justify-between border transition-all ${
                        isSelected 
                          ? 'bg-[var(--ink)] text-[var(--white)] border-[var(--ink)]' 
                          : isDisabled
                            ? 'bg-[var(--raw-paper)] text-[var(--ash)] border-[var(--ash)] opacity-50 cursor-not-allowed'
                            : 'bg-[var(--white)] text-[var(--ink)] border-[var(--ink)] hover:bg-[var(--raw-paper)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border ${isSelected ? 'bg-[var(--white)]' : 'border-current'}`}>
                          {isSelected && <div className="w-full h-full bg-[var(--ink)]" />}
                        </div>
                        <span className="font-mono text-sm uppercase">{stone.name_ru}</span>
                      </div>
                      <span className={`font-mono text-sm ${isSelected ? 'text-[var(--white)]' : 'text-[var(--ash)]'}`}>
                        +{STONE_PRICE} ₽
                      </span>
                    </button>
                  );
                })}
              </div>

            {/* Price & Add to Cart */}
            <div className="mt-6 p-6 bg-[var(--raw-paper)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[var(--ash)]">Стоимость:</span>
                <span className="font-display text-3xl font-semibold text-[var(--ink)]">
                  {totalPrice} ₽
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={selectedStones.length === 0}
                className={`w-full btn-primary ${selectedStones.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
