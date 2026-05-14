'use client';

import { useState } from 'react';

const navLinks = [
  { label: 'Камни', href: '#stones' },
  { label: 'Конструктор', href: '#constructor' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#footer' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--white)]/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-4" onClick={handleNavClick}>
          <img
            src="/logo.jpg"
            alt="ТРЕТЬЯКОВ"
            className="h-16 w-auto object-contain"
          />
          <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--ink)] hidden sm:inline">
            ТРЕТЬЯКОВ
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-[var(--ink)] hover:text-[var(--ash)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Меню"
        >
          <span className={`block w-6 h-px bg-[var(--ink)] transition-transform ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`block w-6 h-px bg-[var(--ink)] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-[var(--ink)] transition-transform ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--white)] border-t border-[var(--ash)]/20">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="font-mono text-sm tracking-[0.15em] uppercase text-[var(--ink)] hover:text-[var(--ash)] transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
