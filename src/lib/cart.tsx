'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Stone } from './types';

export interface CartItem {
  id: string;
  product: Product | null;
  stones: Stone[];
  quantity: number;
  isCustom: boolean;
  basePrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, stones?: Stone[], isCustom?: boolean) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tretyakov-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tretyakov-cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addItem = (product: Product, stones: Stone[] = [], isCustom = false) => {
    const basePrice = product.price + (stones.length > 0 ? stones.length * 250 : 0);
    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      stones,
      quantity: 1,
      isCustom,
      basePrice,
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}