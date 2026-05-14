import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--raw-paper)] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="font-display text-8xl font-semibold text-[var(--ink)] mb-4">404</h1>
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--ash)] mb-8">
          Страница не найдена
        </p>
        <p className="text-[var(--ash)] mb-8">
          Такой страницы не существует или она была перемещена.
        </p>
        <Link href="/" className="btn-primary inline-block">
          На главную
        </Link>
      </div>
    </div>
  );
}
