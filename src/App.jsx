import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Admin } from './pages/Admin';

// 👇 IMPORTAMOS TU LOGO COMO MÓDULO 👇
import logoGerald from './assets/img/logo-gerald.png';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-animor-bg relative">
          <Navbar />
          <CartDrawer />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coleccion" element={<Catalog />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          <FloatingWhatsApp />
          
          {/* ── FOOTER OPTIMIZADO CON TU FIRMA DESTACADA ── */}
          <footer className="bg-animor-card text-animor-text py-12 text-center border-t border-animor-border mt-auto px-4">
            
            <p className="text-animor-muted text-[11px] tracking-widest uppercase mb-8">
              © {new Date().getFullYear()} ANIMOR Boutique. Todos los derechos reservados.
            </p>

            {/* Firma de tu Agencia (Más grande y centrada) */}
            <a 
              href="https://geralddev.com.ar/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 group"
            >
              <span className="text-[9px] uppercase tracking-[0.2em] text-animor-muted/70 group-hover:text-animor-text transition-colors duration-300">
                Desarrollado por
              </span>
              <img 
                src={logoGerald} 
                alt="Gerald.Dev" 
                className="h-8 md:h-9 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
              />
            </a>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;