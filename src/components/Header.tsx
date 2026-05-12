'use client';

const navLinks = [
  { label: 'Камни', href: '#stones' },
  { label: 'Конструктор', href: '#constructor' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#footer' },
];

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--white)]/90 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="ТРЕТЬЯКОВ"
            className="h-16 w-auto object-contain"
          />
          <span className="font-mono text-sm tracking-[0.2em] uppercase text-[var(--ink)] hidden sm:inline">
            ТРЕТЬЯКОВ
          </span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
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
      </div>
    </header>
  );
}
