import { lazy, Suspense, useState } from 'react';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Locations from './components/Locations';
import Social from './components/Social';

// El visor de PDF se descarga recién cuando se abre la carta.
const MenuModal = lazy(() => import('./components/MenuModal'));

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <main className="page">
        <Hero onOpenMenu={() => setMenuOpen(true)} />
        <Locations />
        <Social />
      </main>
      <Footer />
      {menuOpen && (
        <Suspense fallback={null}>
          <MenuModal onClose={() => setMenuOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
