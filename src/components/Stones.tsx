'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/lib/supabase';
import { Stone } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

interface StoneModalProps {
  stone: Stone;
  onClose: () => void;
}

function StoneModal({ stone, onClose }: StoneModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-[var(--ash)] hover:text-[var(--ink)]"
        >
          ×
        </button>
        
        <div className="space-y-6">
          <div>
            <p className="system-label mb-2">{stone.color}</p>
            <h3 className="font-display text-3xl font-semibold text-[var(--ink)]">
              {stone.name_ru}
            </h3>
            <p className="text-[var(--ash)] mt-2">{stone.name_en}</p>
          </div>
          
          <div className="divider" />
          
          <div>
            <p className="system-label mb-2">ОПИСАНИЕ</p>
            <p className="text-[var(--ink)] leading-relaxed">{stone.description}</p>
          </div>
          
          <div>
            <p className="system-label mb-2">ИСТОРИЯ</p>
            <p className="text-[var(--ink)] leading-relaxed">{stone.history_facts}</p>
          </div>
          
          {stone.additional_fact && (
            <div>
              <p className="system-label mb-2">ИНТЕРЕСНЫЙ ФАКТ</p>
              <p className="text-[var(--ink)] leading-relaxed italic">{stone.additional_fact}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Stones() {
  const [stones, setStones] = useState<Stone[]>([]);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStones() {
      const { data, error } = await supabase
        .from('stones')
        .select('*')
        .order('sort_order');
      
      if (!error && data) {
        setStones(data);
      }
      setLoading(false);
    }
    fetchStones();
  }, []);

  useEffect(() => {
    if (!loading && stones.length > 0) {
      const ctx = gsap.context(() => {
        const cards = gridRef.current?.children;
        if (cards) {
          gsap.fromTo(cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
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
  }, [loading, stones]);

  const getStoneImage = (stone: Stone): string => {
    // Try local file first
    const localPath = `/stones/${stone.name_en?.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    // For now, return Unsplash placeholder
    return `https://source.unsplash.com/featured/400x400?stone,mineral,${stone.name_en?.toLowerCase()}`;
  };

  if (loading) {
    return (
      <section id="stones" className="py-24 px-6 bg-[var(--raw-paper)]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[var(--ash)]">Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="stones"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--raw-paper)]"
    >
      <div className="max-w-6xl mx-auto">
        
        <p className="system-label mb-4">КОЛЛЕКЦИЯ</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 text-[var(--ink)]">
          Натуральные камни
        </h2>
        
        <div 
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {stones.map((stone) => (
            <div
              key={stone.id}
              className="card cursor-pointer group"
              onClick={() => setSelectedStone(stone)}
            >
              <div className="card-image bg-[var(--raw-paper)] relative overflow-hidden">
                <img
                  src={getStoneImage(stone)}
                  alt={stone.name_ru}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/F5F0E8/A8A49C?text=${stone.name_en}`;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-mono text-sm text-[var(--ink)] uppercase tracking-wide mb-1">
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
          onClose={() => setSelectedStone(null)} 
        />
      )}
    </section>
  );
}