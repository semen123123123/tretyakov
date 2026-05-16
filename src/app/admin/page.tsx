'use client';

import { useState, useEffect } from 'react';
import { Stone, Product, Order, Review, OrderItem } from '@/lib/types';
import ImageUploader from '@/components/ImageUploader';

// ─── Helpers ────────────────────────────────────────────────────
async function api(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Ошибка запроса');
  }
  return res.json();
}

// ─── Modal Component ───────────────────────────────────────────
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-[var(--white)] border border-[var(--ink)] max-w-xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl font-semibold text-[var(--ink)]">{title}</h2>
          <button onClick={onClose} className="text-2xl text-[var(--ash)] hover:text-[var(--ink)]">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Product Form ──────────────────────────────────────────────
function ProductForm({ product, onSave, onCancel }: {
  product?: Product | null;
  onSave: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    stone_composition: product?.stone_composition || '',
    price: product?.price ?? '',
    image_url: product?.image_url || '',
    is_published: product?.is_published ?? true,
    in_stock: product?.in_stock ?? true,
    sort_order: product?.sort_order ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      price: form.price === '' ? 0 : Number(form.price),
      sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Название</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Описание</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm h-20" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Состав камней</label>
          <input value={form.stone_composition} onChange={e => setForm({ ...form, stone_composition: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Цена (₽)</label>
          <input type="number" value={form.price === '' ? '' : form.price} onChange={e => setForm({ ...form, price: e.target.value === '' ? '' : Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
        </div>
      </div>
      <div>
        <ImageUploader currentUrl={form.image_url} onUpload={(url) => setForm({ ...form, image_url: url })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Порядок сортировки</label>
          <input type="number" value={form.sort_order === '' ? '' : form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value === '' ? '' : Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
        <label htmlFor="is_published" className="text-sm text-[var(--ink)]">Опубликовано</label>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="in_stock" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
        <label htmlFor="in_stock" className="text-sm text-[var(--ink)]">В наличии</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary text-sm">Сохранить</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Отмена</button>
      </div>
    </form>
  );
}

// ─── Stone Form ────────────────────────────────────────────────
function StoneForm({ stone, onSave, onCancel }: {
  stone?: Stone | null;
  onSave: (data: Partial<Stone>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name_ru: stone?.name_ru || '',
    name_en: stone?.name_en || '',
    color: stone?.color || '',
    description: stone?.description || '',
    history_facts: stone?.history_facts || '',
    additional_fact: stone?.additional_fact || '',
    image_url: stone?.image_url || '',
    history_image: stone?.history_image || '',
    price_per_unit: stone?.price_per_unit || 0,
    sort_order: stone?.sort_order ?? '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...form,
      sort_order: form.sort_order === '' ? 0 : Number(form.sort_order),
    });
  };

  const handleImageUpload = (url: string) => {
    setForm(prev => ({ ...prev, image_url: url }));
  };

  const handleHistoryImageUpload = (url: string) => {
    setForm(prev => ({ ...prev, history_image: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Название (RU)</label>
          <input value={form.name_ru} onChange={e => setForm({ ...form, name_ru: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Название (EN)</label>
          <input value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Цвет</label>
          <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Цена за ед. (₽)</label>
          <input type="number" value={form.price_per_unit} onChange={e => setForm({ ...form, price_per_unit: Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Описание</label>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm h-20" />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">История</label>
        <textarea value={form.history_facts} onChange={e => setForm({ ...form, history_facts: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm h-20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Интересный факт</label>
          <input value={form.additional_fact} onChange={e => setForm({ ...form, additional_fact: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Порядок сортировки</label>
          <input type="number" value={form.sort_order === '' ? '' : form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value === '' ? '' : Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
      </div>
      <div>
        <ImageUploader currentUrl={form.image_url} onUpload={(url) => setForm({ ...form, image_url: url })} />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Фото к истории</label>
        <ImageUploader currentUrl={form.history_image} onUpload={(url) => setForm({ ...form, history_image: url })} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary text-sm">Сохранить</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Отмена</button>
      </div>
    </form>
  );
}

// ─── Review Form ────────────────────────────────────────────────
function ReviewForm({ review, onSave, onCancel }: {
  review?: Review | null;
  onSave: (data: Partial<Review>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    author_name: review?.author_name || '',
    rating: review?.rating || 5,
    text: review?.text || '',
    source: review?.source || 'Сайт',
    is_approved: review?.is_approved ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Имя автора</label>
        <input value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Рейтинг (1-5)</label>
        <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm">
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Текст отзыва</label>
        <textarea value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" rows={3} required />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Источник</label>
        <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is-approved" checked={form.is_approved} onChange={e => setForm({ ...form, is_approved: e.target.checked })} />
        <label htmlFor="is-approved" className="text-xs font-mono uppercase tracking-wide text-[var(--ink)]">Одобрен</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary text-sm">Сохранить</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Отмена</button>
      </div>
    </form>
  );
}

// ─── Admin Page ────────────────────────────────────────────────
type Tab = 'orders' | 'products' | 'stones' | 'reviews';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stones, setStones] = useState<Stone[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [prevOrderCount, setPrevOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState<{ type: 'product' | 'stone' | 'review'; edit?: Product | Stone | Review | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'stone'; id: string; name: string } | null>(null);

  // Check existing session on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api('/api/auth');
        if (res.authenticated) setIsAuthenticated(true);
      } catch {}
      setAuthLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, activeTab]);

  // Poll for new orders every 15 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      try {
        const data = await api('/api/orders');
        const currentCount = data.length;
        if (prevOrderCount > 0 && currentCount > prevOrderCount) {
          setNewOrdersCount(prev => prev + (currentCount - prevOrderCount));
        }
        setPrevOrderCount(currentCount);
      } catch {}
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, prevOrderCount]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const data = await api('/api/orders');
        setOrders(data || []);
        setNewOrdersCount(0);
        setPrevOrderCount(data?.length || 0);
      } else if (activeTab === 'products') {
        const data = await api('/api/products');
        setProducts(data || []);
      } else if (activeTab === 'reviews') {
        const data = await api('/api/reviews');
        setReviews(data || []);
      } else {
        const data = await api('/api/stones');
        setStones(data || []);
      }
    } catch (err: any) {
      alert('Ошибка загрузки: ' + err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      if (res.success) {
        setIsAuthenticated(true);
        setPassword('');
      }
    } catch (err: any) {
      alert(err.message || 'Неверный пароль');
    }
  };

  const handleLogout = async () => {
    try {
      await api('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {}
    setIsAuthenticated(false);
  };

  // ── Product CRUD ──
  const saveProduct = async (data: Partial<Product>) => {
    try {
      if (modal?.edit) {
        await api('/api/products', {
          method: 'PUT',
          body: JSON.stringify({ id: modal.edit.id, ...data }),
        });
      } else {
        await api('/api/products', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      setModal(null);
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api('/api/products?id=' + id, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  // ── Stone CRUD ──
  const saveStone = async (data: Partial<Stone>) => {
    try {
      if (modal?.edit) {
        await api('/api/stones', {
          method: 'PUT',
          body: JSON.stringify({ id: modal.edit.id, ...data }),
        });
      } else {
        await api('/api/stones', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      setModal(null);
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  const deleteStone = async (id: string) => {
    try {
      await api('/api/stones?id=' + id, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  // ── Review CRUD ──
  const saveReview = async (data: Partial<Review>) => {
    try {
      if (modal?.edit) {
        await api('/api/reviews', {
          method: 'PUT',
          body: JSON.stringify({ id: modal.edit.id, ...data }),
        });
      } else {
        await api('/api/reviews', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      setModal(null);
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api('/api/orders', {
        method: 'PATCH',
        body: JSON.stringify({ id: orderId, status }),
      });
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  const togglePublished = async (productId: string, current: boolean) => {
    try {
      await api('/api/products', {
        method: 'PUT',
        body: JSON.stringify({ id: productId, is_published: !current }),
      });
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  const toggleInStock = async (productId: string, current: boolean) => {
    try {
      await api('/api/products', {
        method: 'PUT',
        body: JSON.stringify({ id: productId, in_stock: !current }),
      });
      fetchData();
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    }
  };

  // ── Login screen / loading ──
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--raw-paper)] flex items-center justify-center p-6">
        <p className="text-[var(--ash)] font-mono text-sm">Загрузка...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--raw-paper)] flex items-center justify-center p-6">
        <div className="bg-[var(--white)] p-8 border border-[var(--ink)] max-w-md w-full">
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)] mb-6">Админ-панель</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введите пароль" className="w-full mb-4 p-2 border border-[var(--ash)]" />
            <button type="submit" className="w-full btn-primary">Войти</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--raw-paper)]">
      <header className="bg-[var(--ink)] text-[var(--white)] p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-display text-2xl font-semibold">Админ-панель ТРЕТЬЯКОВ</h1>
          <button onClick={handleLogout} className="text-[var(--ash)] hover:text-[var(--white)] text-sm">Выйти</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {(['orders', 'products', 'reviews', 'stones'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wide ${
                activeTab === tab
                  ? 'bg-[var(--ink)] text-[var(--white)]'
                  : 'bg-[var(--white)] text-[var(--ink)] border border-[var(--ink)]'
              }`}
            >
              {tab === 'orders' ? `Заказы (${orders.length})` : tab === 'products' ? `Товары (${products.length})` : tab === 'reviews' ? `Отзывы (${reviews.length})` : `Камни (${stones.length})`}
              {tab === 'orders' && newOrdersCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{newOrdersCount}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[var(--ash)]">Загрузка...</p>
        ) : activeTab === 'orders' ? (
          /* ──────── ORDERS ──────── */
          <div className="bg-[var(--white)] border border-[var(--ink)] overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[var(--ink)]">
                  {['№', 'Клиент / Состав', 'Сумма', 'Статус', 'Оплата', 'Дата', 'Действия'].map(h => (
                    <th key={h} className="text-left p-4 font-mono text-xs uppercase text-[var(--ash)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-[var(--ash)]">
                    <td className="p-4 font-mono text-sm">{order.order_number}</td>
                    <td className="p-4">
                      <p className="text-sm">{order.customer_name}</p>
                      <p className="text-xs text-[var(--ash)]">{order.customer_email}</p>
                      {order.items && order.items.length > 0 && (
                        <div className="mt-2 text-[10px] text-[var(--ash)] border-t border-dashed border-[var(--ash)]/30 pt-1">
                          {order.items.map((item: OrderItem, i: number) => (
                            <div key={i} className="truncate max-w-[200px]">
                              {item.product_name} × {item.quantity}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-display">{order.total_amount} ₽</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 ${
                        order.status === 'pending' ? 'bg-yellow-100' :
                        order.status === 'processing' ? 'bg-blue-100' :
                        order.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                      }`}>{order.status}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 ${
                        order.payment_status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                      }`}>{order.payment_status}</span>
                    </td>
                    <td className="p-4 text-sm text-[var(--ash)]">
                      {new Date(order.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="text-xs p-1 border border-[var(--ash)]"
                      >
                        {['pending', 'processing', 'completed', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-[var(--ash)]">Нет заказов</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'products' ? (
          /* ──────── PRODUCTS ──────── */
          <div>
            <button
              onClick={() => setModal({ type: 'product' })}
              className="btn-primary text-sm mb-6"
            >
              + Добавить товар
            </button>
            <div className="bg-[var(--white)] border border-[var(--ink)] overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[var(--ink)]">
                    {['Фото', 'Название', 'Цена', 'Порядок', 'Статус', 'В наличии', 'Действия'].map(h => (
                      <th key={h} className="text-left p-4 font-mono text-xs uppercase text-[var(--ash)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-[var(--ash)]">
                      <td className="p-4">
                        <div className="w-12 h-12 border border-[var(--ash)] overflow-hidden">
                          {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-display">{p.name}</p>
                        <p className="text-xs text-[var(--ash)]">{p.slug}</p>
                      </td>
                      <td className="p-4 font-display">{p.price} ₽</td>
                      <td className="p-4 text-sm">{p.sort_order}</td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublished(p.id, p.is_published)}
                          className={`text-xs px-2 py-1 ${p.is_published ? 'bg-green-100' : 'bg-red-100'}`}
                        >
                          {p.is_published ? 'Активен' : 'Скрыт'}
                        </button>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleInStock(p.id, p.in_stock)}
                          className={`text-xs px-2 py-1 ${p.in_stock ? 'bg-green-100' : 'bg-red-100'}`}
                        >
                          {p.in_stock ? 'В наличии' : 'Нет'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => setModal({ type: 'product', edit: p })} className="text-xs text-[var(--ink)] underline">Ред.</button>
                          <button onClick={() => setDeleteTarget({ type: 'product', id: p.id, name: p.name })} className="text-xs text-red-500 underline">Удалить</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-[var(--ash)]">Нет товаров</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'reviews' ? (
          /* ──────── REVIEWS ──────── */
          <div>
            <button
              onClick={() => setModal({ type: 'review' })}
              className="btn-primary text-sm mb-6"
            >
              + Добавить отзыв
            </button>
            <div className="bg-[var(--white)] border border-[var(--ink)] overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[var(--ink)]">
                    {['Автор', 'Рейтинг', 'Отзыв', 'Источник', 'Статус', 'Дата', 'Действия'].map(h => (
                      <th key={h} className="text-left p-4 font-mono text-xs uppercase text-[var(--ash)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id} className="border-b border-[var(--ash)]">
                      <td className="p-4 font-mono text-sm">{r.author_name}</td>
                      <td className="p-4">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                      <td className="p-4 max-w-xs">
                        <p className="text-sm truncate">{r.text}</p>
                      </td>
                      <td className="p-4 text-xs text-[var(--ash)]">{r.source}</td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            await api('/api/reviews', { method: 'PUT', body: JSON.stringify({ id: r.id, is_approved: !r.is_approved }) });
                            fetchData();
                          }}
                          className={`text-xs px-2 py-1 ${r.is_approved ? 'bg-green-100' : 'bg-red-100'}`}
                        >
                          {r.is_approved ? 'Одобрен' : 'На модерации'}
                        </button>
                      </td>
                      <td className="p-4 text-xs text-[var(--ash)]">{r.created_at}</td>
                      <td className="p-4">
                        <button
                          onClick={async () => {
                            if (confirm('Удалить отзыв?')) {
                              await api('/api/reviews?id=' + r.id, { method: 'DELETE' });
                              fetchData();
                            }
                          }}
                          className="text-xs text-red-500 underline"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-[var(--ash)]">Нет отзывов</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ──────── STONES ──────── */
          <div>
            <button
              onClick={() => setModal({ type: 'stone' })}
              className="btn-primary text-sm mb-6"
            >
              + Добавить камень
            </button>
            <div className="bg-[var(--white)] border border-[var(--ink)] overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[var(--ink)]">
                    {['Фото', 'Название', 'Цвет', 'Цена', 'Порядок', 'Действия'].map(h => (
                      <th key={h} className="text-left p-4 font-mono text-xs uppercase text-[var(--ash)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stones.map(s => (
                    <tr key={s.id} className="border-b border-[var(--ash)]">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-full border border-[var(--ash)] overflow-hidden">
                          {s.image_url && <img src={s.image_url} alt={s.name_ru} className="w-full h-full object-cover" />}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-display">{s.name_ru}</p>
                        <p className="text-xs text-[var(--ash)]">{s.name_en}</p>
                      </td>
                      <td className="p-4 text-sm">{s.color}</td>
                      <td className="p-4 font-display">{s.price_per_unit} ₽</td>
                      <td className="p-4 text-sm">{s.sort_order}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => setModal({ type: 'stone', edit: s })} className="text-xs text-[var(--ink)] underline">Ред.</button>
                          <button onClick={() => setDeleteTarget({ type: 'stone', id: s.id, name: s.name_ru })} className="text-xs text-red-500 underline">Удалить</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {stones.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-[var(--ash)]">Нет камней</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {modal?.type === 'product' && (
        <Modal title={modal.edit ? 'Редактировать товар' : 'Добавить товар'} onClose={() => setModal(null)}>
          <ProductForm product={modal.edit as Product} onSave={saveProduct} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'stone' && (
        <Modal title={modal.edit ? 'Редактировать камень' : 'Добавить камень'} onClose={() => setModal(null)}>
          <StoneForm stone={modal.edit as Stone} onSave={saveStone} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'review' && (
        <Modal title={modal.edit ? 'Редактировать отзыв' : 'Добавить отзыв'} onClose={() => setModal(null)}>
          <ReviewForm review={modal.edit as Review} onSave={saveReview} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-[var(--white)] border border-[var(--ink)] p-6 max-w-sm w-full">
            <h3 className="font-display text-lg font-semibold text-[var(--ink)] mb-4">Подтверждение</h3>
            <p className="text-sm text-[var(--ink)] mb-6">
              Удалить <strong>{deleteTarget.name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="btn-secondary text-sm">Отмена</button>
              <button
                onClick={() => deleteTarget.type === 'product' ? deleteProduct(deleteTarget.id) : deleteStone(deleteTarget.id)}
                className="bg-red-600 text-white text-sm px-4 py-2 hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
