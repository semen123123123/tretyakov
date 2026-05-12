import Hero from '@/components/Hero';
import History from '@/components/History';
import StonesServer from '@/components/StonesServer';
import ConstructorServer from '@/components/ConstructorServer';
import CatalogServer from '@/components/CatalogServer';
import ReviewsServer from '@/components/ReviewsServer';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen pt-14">
      <Hero />
      <History />
      
      <Suspense fallback={<div className="py-24 text-center text-[var(--ash)]">Загрузка...</div>}>
        <StonesServer />
      </Suspense>
      
      <ConstructorServer />
      
      <Suspense fallback={<div className="py-24 text-center text-[var(--ash)]">Загрузка...</div>}>
        <CatalogServer />
      </Suspense>
      
      <Suspense fallback={<div className="py-24 text-center text-[var(--ash)]">Загрузка...</div>}>
        <ReviewsServer />
      </Suspense>
      
      <Footer />
      <Cart />
    </main>
  );
}