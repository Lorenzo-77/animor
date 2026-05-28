import { useState } from "react";

const PHONE   = "5492657317153";
const IG_URL  = "https://www.instagram.com/animor.vm/";
const MESSAGE = "Hola Animor! Quisiera recibir asesoramiento.";

export const FloatingWhatsApp = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">



      {/* Fila del botón WhatsApp + tooltip */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-medium text-animor-text bg-animor-card border border-animor-border px-3 py-1.5 rounded-full shadow-md whitespace-nowrap pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateX(0)" : "translateX(8px)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }}
        >
          ¿Necesitás ayuda?
        </span>

        <a
          href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
          style={{
            backgroundColor: "#25D366",
            color: "#fff",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            transform: hovered ? "scale(1.1)" : "scale(1)",
            boxShadow: hovered
              ? "0 8px 24px rgba(37,211,102,0.45)"
              : "0 4px 14px rgba(37,211,102,0.3)",
            animation: "floatIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
          aria-label="Contactar por WhatsApp"
        >
          {/* Ping */}
          <span
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "#25D366",
              animation: "waPing 2s cubic-bezier(0,0,0.2,1) infinite",
              opacity: 0,
            }}
          />
          {/* Badge */}
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-semibold bg-animor-cta text-white border-2 border-animor-bg"
            style={{ animation: "badgeBounce 3s ease-in-out infinite" }}
          >
            1
          </span>

          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </a>
      </div>

      <style>{`
        @keyframes waPing {
          0%   { transform: scale(1);   opacity: 0.5; }
          80%  { transform: scale(1.9); opacity: 0;   }
          100% { transform: scale(1.9); opacity: 0;   }
        }
        @keyframes floatIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes badgeBounce {
          0%, 100% { transform: translateY(0);    }
          50%      { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};