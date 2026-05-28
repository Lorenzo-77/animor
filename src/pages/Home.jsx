import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';

import videoDemo from '../assets/img/video-demo.mp4';
import videoBanner from '../assets/img/video-banner.mp4';

// Datos de contacto actualizados
const PHONE = "5492657317153"; 
const IG_URL = "https://www.instagram.com/animor.vm/";

const BENEFITS = [
  {
    icon: Star,
    title: "Calidad Premium",
    desc: "Cada prenda es seleccionada bajo estándares de excelencia en telas y acabados.",
  },
  {
    icon: MessageCircle,
    title: "Asesoría Personalizada",
    desc: "Consultanos por WhatsApp y recibí atención exclusiva para armar tu look.",
  },
  {
    icon: Truck,
    title: "Envíos Seguros",
    desc: "Hacemos llegar la experiencia ANIMOR a la puerta de tu casa con total confianza.",
  },
];

const TESTIMONIALS = [
  { name: "Valentina R.", text: "La calidad de las telas es increíble. Ya compré tres veces y siempre llegan perfectas.", stars: 5 },
  { name: "Camila S.",    text: "Me asesoraron por WhatsApp y encontré exactamente lo que buscaba. ¡Recomiendo 100%!", stars: 5 },
  { name: "Sofía M.",     text: "El packaging es hermoso, se nota el cuidado en cada detalle. Una experiencia de lujo.", stars: 5 },
];

export const Home = () => {
  const { products, loading, error } = useProducts();
  const featuredProducts = products.slice(0, 4);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pt-20">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-animor-text">
        <div className="absolute inset-0 bg-black/45 z-10" />

        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover md:hidden z-0">
          <source src={videoDemo} type="video/mp4" />
        </video>
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover hidden md:block z-0">
          <source src={videoBanner} type="video/mp4" />
        </video>

        <div className="relative z-20 text-center px-4 max-w-3xl">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.2em' }}
            transition={{ duration: 1 }}
            className="block text-white/60 text-[10px] uppercase tracking-[0.3em] mb-6"
          >
            Nueva Colección 2026
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-lg"
          >
            Moda con <br /> propósito.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/80 text-base md:text-lg font-light mb-10 tracking-wide"
          >
            Elegancia, tranquilidad y diseño aesthetic. <br className="hidden md:block" />
            Descubre la nueva colección de ANIMOR.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/coleccion"
              className="inline-flex items-center gap-2 bg-animor-card text-animor-text px-10 py-4 uppercase tracking-widest text-xs font-medium hover:bg-animor-primary hover:text-white transition-all duration-300 shadow-xl"
            >
              Explorar Colección
              <ArrowRight size={14} />
            </Link>
            
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 uppercase tracking-widest text-xs font-medium hover:bg-white/10 transition-all duration-300"
            >
              <MessageCircle size={14} />
              Hablar con asesora
            </a>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-white/40 text-[9px] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
          />
        </div>
      </section>

      {/* ── STRIP DE CONFIANZA ────────────────────────────── */}
      <div className="bg-animor-primary text-white py-3 px-6 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap"
          style={{ animation: 'marquee 22s linear infinite' }}
        >
          {Array.from({ length: 4 }).flatMap((_, i) => [
            <span key={`a${i}`} className="text-[10px] uppercase tracking-widest font-medium">✦ Envíos a todo el país</span>,
            <span key={`b${i}`} className="text-[10px] uppercase tracking-widest font-medium">✦ Atención por WhatsApp</span>,
            <span key={`c${i}`} className="text-[10px] uppercase tracking-widest font-medium">✦ Devoluciones sin cargo</span>,
            <span key={`d${i}`} className="text-[10px] uppercase tracking-widest font-medium">✦ Pago en cuotas</span>,
          ])}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ── DESTACADOS ────────────────────────────────────── */}
      <section className="py-24 bg-animor-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-animor-primary block mb-3">Selección curada</span>
              <h2 className="font-serif text-3xl md:text-4xl text-animor-text">Piezas Destacadas</h2>
            </div>
            <Link
              to="/coleccion"
              className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-animor-text border-b border-animor-text pb-1 hover:text-animor-primary hover:border-animor-primary transition-colors"
            >
              Ver Todo el Catálogo <ArrowRight size={12} />
            </Link>
          </div>

          {error && <p className="text-center text-red-400 mb-10 text-sm">No se pudieron cargar los productos destacados.</p>}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
            }
          </div>
        </div>
      </section>

      {/* ── BANNER EDITORIAL ──────────────────────────────── */}
      <section className="relative h-[55vh] md:h-[65vh] overflow-hidden bg-animor-text flex items-end">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 object-top">
          <source src={videoBanner} type="video/mp4" />
        </video>
        <div className="relative z-20 p-10 md:p-20 max-w-2xl">
          <span className="text-white/60 text-[10px] uppercase tracking-widest block mb-3">Temporada 2026</span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-5 leading-tight">
            Cada prenda cuenta <br /> una historia.
          </h2>
          <Link
            to="/coleccion"
            className="inline-flex items-center gap-2 border border-white text-white text-xs uppercase tracking-widest px-8 py-3 hover:bg-white hover:text-animor-text transition-all duration-300"
          >
            Explorar Lookbook <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────── */}
      <section className="py-20 bg-animor-card border-t border-animor-border">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center">
          {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 mx-auto border border-animor-primary/40 rounded-full flex items-center justify-center text-animor-primary bg-animor-bg">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-animor-text">{title}</h3>
              <p className="text-animor-muted text-sm font-light leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIOS ───────────────────────────────────── */}
      <section className="py-20 bg-animor-bg border-t border-animor-border overflow-hidden">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-[10px] uppercase tracking-widest text-animor-primary block mb-4">Lo que dicen de ANIMOR</span>
          <div className="relative min-h-[130px] flex items-center justify-center">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: i === activeTestimonial ? 1 : 0, y: i === activeTestimonial ? 0 : 12 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-4"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={12} className="fill-animor-primary text-animor-primary" />
                  ))}
                </div>
                <p className="font-serif text-lg md:text-xl text-animor-text italic mb-4 leading-relaxed">
                  "{t.text}"
                </p>
                <span className="text-[10px] uppercase tracking-widest text-animor-muted">— {t.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeTestimonial ? 20 : 6,
                  height: 6,
                  backgroundColor: i === activeTestimonial
                    ? 'var(--color-animor-primary)'
                    : 'var(--color-animor-border)',
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA INSTAGRAM ─────────────────────────────────── */}
      <section className="py-16 bg-animor-card border-t border-animor-border text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mx-auto mb-4 text-animor-primary"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
        </svg>
        
        <h3 className="font-serif text-2xl text-animor-text mb-2">Seguinos en Instagram</h3>
        <p className="text-animor-muted text-sm mb-6 font-light">Encontrá inspiración, novedades y looks completos.</p>
        
        <a
          href={IG_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-animor-text text-animor-text text-xs uppercase tracking-widest px-8 py-3 hover:bg-animor-text hover:text-white transition-all duration-300"
        >
          @animor.vm <ArrowRight size={12} />
        </a>
      </section>
    </div>
  );
};