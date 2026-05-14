'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';
import { useToast } from '@/lib/toast';

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm py-8 px-4" onClick={onClose}>
      <div 
        className="relative bg-[var(--white)] max-w-2xl w-full mx-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[var(--white)] hover:bg-[var(--raw-paper)] transition-colors text-xl"
        >
          ×
        </button>

        {/* Image */}
        <div className="aspect-square bg-[var(--raw-paper)]">
          <img
            src={product.image_url || ''}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title & price */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="system-label mb-1">БРАСЛЕТ</p>
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-[var(--ink)]">
                {product.name}
              </h3>
            </div>
            <span className="font-display text-2xl font-semibold text-[var(--ink)] whitespace-nowrap">
              {product.price} ₽
            </span>
          </div>

          <div className="divider" />

          {/* Composition */}
          <div>
            <p className="system-label mb-2">СОСТАВ КАМНЕЙ</p>
            <p className="text-[var(--ink)]">{product.stone_composition}</p>
          </div>

          {/* Description */}
          <div>
            <p className="system-label mb-2">ОПИСАНИЕ</p>
            <p className="text-[var(--ink)] leading-relaxed">{product.description}</p>
          </div>

          {/* Stone details */}
          {product.stone_details && (
            <div>
              <p className="system-label mb-2">О КАМНЯХ</p>
              <p className="text-[var(--ink)] leading-relaxed">{product.stone_details}</p>
            </div>
          )}

          {/* Historical fact */}
          {product.historical_fact && (
            <div className="bg-[var(--raw-paper)] p-4">
              <p className="system-label mb-2">ИСТОРИЧЕСКАЯ СПРАВКА</p>
              <p className="text-[var(--ink)] text-sm leading-relaxed italic">{product.historical_fact}</p>
            </div>
          )}

          {/* Advantages */}
          {product.advantages && (
            <div>
              <p className="system-label mb-2">ПРЕИМУЩЕСТВА</p>
              <ul className="space-y-1.5">
                {product.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--ink)]">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--ink)] shrink-0" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={() => {
              addItem(product, [], false);
              showToast(`${product.name} добавлен в корзину!`);
              onClose();
            }}
            className={`w-full btn-primary py-4 text-sm ${!product.in_stock ? 'opacity-30 cursor-not-allowed' : ''}`}
            disabled={!product.in_stock}
          >
            {product.in_stock ? `ДОБАВИТЬ В КОРЗИНУ — ${product.price} ₽` : 'НЕТ В НАЛИЧИИ'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CatalogClient({ products }: { products: Product[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const animStarted = useRef(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  // GSAP scroll animation — loaded dynamically
  useEffect(() => {
    if (animStarted.current || products.length === 0) return;
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

      // Animate product cards
      const cards = gridRef.current?.children;
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 82%',
          },
        }
      );
    })();

    return () => { cancelled = true; };
  }, [products]);

  // Escape key closes modal
  useEffect(() => {
    if (!selectedProduct) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedProduct]);

  // Listen for custom event from StonesClient to open a product modal
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.productId) {
        const product = products.find(p => p.id === detail.productId);
        if (product) setSelectedProduct(product);
      }
    };
    window.addEventListener('open-product', handler);
    return () => window.removeEventListener('open-product', handler);
  }, [products]);

  const handleAddToCart = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, [], false);
    showToast(`${product.name} добавлен в корзину!`);
  }, [addItem, showToast]);

  return (
    <>
      <section 
        id="catalog" 
        ref={sectionRef}
        className="py-24 px-6 bg-[var(--raw-paper)]"
      >
        <div className="max-w-6xl mx-auto">
          <div ref={headingRef}>
            <p className="system-label mb-4">КОЛЛЕКЦИЯ</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-4 text-[var(--ink)]">
              Браслеты
            </h2>
          </div>
          <p className="text-[var(--ash)] mb-12 max-w-xl">
            {products.length} моделей — каждая собрана вручную из премиального гематита и природных камней
          </p>

          <div 
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="card group cursor-pointer bg-[var(--raw-paper)]"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="card-image bg-[var(--white)] relative overflow-hidden aspect-square">
                  <img
                    src={product.image_url || ''}
                    alt={product.name}
                    loading="lazy"
                    className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${!product.in_stock ? 'opacity-40' : ''}`}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-[var(--ink)] text-[var(--white)] px-3 py-1 text-xs font-mono tracking-wide uppercase">
                        Нет в наличии
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                      {product.name}
                    </h3>
                    <span className="font-mono text-sm text-[var(--ink)] whitespace-nowrap">
                      {product.price} ₽
                    </span>
                  </div>

                  <p className="text-xs text-[var(--ash)] leading-relaxed">
                    {product.stone_composition}
                  </p>

                  <p className="text-sm text-[var(--ash)] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={!product.in_stock}
                    className={`w-full btn-primary text-xs py-2.5 mt-2 ${!product.in_stock ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    {product.in_stock ? 'В корзину' : 'Нет в наличии'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detail modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
}
