'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Stone, Product, Order } from '@/lib/types';
import ImageUploader from '@/components/ImageUploader';

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
    price: product?.price || 0,
    image_url: product?.image_url || '',
    is_published: product?.is_published ?? true,
    sort_order: product?.sort_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
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
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm h-20" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Состав камней</label>
          <input value={form.stone_composition} onChange={e => setForm({ ...form, stone_composition: e.target.value })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Цена (₽)</label>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" required />
        </div>
      </div>
      <div>
        <ImageUploader currentUrl={form.image_url} onUpload={(url) => setForm({ ...form, image_url: url })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[var(--ash)] mb-1">Порядок сортировки</label>
          <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
        <label htmlFor="is_published" className="text-sm text-[var(--ink)]">Опубликовано</label>
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
    price_per_unit: stone?.price_per_unit || 0,
    sort_order: stone?.sort_order || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(form);
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
          <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full p-2 border border-[var(--ash)] text-sm" />
        </div>
      </div>
      <div>
        <ImageUploader currentUrl={form.image_url} onUpload={(url) => setForm({ ...form, image_url: url })} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary text-sm">Сохранить</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Отмена</button>
      </div>
    </form>
  );
}

// ─── Admin Page ────────────────────────────────────────────────
type Tab = 'orders' | 'products' | 'stones';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stones, setStones] = useState<Stone[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState<{ type: 'product' | 'stone'; edit?: Product | Stone | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'stone'; id: string; name: string } | null>(null);

  const ADMIN_PASSWORD = 'tretyakov2024';

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'orders') {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setOrders(data || []);
    } else if (activeTab === 'products') {
      const { data } = await supabase.from('products').select('*').order('sort_order');
      setProducts(data || []);
    } else {
      const { data } = await supabase.from('stones').select('*').order('sort_order');
      setStones(data || []);
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert('Неверный пароль');
  };

  // ── Product CRUD ──
  const saveProduct = async (data: Partial<Product>) => {
    if (modal?.edit) {
      const { error } = await supabase.from('products').update(data).eq('id', modal.edit.id);
      if (error) return alert('Ошибка: ' + error.message);
    } else {
      const { error } = await supabase.from('products').insert([data]);
      if (error) return alert('Ошибка: ' + error.message);
    }
    setModal(null);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return alert('Ошибка: ' + error.message);
    setDeleteTarget(null);
    fetchData();
  };

  // ── Stone CRUD ──
  const saveStone = async (data: Partial<Stone>) => {
    if (modal?.edit) {
      const { error } = await supabase.from('stones').update(data).eq('id', modal.edit.id);
      if (error) return alert('Ошибка: ' + error.message);
    } else {
      const { error } = await supabase.from('stones').insert([data]);
      if (error) return alert('Ошибка: ' + error.message);
    }
    setModal(null);
    fetchData();
  };

  const deleteStone = async (id: string) => {
    const { error } = await supabase.from('stones').delete().eq('id', id);
    if (error) return alert('Ошибка: ' + error.message);
    setDeleteTarget(null);
    fetchData();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchData();
  };

  const togglePublished = async (productId: string, current: boolean) => {
    await supabase.from('products').update({ is_published: !current }).eq('id', productId);
    fetchData();
  };

  // ── Login screen ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--raw-paper)] flex items-center justify-center p-6">
        <div className="bg-[var(--white)] p-8 border border-[var(--ink)] max-w-md w-full">
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)] mb-6">Админ-панель</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введите пароль" className="w-full mb-4 p-2 border border-[var(--ash)]" />
            <button type="submit" className="w-full btn-primary">Войти</button>
          </form>
          <p className="text-xs text-[var(--ash)] mt-4 text-center">Пароль: tretyakov2024</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--raw-paper)]">
      <header className="bg-[var(--ink)] text-[var(--white)] p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-display text-2xl font-semibold">Админ-панель ТРЕТЬЯКОВ</h1>
          <button onClick={() => setIsAuthenticated(false)} className="text-[var(--ash)] hover:text-[var(--white)] text-sm">Выйти</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {(['orders', 'products', 'stones'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-mono text-sm uppercase tracking-wide ${
                activeTab === tab
                  ? 'bg-[var(--ink)] text-[var(--white)]'
                  : 'bg-[var(--white)] text-[var(--ink)] border border-[var(--ink)]'
              }`}
            >
              {tab === 'orders' ? `Заказы (${orders.length})` : tab === 'products' ? `Товары (${products.length})` : `Камни (${stones.length})`}
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
                  {['№', 'Клиент', 'Сумма', 'Статус', 'Оплата', 'Дата', 'Действия'].map(h => (
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
                        order.payment_status === 'pending' ? 'bg-yellow-100' :
                        order.payment_status === 'paid' ? 'bg-green-100' : 'bg-red-100'
                      }`}>{order.payment_status}</span>
                    </td>
                    <td className="p-4 text-sm text-[var(--ash)]">{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                    <td className="p-4">
                      <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)} className="text-sm p-1 border border-[var(--ash)]">
                        <option value="pending">В обработке</option>
                        <option value="processing">В сборке</option>
                        <option value="shipped">Отправлен</option>
                        <option value="completed">Завершён</option>
                        <option value="cancelled">Отменён</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-[var(--ash)]">Заказов пока нет</td></tr>
                )}
              </tbody>
            </table>
          </div>

        ) : activeTab === 'products' ? (
          /* ──────── PRODUCTS ──────── */
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => setModal({ type: 'product', edit: null })} className="btn-primary text-sm">
                + Добавить товар
              </button>
            </div>
            <div className="bg-[var(--white)] border border-[var(--ink)] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-[var(--ink)]">
                    {['Название', 'Цена', 'Состав', 'Публикация', 'Порядок', 'Действия'].map(h => (
                      <th key={h} className="text-left p-4 font-mono text-xs uppercase text-[var(--ash)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-[var(--ash)]">
                      <td className="p-4 text-sm">{p.name}</td>
                      <td className="p-4 font-display">{p.price} ₽</td>
                      <td className="p-4 text-xs text-[var(--ash)]">{p.stone_composition}</td>
                      <td className="p-4">
                        <button onClick={() => togglePublished(p.id, p.is_published)} className={`text-xs px-3 py-1 border ${
                          p.is_published ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'
                        }`}>
                          {p.is_published ? 'Опубликовано' : 'Скрыто'}
                        </button>
                      </td>
                      <td className="p-4 text-xs text-[var(--ash)]">{p.sort_order}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setModal({ type: 'product', edit: p })} className="text-xs px-3 py-1 border border-[var(--ink)] hover:bg-[var(--raw-paper)]">Ред.</button>
                        <button onClick={() => setDeleteTarget({ type: 'product', id: p.id, name: p.name })} className="text-xs px-3 py-1 border border-red-400 text-red-600 hover:bg-red-50">Удал.</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-[var(--ash)]">Товаров пока нет</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {modal?.type === 'product' && (
              <Modal title={modal.edit ? 'Редактировать товар' : 'Добавить товар'} onClose={() => setModal(null)}>
                <ProductForm product={modal.edit as Product | null} onSave={saveProduct} onCancel={() => setModal(null)} />
              </Modal>
            )}
          </>

        ) : (
          /* ──────── STONES ──────── */
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => setModal({ type: 'stone', edit: null })} className="btn-primary text-sm">
                + Добавить камень
              </button>
            </div>
            <div className="bg-[var(--white)] border border-[var(--ink)] overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-[var(--ink)]">
                    {['Название (RU)', 'Название (EN)', 'Цвет', 'Цена', 'Порядок', 'Действия'].map(h => (
                      <th key={h} className="text-left p-4 font-mono text-xs uppercase text-[var(--ash)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stones.map(s => (
                    <tr key={s.id} className="border-b border-[var(--ash)]">
                      <td className="p-4 text-sm">{s.name_ru}</td>
                      <td className="p-4 text-xs text-[var(--ash)]">{s.name_en}</td>
                      <td className="p-4 text-xs text-[var(--ash)]">{s.color}</td>
                      <td className="p-4 text-sm">{s.price_per_unit} ₽</td>
                      <td className="p-4 text-xs text-[var(--ash)]">{s.sort_order}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => setModal({ type: 'stone', edit: s })} className="text-xs px-3 py-1 border border-[var(--ink)] hover:bg-[var(--raw-paper)]">Ред.</button>
                        <button onClick={() => setDeleteTarget({ type: 'stone', id: s.id, name: s.name_ru })} className="text-xs px-3 py-1 border border-red-400 text-red-600 hover:bg-red-50">Удал.</button>
                      </td>
                    </tr>
                  ))}
                  {stones.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-[var(--ash)]">Камней пока нет</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {modal?.type === 'stone' && (
              <Modal title={modal.edit ? 'Редактировать камень' : 'Добавить камень'} onClose={() => setModal(null)}>
                <StoneForm stone={modal.edit as Stone | null} onSave={saveStone} onCancel={() => setModal(null)} />
              </Modal>
            )}
          </>
        )}

        {/* Delete confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDeleteTarget(null)}>
            <div className="bg-[var(--white)] border border-[var(--ink)] max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
              <h3 className="font-display text-lg font-semibold mb-4">Удалить?</h3>
              <p className="text-sm text-[var(--ink)] mb-6">
                Вы уверены, что хотите удалить <strong>{deleteTarget.name}</strong>? Это действие нельзя отменить.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteTarget.type === 'product' ? deleteProduct(deleteTarget.id) : deleteStone(deleteTarget.id)}
                  className="btn-primary text-sm bg-red-600 hover:bg-red-700"
                >
                  Удалить
                </button>
                <button onClick={() => setDeleteTarget(null)} className="btn-secondary text-sm">Отмена</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
