// ── CartDrawer.jsx ────────────────────────────────────────────────────────────
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WaIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
  </svg>
);

export const CartDrawer = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,   // agregá esta acción a tu CartContext si no existe
    total,
    totalItems,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const phoneNumber = "5492657317153";

  const handleCheckout = () => {
    let message = "Hola ANIMOR! Quiero consultar stock y finalizar este pedido:\n\n";
    cart.forEach(item => {
      message += `▫️ ${item.quantity}x ${item.title}${item.selectedSize ? ` (Talle ${item.selectedSize})` : ''} — $${(item.price * item.quantity).toLocaleString()}\n`;
    });
    message += `\n*Total estimado: $${total.toLocaleString()}*\n\n¡Gracias!`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Bloquear scroll del body cuando el drawer está abierto
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-animor-card z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-animor-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} strokeWidth={1.5} className="text-animor-primary" />
                <h2 className="font-serif text-xl text-animor-text">Tu Selección</h2>
                {totalItems > 0 && (
                  <span className="text-[10px] font-semibold bg-animor-primary/10 text-animor-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {totalItems} {totalItems === 1 ? 'pieza' : 'piezas'}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-animor-border/50 text-animor-muted hover:text-animor-text transition-colors"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                /* Empty state */
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full border border-animor-border flex items-center justify-center text-animor-border">
                    <ShoppingBag size={28} strokeWidth={1} />
                  </div>
                  <p className="font-serif text-lg text-animor-text">Tu selección está vacía</p>
                  <p className="text-animor-muted text-xs font-light leading-relaxed">
                    Explorá la colección y encontrá tus piezas favoritas.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-widest text-animor-muted border border-animor-border px-5 py-2.5 hover:border-animor-primary hover:text-animor-primary transition-colors"
                  >
                    Ver Colección <ArrowRight size={11} />
                  </button>
                </motion.div>
              ) : (
                <div className="px-5 py-4 flex flex-col gap-0">
                  <AnimatePresence initial={false}>
                    {cart.map(item => (
                      <motion.div
                        key={`${item.id}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 py-5 border-b border-animor-border last:border-0"
                      >
                        {/* Imagen */}
                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-animor-bg rounded-sm">
                          <img
                            src={item.images?.[0] ?? item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-animor-muted mb-0.5">
                              {item.category}
                            </p>
                            <h4 className="text-sm font-serif leading-snug line-clamp-2 text-animor-text">
                              {item.title}
                            </h4>
                            {item.selectedSize && (
                              <span className="inline-block mt-1.5 text-[9px] uppercase tracking-widest border border-animor-border px-2 py-0.5 text-animor-muted">
                                Talle {item.selectedSize}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Precio */}
                            <span className="font-medium text-animor-primary text-sm">
                              ${(Number(item.salePrice ?? item.price) * item.quantity).toLocaleString()}
                            </span>

                            <div className="flex items-center gap-3">
                              {/* Selector de cantidad */}
                              <div className="flex items-center border border-animor-border rounded-sm overflow-hidden">
                                <button
                                  onClick={() => updateQuantity?.(item.id, item.selectedSize, item.quantity - 1)}
                                  className="w-7 h-7 flex items-center justify-center text-animor-muted hover:bg-animor-border/50 transition-colors"
                                  aria-label="Reducir cantidad"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="w-7 h-7 flex items-center justify-center text-[11px] font-medium text-animor-text border-x border-animor-border">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity?.(item.id, item.selectedSize, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center text-animor-muted hover:bg-animor-border/50 transition-colors"
                                  aria-label="Aumentar cantidad"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              {/* Eliminar */}
                              <button
                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                                className="p-1.5 text-animor-muted hover:text-red-400 transition-colors"
                                aria-label="Eliminar producto"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="flex-shrink-0 border-t border-animor-border bg-animor-bg">
                {/* Desglose */}
                <div className="px-6 pt-5 pb-4 space-y-2">
                  <div className="flex justify-between text-xs text-animor-muted">
                    <span className="uppercase tracking-widest">Subtotal</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-animor-muted">
                    <span className="uppercase tracking-widest">Envío</span>
                    <span className="text-animor-primary">A confirmar</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-animor-border">
                    <span className="font-serif text-base text-animor-text">Total estimado</span>
                    <span className="font-semibold text-animor-primary text-lg">${total.toLocaleString()}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] text-white text-[11px] uppercase tracking-widest font-medium hover:brightness-105 transition-all duration-200 shadow-md"
                  >
                    <WaIcon size={15} />
                    Consultar y finalizar pedido
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full mt-2 py-3 text-[10px] uppercase tracking-widest text-animor-muted hover:text-animor-text transition-colors"
                  >
                    Seguir explorando
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};