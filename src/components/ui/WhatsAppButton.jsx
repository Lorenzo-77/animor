import { useState } from "react";

const WaIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

export const WhatsAppButton = ({ product, isIconOnly = false }) => {
  const phoneNumber = "5491100000000";
  const [active, setActive] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  const handleClick = () => {
    setActive(true);
    setTimeout(() => setActive(false), 600);

    const message = `Hola, me interesa este artículo de ANIMOR: *${product.title}* — $${product.price}. ¿Está disponible?`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  /* ── Variante icono ─────────────────────── */
  if (isIconOnly) {
    return (
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          className="relative p-2.5 rounded-full border border-animor-border bg-animor-card text-animor-muted overflow-hidden"
          style={{
            transition: "color 0.2s, border-color 0.2s, box-shadow 0.2s",
            ...(tooltip && {
              color: "#25D366",
              borderColor: "#25D366",
              boxShadow: "0 0 0 3px rgba(37,211,102,0.12)",
            }),
          }}
          aria-label="Consultar por WhatsApp"
        >
          <WaIcon size={18} />
        </button>

        {/* Tooltip */}
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-medium text-animor-card bg-animor-text px-2 py-1 rounded whitespace-nowrap pointer-events-none"
          style={{
            opacity: tooltip ? 1 : 0,
            transform: `translateX(-50%) translateY(${tooltip ? "0" : "4px"})`,
            transition: "opacity 0.2s ease, transform 0.2s ease",
          }}
        >
          Consultar
        </span>
      </div>
    );
  }

  /* ── Variante completa ──────────────────── */
  return (
    <button
      onClick={handleClick}
      className="relative w-full overflow-hidden group"
      style={{
        padding: "0.7rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        backgroundColor: active ? "#1fa855" : "#25D366",
        color: "#fff",
        fontSize: "0.7rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontWeight: 500,
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.25s ease, transform 0.15s ease",
        transform: active ? "scale(0.98)" : "scale(1)",
      }}
    >
      {/* Hover overlay */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
          transform: "translateX(-100%)",
          transition: "transform 0.5s ease",
        }}
        // el efecto de sweep se activa con CSS puro vía group-hover en tailwind
      />

      <WaIcon size={15} />
      <span>Consultar disponibilidad</span>

      {/* Flecha sutil */}
      <span
        className="ml-1 opacity-60"
        style={{ fontSize: "0.75rem", transition: "transform 0.2s ease" }}
      >
        →
      </span>

      {/* Ripple al click */}
      {active && (
        <span
          className="absolute inset-0 rounded-full bg-white/20 pointer-events-none"
          style={{ animation: "ripple 0.6s ease-out forwards" }}
        />
      )}

      <style>{`
        @keyframes ripple {
          from { transform: scale(0); opacity: 1; }
          to   { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </button>
  );
};