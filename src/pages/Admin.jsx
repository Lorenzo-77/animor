import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Image as ImageIcon, CheckCircle, Plus,
  Edit2, List, PlusCircle, X, Package, Tag,
  AlertTriangle, Layers, Search, Star // <-- Importamos Star
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzjK4utq5GEswBszgHZ4pv4xhdkQmrITuhkOC8EnaiLNl2D_AdY8Fcr0YWT9RTW-V37ng/exec";

const STOCK_CONFIG = {
  available: { label: 'Disponible',       bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  low:       { label: 'Últimas unidades', bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400'   },
  out:       { label: 'Agotado',          bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-400'     },
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest text-animor-muted block mb-2">{label}</label>
    <input
      {...props}
      className="w-full bg-transparent border-b border-animor-border pb-2 outline-none focus:border-animor-primary text-animor-text text-sm transition-colors placeholder:text-animor-border"
    />
  </div>
);

export const Admin = () => {
  const { products, loading } = useProducts();

  const [activeTab,        setActiveTab]        = useState('list');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [search,           setSearch]           = useState('');
  
  // Agregamos isFeatured al estado inicial
  const [formData,         setFormData]         = useState({
    id: '', title: '', price: '', category: '',
    sizes: '', stock: 'available', isSale: false, salePrice: '', isNew: false, isFeatured: false,
  });
  const [selectedColors, setSelectedColors] = useState([]);
  const [tempColor,      setTempColor]      = useState('#B07D8C');
  const [imagePreview,   setImagePreview]   = useState(null);
  const [imageBase64,    setBase64]         = useState(null);
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  const set = (key, val) => setFormData(f => ({ ...f, [key]: val }));

  const handleAddColor = () => {
    if (!selectedColors.includes(tempColor)) setSelectedColors(c => [...c, tempColor]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEditProduct = (product) => {
    setFormData({
      id: product.id, title: product.title || '', price: product.price || '',
      category: product.category || '', sizes: product.sizes ? product.sizes.join(', ') : '',
      stock: product.stock || 'available', isSale: product.salePrice != null,
      salePrice: product.salePrice || '', isNew: product.isNew || false,
      isFeatured: product.isFeatured || false, // <-- Agregado para edición
    });
    setSelectedColors(product.colors || []);
    setImagePreview(product.image);
    setBase64(null);
    setActiveTab('form');
  };

  const handleNewProduct = () => {
    // Reseteamos isFeatured a false
    setFormData({ id: '', title: '', price: '', category: '', sizes: '', stock: 'available', isSale: false, salePrice: '', isNew: false, isFeatured: false });
    setSelectedColors([]);
    setImagePreview(null);
    setBase64(null);
    setActiveTab('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...formData, colors: selectedColors.join(', '), imageBase64, image: imagePreview }),
      });
      setShowSuccessModal(true);
    } catch {
      alert("Problema de conexión. Revisá tu internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats rápidas para el header
  const total      = products.length;
  const outOfStock = products.filter(p => p.stock === 'out').length;
  const onSale     = products.filter(p => p.salePrice != null).length;
  const isNew      = products.filter(p => p.isNew).length;

  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-animor-bg pt-24 pb-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-widest text-animor-primary block mb-1">Gestión de Catálogo</span>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 pb-5 border-b border-animor-border">
            <h1 className="font-serif text-3xl text-animor-text">Panel de Control</h1>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('list')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 border"
                style={{
                  backgroundColor: activeTab === 'list' ? 'var(--color-animor-text)' : 'transparent',
                  color: activeTab === 'list' ? '#fff' : 'var(--color-animor-text)',
                  borderColor: activeTab === 'list' ? 'var(--color-animor-text)' : 'var(--color-animor-border)',
                }}
              >
                <List size={14} /> Mi Catálogo
              </button>
              <button
                onClick={handleNewProduct}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-200 border"
                style={{
                  backgroundColor: activeTab === 'form' ? 'var(--color-animor-text)' : 'transparent',
                  color: activeTab === 'form' ? '#fff' : 'var(--color-animor-text)',
                  borderColor: activeTab === 'form' ? 'var(--color-animor-text)' : 'var(--color-animor-border)',
                }}
              >
                <PlusCircle size={14} /> Nuevo
              </button>
            </div>
          </div>

          {/* Stats */}
          {!loading && activeTab === 'list' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Layers,        label: 'Productos',  value: total,      color: 'text-animor-primary' },
                { icon: Tag,           label: 'En oferta',  value: onSale,     color: 'text-animor-cta'    },
                { icon: Package,       label: 'Nuevos',     value: isNew,      color: 'text-animor-primary' },
                { icon: AlertTriangle, label: 'Sin stock',  value: outOfStock, color: 'text-red-400'        },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-animor-card border border-animor-border p-4 flex items-center gap-3">
                  <Icon size={18} className={`${color} flex-shrink-0`} strokeWidth={1.5} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-animor-muted">{label}</p>
                    <p className={`font-serif text-xl ${color}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── TAB: LISTADO ── */}
        {activeTab === 'list' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Buscador */}
            {!loading && products.length > 0 && (
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-animor-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o categoría..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-animor-card border border-animor-border pl-9 pr-4 py-2.5 text-sm outline-none focus:border-animor-primary text-animor-text transition-colors placeholder:text-animor-muted/60"
                />
              </div>
            )}

            <div className="bg-animor-card border border-animor-border overflow-hidden">
              {loading ? (
                <div className="p-16 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-animor-border border-t-animor-primary rounded-full mx-auto mb-4"
                  />
                  <p className="text-animor-muted text-sm">Cargando catálogo...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-16 text-center">
                  <Package size={36} className="mx-auto mb-4 text-animor-border" strokeWidth={1} />
                  <p className="font-serif text-lg text-animor-text mb-1">Catálogo vacío</p>
                  <p className="text-animor-muted text-sm">Subí tu primer producto con el botón "Nuevo".</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-animor-bg text-animor-muted text-[10px] uppercase tracking-widest border-b border-animor-border">
                      <tr>
                        <th className="px-5 py-3.5 font-medium">Prenda</th>
                        <th className="px-5 py-3.5 font-medium hidden sm:table-cell">Categoría</th>
                        <th className="px-5 py-3.5 font-medium">Precio</th>
                        <th className="px-5 py-3.5 font-medium hidden md:table-cell">Stock</th>
                        <th className="px-5 py-3.5 font-medium hidden md:table-cell">Badges</th>
                        <th className="px-5 py-3.5 font-medium text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-animor-border">
                      <AnimatePresence initial={false}>
                        {filtered.map(prod => {
                          const sc = STOCK_CONFIG[prod.stock] ?? STOCK_CONFIG.available;
                          return (
                            <motion.tr
                              key={prod.id}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="hover:bg-animor-bg/60 transition-colors"
                            >
                              {/* Prenda */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-12 flex-shrink-0 overflow-hidden bg-animor-bg border border-animor-border rounded-sm">
                                    <img
                                      src={prod.image || prod.images?.[0]}
                                      alt={prod.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <span className="font-serif text-animor-text line-clamp-2 max-w-[140px] md:max-w-[220px] leading-snug">
                                    {prod.title}
                                  </span>
                                </div>
                              </td>

                              {/* Categoría */}
                              <td className="px-5 py-4 text-animor-muted text-xs hidden sm:table-cell">
                                {prod.category}
                              </td>

                              {/* Precio */}
                              <td className="px-5 py-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-animor-primary">
                                    ${prod.salePrice || prod.price}
                                  </span>
                                  {prod.salePrice && (
                                    <span className="text-[10px] text-animor-muted line-through">${prod.price}</span>
                                  )}
                                </div>
                              </td>

                              {/* Stock */}
                              <td className="px-5 py-4 hidden md:table-cell">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] uppercase tracking-widest rounded-full ${sc.bg} ${sc.text}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                  {sc.label}
                                </span>
                              </td>

                              {/* Badges */}
                              <td className="px-5 py-4 hidden md:table-cell">
                                <div className="flex gap-1 flex-wrap">
                                  {/* Badge de destacado agregado visualmente */}
                                  {prod.isFeatured && (
                                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-amber-100/60 text-amber-700 rounded-full flex items-center gap-1">
                                      <Star size={9} className="fill-amber-600" /> Destacado
                                    </span>
                                  )}
                                  {prod.isNew && (
                                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-animor-primary/10 text-animor-primary rounded-full">
                                      Nuevo
                                    </span>
                                  )}
                                  {prod.salePrice && (
                                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-animor-cta/10 text-animor-cta rounded-full">
                                      Oferta
                                    </span>
                                  )}
                                  {/* Colores */}
                                  {prod.colors?.length > 0 && (
                                    <div className="flex gap-1 items-center ml-1">
                                      {prod.colors.slice(0, 4).map(c => (
                                        <span key={c} className="w-3 h-3 rounded-full border border-animor-border shadow-inner" style={{ backgroundColor: c }} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Editar */}
                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() => handleEditProduct(prod)}
                                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-animor-muted hover:text-animor-primary transition-colors px-3 py-1.5 border border-animor-border hover:border-animor-primary rounded-sm"
                                >
                                  <Edit2 size={12} /> Editar
                                </button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>

                  {filtered.length === 0 && search && (
                    <p className="text-center py-10 text-animor-muted text-sm">
                      Sin resultados para "<span className="italic">{search}</span>"
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── TAB: FORMULARIO ── */}
        {activeTab === 'form' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="bg-animor-card p-6 md:p-8 border border-animor-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Columna izquierda — imagen */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] uppercase tracking-widest text-animor-muted font-medium">
                Foto del producto
              </label>
              <div className="relative aspect-[3/4] border-2 border-dashed border-animor-border hover:border-animor-primary transition-colors bg-animor-bg/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group rounded-sm">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                      <Upload size={24} />
                      <span className="text-xs uppercase tracking-widest">Cambiar foto</span>
                    </div>
                  </>
                ) : (
                  <div className="text-animor-muted text-center p-8">
                    <ImageIcon size={36} className="mx-auto mb-4 opacity-40" />
                    <p className="text-sm font-light">Tocá para subir una foto</p>
                    <p className="text-[10px] mt-1 text-animor-muted/60 uppercase tracking-widest">JPG, PNG, WEBP</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required={!formData.id}
                />
              </div>

              {/* Tip mobile */}
              <p className="text-[10px] text-animor-muted/70 text-center uppercase tracking-widest">
                Podés subir desde tu galería o cámara
              </p>
            </div>

            {/* Columna derecha — datos */}
            <div className="space-y-5">

              <InputField label="Nombre de la Prenda" type="text" required value={formData.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Remera Soho" />

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Precio Regular ($)" type="number" required value={formData.price} onChange={e => set('price', e.target.value)} placeholder="15000" />
                
                {/* ── SELECTOR / INPUT DE CATEGORÍA CON DATALIST ── */}
                <div>
                  <InputField 
                    label="Categoría" 
                    type="text" 
                    required 
                    value={formData.category} 
                    onChange={e => set('category', e.target.value)} 
                    placeholder="Escribí o elegí" 
                    list="category-options" 
                  />
                  <datalist id="category-options">
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <InputField label="Talles (separados por coma)" type="text" value={formData.sizes} onChange={e => set('sizes', e.target.value)} placeholder="Único, S, M, L, XL" />

              {/* Colores */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-animor-muted block mb-3">
                  Colores <span className="text-animor-muted/50">(Opcional)</span>
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-animor-border shadow-sm cursor-pointer flex-shrink-0">
                    <input
                      type="color"
                      value={tempColor}
                      onChange={e => setTempColor(e.target.value)}
                      className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="flex items-center gap-1.5 px-4 py-2 border border-animor-text text-animor-text text-xs uppercase tracking-widest hover:bg-animor-text hover:text-white transition-colors"
                  >
                    <Plus size={13} /> Agregar
                  </button>
                </div>
                {selectedColors.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-animor-bg border border-animor-border rounded-sm">
                    {selectedColors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-animor-card border border-animor-border pl-1.5 pr-2 py-1 rounded-full shadow-sm">
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-animor-muted font-mono">{color}</span>
                        <button type="button" onClick={() => setSelectedColors(selectedColors.filter(c => c !== color))} className="ml-0.5 text-animor-muted hover:text-red-400 transition-colors">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkboxes + oferta + stock */}
              <div className="bg-animor-bg p-4 border border-animor-border rounded-sm space-y-4">

                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={formData.isNew} onChange={e => set('isNew', e.target.checked)} className="accent-animor-primary w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-animor-text">¿Es Nuevo?</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={formData.isSale} onChange={e => set('isSale', e.target.checked)} className="accent-animor-primary w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-animor-text">¿En Oferta?</span>
                  </label>
                  {/* 👇 CHECKBOX DE DESTACADO 👇 */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={formData.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="accent-animor-primary w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest text-animor-text flex items-center gap-1">¿Destacado? <Star size={12}/></span>
                  </label>
                </div>

                <AnimatePresence>
                  {formData.isSale && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <input
                        type="number"
                        required={formData.isSale}
                        value={formData.salePrice}
                        onChange={e => set('salePrice', e.target.value)}
                        placeholder="Precio de oferta ($)"
                        className="w-full bg-transparent border-b border-animor-cta pb-2 outline-none text-animor-cta font-medium text-sm placeholder:text-animor-cta/40 transition-colors"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between border-t border-animor-border pt-4 gap-3 flex-wrap">
                  <span className="text-xs font-medium text-animor-text uppercase tracking-widest">Estado de stock:</span>
                  <select
                    value={formData.stock}
                    onChange={e => set('stock', e.target.value)}
                    className="bg-animor-card text-sm border border-animor-border px-3 py-2 outline-none focus:border-animor-primary text-animor-text rounded-sm"
                  >
                    <option value="available">✅ Disponible</option>
                    <option value="low">⚠️ Últimas unidades</option>
                    <option value="out">❌ Agotado</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || (!imagePreview && !formData.id)}
                className="w-full py-4 mt-2 flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSubmitting ? 'var(--color-animor-primary)' : 'var(--color-animor-text)',
                  color: '#fff',
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                      <Upload size={17} />
                    </motion.span>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <CheckCircle size={17} />
                    {formData.id ? 'Guardar Cambios' : 'Subir Producto'}
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* ── MODAL ÉXITO ── */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.92, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="bg-animor-card p-8 md:p-10 shadow-2xl border border-animor-border w-full max-w-sm text-center"
              >
                {/* Ícono animado */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                >
                  <CheckCircle size={30} />
                </motion.div>

                <h2 className="font-serif text-2xl text-animor-text mb-2">
                  {formData.id ? '¡Cambios guardados!' : '¡Producto subido!'}
                </h2>
                <p className="text-sm text-animor-muted font-light mb-8 leading-relaxed">
                  El producto ya está en tu base de datos y la foto se guardó de forma segura en Google Drive.
                </p>

                <button
                  onClick={() => { setShowSuccessModal(false); window.location.reload(); }}
                  className="w-full bg-animor-text text-white py-3.5 uppercase tracking-widest text-xs hover:bg-animor-primary transition-colors"
                >
                  Continuar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};