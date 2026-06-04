// ── Navbar.jsx ────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const PHONE   = "5492657317153";
const IG_URL  = "https://www.instagram.com/animor.vm/";

const NAV_LINKS = [
  { to: '/',          label: 'Inicio'     },
  { to: '/coleccion', label: 'Colección'  },
];

// SVG Instagram inline para evitar errores de import
const IgIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [cartBump,   setCartBump]   = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Scroll: fondo + barra de progreso
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? Math.min(y / docH, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Badge bump al agregar al carrito
  useEffect(() => {
    if (totalItems > 0) {
      setCartBump(true);
      const t = setTimeout(() => setCartBump(false), 350);
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  // Cerrar menú mobile al navegar
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Bloquear scroll cuando el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled || mobileOpen
            ? 'var(--color-animor-bg)'
            : 'rgba(248,245,242,0.82)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${scrolled ? 'var(--color-animor-border)' : 'transparent'}`,
          boxShadow: scrolled ? '0 2px 24px rgba(45,42,42,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-[4.5rem] flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={handleScrollTop}
            className="flex items-center gap-2.5 flex-shrink-0 group"
          >
 
            <span className="font-serif text-xl md:text-2xl tracking-[0.22em] text-animor-text uppercase group-hover:text-animor-primary transition-colors duration-300">
              Animor
            </span>
          </Link>

          {/* ── Links desktop ── */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={to === '/' ? handleScrollTop : undefined}
                  className="relative text-[11px] uppercase tracking-widest font-medium transition-colors duration-200 py-1"
                  style={{ color: active ? 'var(--color-animor-primary)' : 'var(--color-animor-muted)' }}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-animor-primary"
                    />
                  )}
                </Link>
              );
            })}

            <span className="w-px h-4 bg-animor-border" />

            {/* Instagram */}
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="text-animor-muted hover:text-animor-primary transition-colors duration-200"
              aria-label="Instagram de Animor"
            >
              <IgIcon size={15} />
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-medium text-animor-muted hover:text-[#25D366] transition-colors duration-200"
            >
              <MessageCircle size={13} strokeWidth={1.8} />
              Asesoría
            </a>
          </div>

          {/* ── Acciones derecha ── */}
          <div className="flex items-center gap-0.5">
            <a
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className="md:hidden p-2.5 text-animor-muted hover:text-animor-primary transition-colors"
              aria-label="Instagram"
            >
              <IgIcon size={18} />
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-animor-text hover:text-animor-primary transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={21} strokeWidth={1.6} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: cartBump ? 1.3 : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute top-1 right-1 bg-animor-cta text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none pointer-events-none"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden p-2.5 text-animor-text"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menú"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="x"    initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45,  opacity: 0 }} transition={{ duration: 0.16 }}><X     size={21} /></motion.span>
                  : <motion.span key="menu" initial={{ rotate:  45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.16 }}><Menu size={21} /></motion.span>
                }
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-animor-primary/35 origin-left transition-none"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </nav>

      {/* ── Menú Mobile fullscreen ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-animor-bg flex flex-col"
            style={{ paddingTop: '4.5rem' }}
          >
            <nav className="flex-1 flex flex-col justify-center items-center gap-1 px-8">
              {NAV_LINKS.map(({ to, label }, i) => {
                const active = location.pathname === to;
                return (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full"
                  >
                    <Link
                      to={to}
                      onClick={to === '/' ? handleScrollTop : undefined}
                      className="flex items-center justify-between w-full py-5 border-b border-animor-border transition-colors"
                      style={{ color: active ? 'var(--color-animor-primary)' : 'var(--color-animor-text)' }}
                    >
                      <span className="font-serif text-3xl">{label}</span>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-animor-primary" />}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="w-full pt-6 flex flex-col gap-3"
              >
                <a
                  href={`https://wa.me/${PHONE}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] uppercase tracking-widest font-medium border rounded-sm transition-colors"
                  style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)' }}
                >
                  <MessageCircle size={14} />
                  Hablar con asesora
                </a>

                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-[11px] uppercase tracking-widest font-medium border border-animor-border rounded-sm text-animor-muted hover:text-animor-primary hover:border-animor-primary transition-colors"
                >
                  <IgIcon size={13} />
                  @animor.vm
                </a>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="px-8 pb-10 text-center"
            >
              <p className="text-[10px] uppercase tracking-widest text-animor-muted">
                Moda con propósito · ANIMOR 2026
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};