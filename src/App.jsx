import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Admin } from './pages/Admin';
function App() {
  return (
    <CartProvider>
      <Router basename="/animor">
        <div className="flex flex-col min-h-screen bg-animor-bg relative">
          <Navbar />
          <CartDrawer />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coleccion" element={<Catalog />} />
              {/* LA NUEVA RUTA SECRETA */}
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          <FloatingWhatsApp />
          
          <footer className="bg-animor-card text-animor-text py-12 text-center border-t border-animor-border mt-auto">
            <img src="/img/logo.png" alt="ANIMOR" className="h-10 mx-auto mb-4 opacity-80 object-contain" />
            <p className="text-animor-muted text-sm tracking-widest uppercase">
              © {new Date().getFullYear()} ANIMOR Boutique. Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;