'use client';

import { useState, useRef, useEffect } from 'react';
import { Stone, Product } from '@/lib/types';
import { getProductSlugsForStone } from '@/lib/stone-product-links';

interface StoneModalProps {
  stone: Stone;
  products: Product[];
  onClose: () => void;
  onProductClick: (product: Product) => void;
}

function StoneModal({ stone, products, onClose, onProductClick }: StoneModalProps) {
  const linkedSlugs = getProductSlugsForStone(stone.name_ru);
  const linkedProducts = products.filter(p => linkedSlugs.includes(p.slug));

  return (
    <div className="modal-backdrop z-50" onClick={onClose}>
      <div 
        className="modal-content max-w-2xl mx-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-2xl text-[var(--ash)] hover:text-[var(--ink)] hover:bg-[var(--raw-paper)] transition-colors"
        >
          ×
        </button>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-6">
            {stone.image_url && (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 bg-[var(--raw-paper)]">
                <img
                  src={stone.image_url}
                  alt={stone.name_ru}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="system-label mb-1">{stone.color}</p>
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-[var(--ink)]">
                {stone.name_ru}
              </h3>
              <p className="text-[var(--ash)] mt-1">{stone.name_en}</p>
            </div>
          </div>

          <div className="divider" />

          {/* Description */}
          <div>
            <p className="system-label mb-2">ОПИСАНИЕ</p>
            <p className="text-[var(--ink)] leading-relaxed">{stone.description}</p>
          </div>

          {/* History with photo */}
          <div>
            <p className="system-label mb-3">ИСТОРИЯ КАМНЯ</p>
            
            {stone.history_image && (
              <div className="mb-4 rounded-sm overflow-hidden bg-[var(--raw-paper)]">
                <img
                  src={stone.history_image}
                  alt={`История ${stone.name_ru}`}
                  className="w-full h-48 md:h-64 object-cover"
                />
              </div>
            )}
            
            <p className="text-[var(--ink)] leading-relaxed">{stone.history_facts}</p>
          </div>

          {stone.additional_fact && (
            <div>
              <p className="system-label mb-2">ИНТЕРЕСНЫЙ ФАКТ</p>
              <p className="text-[var(--ink)] leading-relaxed italic">{stone.additional_fact}</p>
            </div>
          )}

          {/* Linked bracelet products */}
          {linkedProducts.length > 0 && (
            <div>
              <p className="system-label mb-3">БРАСЛЕТЫ ИЗ ЭТОГО КАМНЯ</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedProducts.slice(0, 4).map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onClose();
                      setTimeout(() => onProductClick(product), 100);
                    }}
                    className="group flex items-center gap-3 p-3 border border-[var(--ash)] hover:border-[var(--ink)] transition-colors text-left"
                  >
                    {product.image_url && (
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[var(--raw-paper)]">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-mono text-xs uppercase tracking-wide text-[var(--ink)] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[var(--ash)]">{product.price} ₽</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StonesClientProps {
  stones: Stone[];
  products?: Product[];
}

export default function StonesClient({ stones, products = [] }: StonesClientProps) {
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const animStarted = useRef(false);

  // GSAP scroll animation
  useEffect(() => {
    if (animStarted.current || stones.length === 0) return;
    animStarted.current = true;

    let cancelled = false;
    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      // Animate heading
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
          }
        );
      }

      // Animate cards
      const cards = gridRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out',
            scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
          }
        );
      }
    })();

    return () => { cancelled = true; };
  }, [stones]);

  const getStoneImage = (stone: Stone): string => {
    return stone.image_url || '';
  };

  const handleProductClick = (product: Product) => {
    setTargetProduct(product);
  };

  // When targetProduct is set, scroll to catalog and open its modal
  useEffect(() => {
    if (!targetProduct) return;
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Dispatch custom event for CatalogClient to open the product modal
    const event = new CustomEvent('open-product', { detail: { productId: targetProduct.id } });
    window.dispatchEvent(event);
    setTargetProduct(null);
  }, [targetProduct]);

  return (
    <section id="stones" ref={sectionRef} className="py-24 px-6 bg-[var(--raw-paper)]">
      <div className="max-w-6xl mx-auto">
        
        <div ref={headingRef}>
          <p className="system-label mb-4">КОЛЛЕКЦИЯ</p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 text-[var(--ink)]">
            Камни с историей
          </h2>
        </div>
        
        <div 
          ref={gridRef}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {stones.map((stone) => (
            <div
              key={stone.id}
              className="card cursor-pointer group w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] max-w-[300px]"
              onClick={() => setSelectedStone(stone)}
            >
              <div className="p-6 md:p-8 flex items-center justify-center">
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 ${stone.name_ru === 'Гематит' ? '' : 'rounded-full'} overflow-hidden bg-[var(--raw-paper)] ring-1 ring-[var(--ink)]/10 transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-[var(--ink)]/20`}
                  style={stone.name_ru === 'Гематит' ? { clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' } : undefined}
                >
                  <img
                    src={getStoneImage(stone)}
                    alt={stone.name_ru}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
              <div className="divider" />
              <div className="p-3 md:p-4 text-center">
                <h3 className="font-mono text-xs md:text-sm text-[var(--ink)] uppercase tracking-wide mb-1">
                  {stone.name_ru}
                </h3>
                <p className="text-xs text-[var(--ash)]">{stone.color}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedStone && (
        <StoneModal 
          stone={selectedStone}
          products={products}
          onClose={() => setSelectedStone(null)}
          onProductClick={handleProductClick}
        />
      )}
    </section>
  );
}
