'use client';

import { useState } from 'react';

export default function Footer() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <footer id="footer" className="bg-[var(--ink)] text-[var(--white)] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo */}
          <div>
            <img
              src="/logo.jpg"
              alt="ТРЕТЬЯКОВ"
              className="h-20 mb-4 w-auto object-contain"
            />
            <p className="text-[var(--ash)] text-sm">
              Браслеты из натуральных камней
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <p className="system-label text-[var(--ash)] mb-4">НАВИГАЦИЯ</p>
            <ul className="space-y-2">
              <li><a href="#hero" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors">Главная</a></li>
              <li><a href="#history" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors">История</a></li>
              <li><a href="#stones" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors">Камни</a></li>
              <li><a href="#constructor" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors">Конструктор</a></li>
              <li><a href="#catalog" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors">Каталог</a></li>
              <li><a href="#reviews" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors">Отзывы</a></li>
            </ul>
          </div>
          
          {/* Contacts */}
          <div>
            <p className="system-label text-[var(--ash)] mb-4">КОНТАКТЫ</p>
            <ul className="space-y-2">
              <li className="text-[var(--white)]">8 (989) 577-65-12</li>
              <li className="text-[var(--white)]">Zubkovw@gmail.com</li>
              <li className="text-[var(--ash)] text-sm mt-4">
                Москва, Россия
              </li>
            </ul>
          </div>
          
          {/* Info */}
          <div>
            <p className="system-label text-[var(--ash)] mb-4">ИНФОРМАЦИЯ</p>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="text-[var(--ash)] text-xs tracking-wide">ДОСТАВКА</span>
                <p className="text-[var(--white)] mt-0.5">По всей России, от 2 до 7 дней</p>
              </li>
              <li>
                <span className="text-[var(--ash)] text-xs tracking-wide">ОПЛАТА</span>
                <p className="text-[var(--white)] mt-0.5">Наличные или перевод на карту</p>
              </li>
              <li>
                <span className="text-[var(--ash)] text-xs tracking-wide">ВОЗВРАТ</span>
                <p className="text-[var(--white)] mt-0.5">В течение 14 дней, без вопросов</p>
              </li>
              <li className="pt-2 flex gap-3">
                <a href="https://t.me/tretyakov_heritage" target="_blank" rel="noopener noreferrer" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors" title="Telegram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="https://www.avito.ru/brands/73ec706323e74f732822382049cd02e0/all?sellerId=0b0c8ecd0e1307d79be53fc305f2abb0" target="_blank" rel="noopener noreferrer" className="text-[var(--white)] hover:text-[var(--ash)] transition-colors font-mono tracking-widest text-xs" title="Avito">
                  AVITO
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="divider border-[var(--ash)] mt-12 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--ash)] text-sm">
            © 2025 ТРЕТЬЯКОВ. Все права защищены.
          </p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-[var(--ash)] text-sm hover:text-[var(--white)] transition-colors">
              Политика конфиденциальности
            </a>
            <a href="/terms" className="text-[var(--ash)] text-sm hover:text-[var(--white)] transition-colors">
              Пользовательское соглашение
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}