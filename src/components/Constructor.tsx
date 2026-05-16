'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Stone } from '@/lib/types';

const MAX_STONES = 12;
const MIN_STONES = 3;

interface ConstructorProps {
  stones: Stone[];
}

export default function Constructor({ stones }: ConstructorProps) {
  const [selectedStones, setSelectedStones] = useState<Stone[]>([]);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const braceletRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP scroll animations
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const ctx = gsap.context(() => {
        // Bracelet area slide in
        if (braceletRef.current) {
          gsap.fromTo(braceletRef.current,
            { y: -30, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'top 40%',
                toggleActions: 'play none none reverse',
              }
            }
          );
        }

        // Grid items stagger
        if (gridRef.current) {
          const items = gridRef.current.querySelectorAll('.stone-btn');
          gsap.fromTo(items,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 85%',
                end: 'top 30%',
                toggleActions: 'play none none reverse',
              }
            }
          );
        }
      }, containerRef);

      return () => {
        cancelled = true;
        ctx.revert();
      };
    })();
  }, []);

  const addStone = useCallback((stone: Stone) => {
    setSelectedStones(prev => {
      if (prev.length >= MAX_STONES) return prev;
      return [...prev, stone];
    });
  }, []);

  const removeBead = useCallback((index: number) => {
    setSelectedStones(prev => prev.filter((_, i) => i !== index));
  }, []);

  const removeLastStone = useCallback(() => {
    setSelectedStones(prev => prev.slice(0, -1));
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedStones.length >= MIN_STONES) {
      setShowModal(true);
    }
  }, [selectedStones]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const stoneImageUrl = (stone: Stone): string => {
    return stone.image_url || '';
  };

  return (
    <section
      id="constructor"
      ref={containerRef}
      className="py-24 px-6 bg-[var(--white)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <p className="system-label mb-4 text-center">КОНСТРУКТОР</p>
        <h2 className="font-display text-4xl md:text-5xl font-semibold mb-3 text-[var(--ink)] text-center">
          Собери свой браслет
        </h2>
        <p className="text-[var(--ash)] mb-10 max-w-xl mx-auto text-center text-sm">
          Выбирай натуральные камни и собирай уникальную композицию.
          Минимум {MIN_STONES} камня, максимум {MAX_STONES}.
        </p>

        {/* === Bracelet Preview Area (Round) === */}
        <div
          ref={braceletRef}
          className="mb-12 p-6 bg-[var(--white)] border border-[var(--ink)] min-h-[280px] md:min-h-[320px] relative overflow-hidden"
        >
          {/* Circular bracelet SVG */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full max-w-[260px] max-h-[260px] md:max-w-[300px] md:max-h-[300px]" viewBox="0 0 300 300" fill="none">
              {/* Тень шнура (для объёма) */}
              <circle cx="150" cy="150" r="120" stroke="#E0DCD4" strokeWidth="6" opacity="0.4" />
              {/* Основной белый шнур */}
              <circle cx="150" cy="150" r="120" stroke="#FFFFFF" strokeWidth="4" />
            </svg>
          </div>

          {/* Stone beads arranged in a circle */}
          {selectedStones.length > 0 && (
            <div className="relative z-10 mx-auto w-full max-w-[260px] md:max-w-[300px] aspect-square">
              {selectedStones.map((stone, i) => {
                const imgUrl = stoneImageUrl(stone);
                const total = selectedStones.length;
                // Position around a circle (starting from top, going clockwise)
                const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
                const radius = 40; // процент — ровно на линии шнура (80% от центра)
                const left = 50 + radius * Math.cos(angle);
                const top = 50 + radius * Math.sin(angle);

                return (
                  <button
                    key={`${stone.id}-${i}`}
                    onClick={() => removeBead(i)}
                    className="group absolute transition-all duration-300 ease-in-out hover:scale-125"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`Убрать ${stone.name_ru}`}
                  >
                    {/* Stone bead */}
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 ${stone.name_ru === 'Гематит' ? '' : 'rounded-full'} overflow-hidden shadow-md transition-shadow group-hover:shadow-lg group-hover:shadow-[var(--ink)]/30`}
                      style={stone.name_ru === 'Гематит' ? { clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' } : undefined}
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={stone.name_ru}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-[var(--ash)] flex items-center justify-center text-[10px] text-white font-mono">
                          {stone.name_ru.slice(0, 2)}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-[var(--ink)] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap block text-center">
                      × {stone.name_ru}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {selectedStones.length === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[var(--ash)] font-mono text-xs">
                  Нажми на камень,<br />чтобы добавить его в браслет
                </p>
              </div>
            </div>
          )}

          {/* Selected count badge */}
          {selectedStones.length > 0 && (
            <div className="absolute top-3 right-3 z-10 bg-[var(--ink)] text-[var(--white)] text-[10px] font-mono px-2 py-1 rounded-sm">
              {selectedStones.length}/{MAX_STONES}
            </div>
          )}
        </div>

        {/* === Controls === */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={removeLastStone}
            disabled={selectedStones.length === 0}
            className={`btn-secondary text-xs px-4 py-2 ${
              selectedStones.length === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            ← Убрать последний
          </button>

          <button
            onClick={handleSubmit}
            disabled={selectedStones.length < MIN_STONES}
            className={`btn-primary text-xs px-6 py-2 ${
              selectedStones.length < MIN_STONES ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            Сформировать браслет
          </button>

          <button
            onClick={() => setSelectedStones([])}
            disabled={selectedStones.length === 0}
            className={`btn-secondary text-xs px-4 py-2 ${
              selectedStones.length === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            Очистить всё
          </button>
        </div>

        {/* === Stones Grid === */}
        <div
          ref={gridRef}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3"
        >
          {stones.map((stone) => {
            const count = selectedStones.filter(s => s.id === stone.id).length;
            const isMaxed = selectedStones.length >= MAX_STONES;

            return (
              <button
                key={stone.id}
                onClick={() => addStone(stone)}
                disabled={isMaxed}
                className={`stone-btn group flex flex-col items-center p-3 border transition-all duration-200 ${
                  isMaxed
                    ? 'bg-[var(--raw-paper)] text-[var(--ash)] border-[var(--ash)] opacity-40 cursor-not-allowed'
                    : 'bg-[var(--white)] text-[var(--ink)] border-[var(--ink)] hover:bg-[var(--raw-paper)] cursor-pointer'
                }`}
              >
                {/* Stone thumbnail */}
                <div
                  className={`relative w-14 h-14 md:w-16 md:h-16 ${stone.name_ru === 'Гематит' ? '' : 'rounded-full'} overflow-hidden mb-2`}
                  style={stone.name_ru === 'Гематит' ? { clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' } : undefined}
                >
                  {stoneImageUrl(stone) ? (
                    <img
                      src={stoneImageUrl(stone)}
                      alt={stone.name_ru}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-[var(--ash)] flex items-center justify-center text-white font-mono text-xs">
                      {stone.name_ru.slice(0, 2)}
                    </div>
                  )}
                  {/* Count badge */}
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[var(--ink)] text-[var(--white)] text-[9px] font-mono w-5 h-5 rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>

                {/* Stone name */}
                <span className="font-mono text-[10px] leading-tight text-center text-[var(--ink)]">
                  {stone.name_ru}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* === Modal === */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[var(--white)] max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close X */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-2xl text-[var(--ash)] hover:text-[var(--ink)] transition-colors leading-none"
            >
              ×
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <p className="system-label mb-2">ГОТОВО</p>
              <h3 className="font-display text-3xl font-semibold text-[var(--ink)] mb-2">
                Ваш уникальный браслет собран!
              </h3>
            </div>

            {/* Screenshot instruction */}
            <div className="bg-[var(--raw-paper)] p-5 mb-6 text-center">
              <p className="font-mono text-sm text-[var(--ink)] mb-2">
                📱 Сделайте скриншот экрана
              </p>
              <p className="text-xs text-[var(--ash)]">
                Отправьте его нам в Telegram вместе с вашими пожеланиями — мы свяжемся с вами для уточнения размера и деталей.
              </p>
            </div>

            {/* Bracelet preview in modal */}
            <div className="mb-6 bg-[var(--white)] border border-[var(--ink)] p-6">
              <div className="relative mx-auto w-full max-w-[200px] aspect-square">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" fill="none">
                  <circle cx="150" cy="150" r="120" stroke="#E0DCD4" strokeWidth="6" opacity="0.4" />
                  <circle cx="150" cy="150" r="120" stroke="#FFFFFF" strokeWidth="4" />
                </svg>
                {selectedStones.map((stone, i) => {
                  const total = selectedStones.length;
                  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
                  const radius = 40;
                  const left = 50 + radius * Math.cos(angle);
                  const top = 50 + radius * Math.sin(angle);
                  return (
                    <div
                      key={`${stone.id}-${i}`}
                      className="absolute"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div
                        className={`w-9 h-9 ${stone.name_ru === 'Гематит' ? '' : 'rounded-full'} overflow-hidden shadow-md border border-[var(--white)]`}
                        style={stone.name_ru === 'Гематит' ? { clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' } : undefined}
                      >
                        <img
                          src={stoneImageUrl(stone)}
                          alt={stone.name_ru}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected stones list */}
            <div className="mb-6">
              <p className="system-label mb-3">ВЫБРАННЫЕ КАМНИ</p>
              <div className="space-y-4">
                {selectedStones.map((stone, i) => (
                  <div key={`${stone.id}-${i}`} className="border border-[var(--ink)] p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono text-[var(--ash)]">
                        {i + 1}.
                      </span>
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--ink)] flex-shrink-0">
                        {stoneImageUrl(stone) ? (
                          <img
                            src={stoneImageUrl(stone)}
                            alt={stone.name_ru}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--ash)]" />
                        )}
                      </div>
                      <div>
                        <p className="font-display text-base font-semibold text-[var(--ink)]">
                          {stone.name_ru}
                        </p>
                        <p className="text-[10px] text-[var(--ash)] font-mono">
                          {stone.name_en}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--ink)] leading-relaxed ml-11">
                      {stone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <a
                href="https://t.me/tretyakov_braslet"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full block text-center"
              >
                ✏️ Написать в Telegram
              </a>
              <button
                onClick={handleCloseModal}
                className="btn-secondary w-full"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
