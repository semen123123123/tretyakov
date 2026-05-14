'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[var(--ink)] text-[var(--white)] px-6 py-4 font-mono text-sm uppercase tracking-wide z-40 hover:bg-[var(--ash)] transition-colors shadow-lg"
      >
        Корзина ({itemCount})
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="modal-backdrop z-50" onClick={() => setIsOpen(false)}>
          <div 
            className="modal-content max-w-lg w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">
                Корзина
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-2xl text-[var(--ash)] hover:text-[var(--ink)]"
              >
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-[var(--ash)] text-center py-8">Корзина пуста</p>
            ) : (
              <>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-4 bg-[var(--raw-paper)]">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-sm text-[var(--ink)] uppercase">
                          {item.product?.name || 'Кастомный браслет'}
                        </p>
                        {item.stones.length > 0 && (
                          <p className="text-xs text-[var(--ash)] mt-1">
                            Камни: {item.stones.map(s => s.name_ru).join(', ')}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}
                            className="text-xs text-[var(--ash)] hover:text-[var(--ink)] transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}
                            className="text-xs text-[var(--ash)] hover:text-[var(--ink)] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="font-display text-lg text-[var(--ink)]">
                          {item.basePrice} ₽
                        </p>
                        <p className="text-[10px] text-[var(--ash)]">{item.quantity} × {item.basePrice / item.quantity} ₽</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-[var(--ash)] hover:text-[var(--ink)] mt-1 underline"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="divider my-6" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-[var(--ash)]">Итого:</span>
                  <span className="font-display text-2xl font-semibold text-[var(--ink)]">
                    {total} ₽
                  </span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => { clearCart(); setIsOpen(false); }}
                    className="btn-secondary flex-1"
                  >
                    Очистить
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="btn-primary flex-1"
                  >
                    Оформить
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          onClose={() => setIsCheckoutOpen(false)} 
          items={items}
          total={total}
        />
      )}
    </>
  );
}

function CheckoutModal({ onClose, items, total }: { onClose: () => void; items: any[]; total: number }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      setEmailError('Введите корректный email');
      return;
    }
    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          delivery_address: form.address,
          total_amount: total,
          items: items.map(item => ({
            product_id: item.product?.id,
            product_name: item.product?.name || 'Кастомный браслет',
            stone_composition: item.stones.map((s: any) => s.name_ru).join(', '),
            quantity: item.quantity,
            unit_price: item.basePrice,
          })),
        }),
      });

      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-backdrop z-50" onClick={onClose}>
        <div className="modal-content text-center" onClick={e => e.stopPropagation()}>
          <h3 className="font-display text-2xl font-semibold text-[var(--ink)] mb-4">
            Спасибо за заказ!
          </h3>
          <p className="text-[var(--ash)] mb-6">
            Мы свяжемся с вами в ближайшее время для подтверждения.
          </p>
          <button onClick={onClose} className="btn-primary">
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop z-50" onClick={onClose}>
      <div className="modal-content max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">
            Оформление заказа
          </h3>
          <button 
            onClick={onClose}
            className="text-2xl text-[var(--ash)] hover:text-[var(--ink)]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--ash)] uppercase tracking-wide mb-2">
              Имя *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full"
              placeholder="Ваше имя"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--ash)] uppercase tracking-wide mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full"
              placeholder="your@email.ru"
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-[var(--ash)] uppercase tracking-wide mb-2">
              Телефон *
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full"
              placeholder="+7 (999) 000-00-00"
              pattern="[\+\d\s\-\(\)]{7,20}"
              title="Введите номер телефона: +7 (999) 000-00-00"
            />
          </div>

          <div>
            <label className="block text-xs text-[var(--ash)] uppercase tracking-wide mb-2">
              Адрес доставки
            </label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full"
              rows={2}
              placeholder="Город, улица, дом, квартира"
            />
          </div>

          <div className="divider my-4" />

          <div className="flex justify-between items-center">
            <span className="text-[var(--ash)]">К оплате:</span>
            <span className="font-display text-xl font-semibold text-[var(--ink)]">
              {total} ₽
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-4"
          >
            {loading ? 'Отправка...' : 'Оформить заказ'}
          </button>
        </form>
      </div>
    </div>
  );
}