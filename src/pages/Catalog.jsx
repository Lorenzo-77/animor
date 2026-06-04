import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/catalog/ProductCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';

const SORT_OPTIONS = [
  { label: 'Relevancia',      value: 'default'     },
  { label: 'Menor precio',    value: 'price-asc'   },
  { label: 'Mayor precio',    value: 'price-desc'  },
  { label: 'Novedades',       value: 'newest'      },
];

export const Catalog = () => {
  const { products, loading, error } = useProducts();

  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy,         setSortBy]         = useState('default');
  const [showFilters,    setShowFilters]    = useState(false);
  const [showSort,       setShowSort]       = useState(false);
  const [priceMax,       setPriceMax]       = useState(null);

  // ── ESTADOS DEL PAGINADO ──
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar si es mobile para cambiar de 8 a 6 productos
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reiniciar a la página 1 si el usuario cambia algún filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, sortBy, priceMax]);

  const categories = useMemo(
    () => ['all', ...new Set(products.map(p => p.category))],
    [products]
  );

  const maxPrice = useMemo(
    () => Math.max(...products.map(p => Number(p.salePrice ?? p.price) || 0), 0),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory);

    if (priceMax !== null)
      list = list.filter(p => Number(p.salePrice ?? p.price) <= priceMax);

    if (sortBy === 'price-asc')  list = [...list].sort((a, b) => Number(a.salePrice ?? a.price) - Number(b.salePrice ?? b.price));
    if (sortBy === 'price-desc') list = [...list].sort((a, b) => Number(b.salePrice ?? b.price) - Number(a.salePrice ?? a.price));
    if (sortBy === 'newest')     list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return list;
  }, [products, activeCategory, sortBy, priceMax]);

  // ── LÓGICA DE CÁLCULO DEL PAGINADO ──
  const itemsPerPage = isMobile ? 6 : 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // Cortamos el array original para mostrar solo los de la página actual
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFilterCount = (activeCategory !== 'all' ? 1 : 0) + (priceMax !== null ? 1 : 0);

  const clearFilters = () => { setActiveCategory('all'); setPriceMax(null); setSortBy('default'); };

  // Subir suavemente al cambiar de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-animor-bg">

      {/* ── ENCABEZADO ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center mb-10 md:mb-14">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] uppercase tracking-widest text-animor-primary block mb-3"
        >
          Temporada 2026
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl md:text-5xl mb-4 text-animor-text"
        >
          La Colección
        </motion.h1>
        <p className="text-animor-muted font-light max-w-xl mx-auto text-sm">
          Piezas únicas diseñadas para destacar. Explorá los detalles y armá tu selección.
        </p>
      </div>

      {/* ── BARRA DE FILTROS ───────────────────────────────── */}
      {!loading && (
        <div className="sticky top-16 z-30 bg-animor-bg/90 backdrop-blur-sm border-b border-animor-border mb-8 md:mb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">

            {/* Categorías — scrollable */}
            <div className="relative flex-1 min-w-0">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-animor-bg to-transparent z-10 pointer-events-none md:hidden" />
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-animor-bg to-transparent z-10 pointer-events-none md:hidden" />
              <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-0.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="whitespace-nowrap px-4 py-2 text-[10px] font-semibold uppercase tracking-widest rounded-full border transition-all duration-250 flex-shrink-0"
                    style={{
                      backgroundColor: activeCategory === cat ? 'var(--color-animor-text)' : 'transparent',
                      color: activeCategory === cat ? '#fff' : 'var(--color-animor-muted)',
                      borderColor: activeCategory === cat ? 'var(--color-animor-text)' : 'var(--color-animor-border)',
                    }}
                  >
                    {cat === 'all' ? 'Todo' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Acciones derechas */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowFilters(f => !f)}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium px-3 py-2 border border-animor-border rounded-full hover:border-animor-primary hover:text-animor-primary transition-colors relative"
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">Filtros</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-animor-cta text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSort(s => !s)}
                  className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium px-3 py-2 border border-animor-border rounded-full hover:border-animor-primary hover:text-animor-primary transition-colors"
                >
                  <span className="hidden sm:inline">Ordenar</span>
                  <ChevronDown size={13} style={{ transform: showSort ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>
                <AnimatePresence>
                  {showSort && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-animor-card border border-animor-border shadow-lg z-40 rounded-sm overflow-hidden"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                          className="w-full text-left px-4 py-3 text-[11px] uppercase tracking-wider transition-colors"
                          style={{
                            backgroundColor: sortBy === opt.value ? 'var(--color-animor-bg)' : 'transparent',
                            color: sortBy === opt.value ? 'var(--color-animor-primary)' : 'var(--color-animor-muted)',
                            fontWeight: sortBy === opt.value ? 600 : 400,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-animor-border"
              >
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] uppercase tracking-widest text-animor-muted block mb-3">
                      Precio máximo: {priceMax !== null ? `$${priceMax.toLocaleString()}` : 'Sin límite'}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={maxPrice || 100000}
                      step={500}
                      value={priceMax ?? (maxPrice || 100000)}
                      onChange={e => setPriceMax(Number(e.target.value))}
                      className="w-full accent-animor-primary"
                    />
                    <div className="flex justify-between text-[9px] text-animor-muted mt-1">
                      <span>$0</span>
                      <span>${(maxPrice || 100000).toLocaleString()}</span>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-animor-muted hover:text-animor-cta transition-colors"
                    >
                      <X size={12} /> Limpiar filtros
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── GRILLA ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {error && <p className="text-center text-red-400 mb-8 text-sm">Error al cargar los productos.</p>}

        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] text-animor-muted uppercase tracking-widest">
              Mostrando {currentProducts.length} de {filteredProducts.length} {filteredProducts.length === 1 ? 'pieza' : 'piezas'}
            </p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-[10px] text-animor-muted hover:text-animor-cta flex items-center gap-1 transition-colors">
                <X size={11} /> Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Usamos currentProducts en lugar de filteredProducts para mapear la grilla */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array.from({ length: itemsPerPage }).map((_, i) => <SkeletonCard key={i} />)
              : currentProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
            }
          </AnimatePresence>
        </motion.div>

        {/* ── CONTROLES DE PAGINACIÓN ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16 border-t border-animor-border pt-10">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center border border-animor-border rounded-sm text-animor-muted hover:text-animor-primary hover:border-animor-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 flex items-center justify-center border rounded-sm text-xs font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-animor-text text-white border-animor-text'
                    : 'border-animor-border text-animor-muted hover:border-animor-primary hover:text-animor-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center border border-animor-border rounded-sm text-animor-muted hover:text-animor-primary hover:border-animor-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="font-serif text-2xl text-animor-text mb-3">Sin resultados</p>
            <p className="text-animor-muted text-sm mb-6">No encontramos piezas con estos filtros.</p>
            <button
              onClick={clearFilters}
              className="text-[11px] uppercase tracking-widest border border-animor-text text-animor-text px-6 py-2.5 hover:bg-animor-text hover:text-white transition-colors"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};