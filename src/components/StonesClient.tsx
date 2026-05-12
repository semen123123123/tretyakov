'use client';

import { useState, useRef } from 'react';
import { Stone } from '@/lib/types';

interface StoneModalProps {
  stone: Stone;
  onClose: () => void;
}

function StoneModal({ stone, onClose }: StoneModalProps) {
  return (
    <div className="modal-backdrop z-50" onClick={onClose}>
      <div 
        className="modal-content max-w-lg mx-4 relative"
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

interface StonesClientProps {
  stones: Stone[];
}

export default function StonesClient({ stones }: StonesClientProps) {
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const getStoneImage = (stone: Stone): string => {
    // Real mineral photos from Pexels matching each stone
    const images: Record<string, string> = {
      'Гематит': 'https://images.pexels.com/photos/4040640/pexels-photo-4040640.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'Амазонит': 'https://images.pexels.com/photos/3725730/pexels-photo-3725730.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'Лазурит': 'https://images.pexels.com/photos/4040599/pexels-photo-4040599.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'Сердолик': 'https://images.pexels.com/photos/5442451/pexels-photo-5442451.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'Цитрин': 'https://images.pexels.com/photos/15803904/pexels-photo-15803904.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      'Аметист': 'https://images.pexels.com/photos/13307186/pexels-photo-13307186.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
    };
    return images[stone.name_ru] || 'https://images.pexels.com/photos/4040640/pexels-photo-4040640.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';
  };

  return (
    <section id="stones" className="py-24 px-6 bg-[var(--raw-paper)]">
      <div className="max-w-6xl mx-auto">
        
        <p className="system-label mb-4">КОЛЛЕКЦИЯ</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-12 text-[var(--ink)]">
          Натуральные камни
        </h2>
        
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
              <div className="card-image bg-[var(--raw-paper)] relative overflow-hidden aspect-square">
                <img
                  src={getStoneImage(stone)}
                  alt={stone.name_ru}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3 md:p-4">
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
          onClose={() => setSelectedStone(null)} 
        />
      )}
    </section>
  );
}