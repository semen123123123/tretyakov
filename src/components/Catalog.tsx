'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

gsap.registerPlugin(ScrollTrigger);

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const ctx = gsap.context(() => {
        const cards = gridRef.current?.children;
        if (cards) {
          gsap.fromTo(cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
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
  }, [loading, products]);

  const getProductImage = (product: Product): string => {
    // Try local file first, fallback to Unsplash
    return `https://source.unsplash.com/featured/400x400?bracelet,jewelry,${product.slug}`;
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, [], false);
    alert(`${product.name} добавлен в корзину!`);
  };

  return (
    <section 
      id="catalog"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--raw-paper)]"
    >
      <div className="max-w-6xl mx-auto">
        
        <p className="system-label mb-4">КОЛЛЕКЦИЯ</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 text-[var(--ink)]">
          Браслеты
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[var(--ash)]">Загрузка...</p>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product) => (
              <div key={product.id} className="card group">
                <div className="card-image bg-[var(--white)] relative overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/F5F0E8/A8A49C?text=${product.name}`;
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-mono text-sm text-[var(--ink)] uppercase tracking-wide mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[var(--ash)] mb-3">
                    {product.stone_composition}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-semibold text-[var(--ink)]">
                      {product.price} ₽
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </section>
  );
}