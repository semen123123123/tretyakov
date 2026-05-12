'use client';

import { useRef } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart';

export default function CatalogClient({ products }: { products: Product[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const getProductImage = (product: Product): string => {
    return `https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop&q=80`;
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, [], false);
    alert(`${product.name} добавлен в корзину!`);
  };

  return (
    <section id="catalog" className="py-24 px-6 bg-[var(--raw-paper)]">
      <div className="max-w-6xl mx-auto">
        
        <p className="system-label mb-4">КОЛЛЕКЦИЯ</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 text-[var(--ink)]">
          Браслеты
        </h2>
        
        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {products.map((product) => (
            <div key={product.id} className="card group">
              <div className="card-image bg-[var(--white)] relative overflow-hidden aspect-square">
                <img
                  src={getProductImage(product)}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
      </div>
    </section>
  );
}