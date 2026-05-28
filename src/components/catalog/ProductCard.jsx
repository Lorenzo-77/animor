import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Maximize2, X, Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const WaIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
);

// Tallas disponibles por defecto si el producto no las trae
const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const [isZoomed, setIsZoomed]       = useState(false);
  const [isFaved, setIsFaved]         = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError]     = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgIndex, setImgIndex]       = useState(0);

  const phoneNumber = "5491100000000";

  // Soporte para múltiples imágenes o imagen única
  const images = product.images?.length ? product.images : [product.image];
  const sizes  = product.sizes ?? DEFAULT_SIZES;
  const isNew  = product.isNew ?? false;
  const isSale = product.salePrice != null;
  const stock  = product.stock ?? 'available'; // 'available' | 'low' | 'out'

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 1200);
      return;
    }
    addToCart({ ...product, selectedSize });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const msg = `Hola, me interesa: *${product.title}*${selectedSize ? ` — Talle ${selectedSize}` : ''} — $${isSale ? product.salePrice : product.price}. ¿Está disponible?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const cycleImg = (dir, e) => {
    e?.stopPropagation();
    setImgIndex(i => (i + dir + images.length) % images.length);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="group flex flex-col bg-animor-card border border-animor-border hover:shadow-xl transition-shadow duration-500"
      >
        {/* ── IMAGEN ─────────────────────────────── */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-animor-bg cursor-pointer"
          onClick={() => setIsZoomed(true)}
        >
          {/* Slides */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={imgIndex}
              src={images[imgIndex]}
              alt={product.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </AnimatePresence>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {isNew && (
              <span className="text-[9px] uppercase tracking-widest font-medium bg-animor-primary text-white px-2 py-0.5">
                Nuevo
              </span>
            )}
            {isSale && (
              <span className="text-[9px] uppercase tracking-widest font-medium bg-animor-cta text-white px-2 py-0.5">
                Oferta
              </span>
            )}
            {stock === 'low' && (
              <span className="text-[9px] uppercase tracking-widest font-medium bg-amber-100 text-amber-700 px-2 py-0.5">
                Últimas unidades
              </span>
            )}
          </div>


          {/* Flechas multi-imagen (solo si hay más de 1) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => cycleImg(-1, e)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={(e) => cycleImg(1, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ChevronRight size={14} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === imgIndex ? 16 : 5,
                      height: 5,
                      backgroundColor: i === imgIndex ? 'var(--color-animor-primary)' : 'rgba(255,255,255,0.7)',
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Zoom overlay — desktop */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
            <div className="bg-white/90 text-animor-text p-3 rounded-full translate-y-3 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
              <Maximize2 size={20} />
            </div>
          </div>

          {/* Zoom icon — mobile */}
          <div className="absolute bottom-2 right-2 md:hidden bg-white/70 p-1.5 rounded-full shadow-sm text-animor-text">
            <Maximize2 size={12} />
          </div>

          {/* Stock agotado */}
          {stock === 'out' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="text-[10px] uppercase tracking-widest font-medium text-animor-muted border border-animor-border bg-white px-3 py-1.5">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* ── CONTENIDO ──────────────────────────── */}
        <div className="p-3 md:p-4 flex flex-col flex-grow gap-2 md:gap-3">

          {/* Categoría */}
          <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-animor-muted truncate">
            {product.category}
          </span>

          {/* Título */}
          <h3 className="font-serif text-sm md:text-base leading-snug text-animor-text line-clamp-2">
            {product.title}
          </h3>

          {/* Colores (swatches) */}
          {product.colors?.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="w-3.5 h-3.5 rounded-full border border-animor-border shadow-inner"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}

          {/* Tallas */}
          <div className="flex flex-wrap gap-1">
            {sizes.map((sz) => {
              const isUnavailable = product.unavailableSizes?.includes(sz);
              const isSelected    = selectedSize === sz;
              return (
                <button
                  key={sz}
                  disabled={isUnavailable || stock === 'out'}
                  onClick={(e) => { e.stopPropagation(); if (!isUnavailable) setSelectedSize(sz); }}
                  className="relative text-[9px] md:text-[10px] uppercase font-medium px-1.5 md:px-2 py-1 border transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    borderColor: isSelected ? 'var(--color-animor-cta)' : sizeError ? '#ef4444' : 'var(--color-animor-border)',
                    backgroundColor: isSelected ? 'var(--color-animor-cta)' : 'transparent',
                    color: isSelected ? '#fff' : sizeError ? '#ef4444' : 'var(--color-animor-muted)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {sz}
                  {/* Tachado para tallas sin stock */}
                  {isUnavailable && (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-full h-px bg-animor-muted/50 rotate-45 absolute" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {sizeError && (
            <p className="text-[9px] text-red-400 -mt-1">
              Seleccioná un talle antes de añadir
            </p>
          )}

          {/* Precio */}
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="font-medium text-animor-primary text-sm md:text-base">
              ${isSale
                ? (typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : product.salePrice)
                : (typeof product.price === 'number' ? product.price.toFixed(2) : product.price)
              }
            </span>
            {isSale && (
              <span className="text-[11px] text-animor-muted line-through">
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-1.5">
            {/* Añadir al carrito */}
            <button
              disabled={stock === 'out'}
              onClick={handleAddToCart}
              className="w-full py-2.5 md:py-3 flex items-center justify-center gap-1.5 md:gap-2 border transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden relative"
              style={{
                borderColor: addedFeedback ? 'var(--color-animor-primary)' : 'var(--color-animor-text)',
                backgroundColor: addedFeedback ? 'var(--color-animor-primary)' : 'transparent',
                color: addedFeedback ? '#fff' : 'var(--color-animor-text)',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {addedFeedback ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest"
                  >
                    <ShoppingBag size={13} />
                    ¡Añadido!
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-1.5 text-[10px] md:text-xs uppercase tracking-widest"
                  >
                    <Plus size={13} />
                    <span className="hidden md:inline">Añadir a mi Selección</span>
                    <span className="md:hidden">Añadir</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            
          </div>
        </div>
      </motion.div>

      {/* ── MODAL ZOOM ─────────────────────────── */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-animor-bg/96 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-5 right-5 text-animor-text p-2 hover:bg-animor-border rounded-full transition-colors z-50"
            >
              <X size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {images.length > 1 && (
                <button
                  onClick={() => cycleImg(-1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-animor-card border border-animor-border shadow hover:shadow-md transition-shadow"
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              <img
                src={images[imgIndex]}
                alt={product.title}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                style={{ cursor: 'default' }}
              />

              {images.length > 1 && (
                <button
                  onClick={() => cycleImg(1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-animor-card border border-animor-border shadow hover:shadow-md transition-shadow"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </motion.div>

            {/* Info flotante */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-animor-card/90 backdrop-blur-sm border border-animor-border px-5 py-3 text-center shadow-lg rounded-sm">
              <p className="font-serif text-sm text-animor-text">{product.title}</p>
              <p className="text-animor-primary text-xs mt-0.5">
                ${isSale
                  ? (typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : product.salePrice)
                  : (typeof product.price === 'number' ? product.price.toFixed(2) : product.price)
                }
                {images.length > 1 && (
                  <span className="text-animor-muted ml-2">{imgIndex + 1} / {images.length}</span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};