// ─── SkeletonCard ────────────────────────────────────────────────────────────
export const SkeletonCard = () => {
  return (
    <div className="flex flex-col bg-animor-card border border-animor-border overflow-hidden">
      {/* Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-animor-border/30">
        {/* Shimmer sweep */}
        <div
          className="absolute inset-0 -translate-x-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
            animation: "shimmer 1.6s infinite ease-in-out",
          }}
        />
        {/* Badge de esquina simulado */}
        <div className="absolute top-3 left-3 h-5 w-12 rounded-full bg-animor-border/50" />
        {/* Botón favorito simulado */}
        <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-animor-border/50" />
      </div>

      <div className="p-3 md:p-5 space-y-3">
        {/* Categoría */}
        <div className="h-2.5 w-1/4 rounded-full bg-animor-border/50" />

        {/* Nombre del producto — dos líneas */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-animor-border/40" />
          <div className="h-4 w-3/4 rounded-full bg-animor-border/40" />
        </div>

        {/* Colores simulados */}
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 w-4 rounded-full bg-animor-border/50"
            />
          ))}
        </div>

        {/* Tallas simuladas */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-6 w-8 rounded bg-animor-border/35"
            />
          ))}
        </div>

        {/* Precio */}
        <div className="flex items-center gap-3 pt-1">
          <div className="h-5 w-20 rounded-full bg-animor-border/50" />
          <div className="h-4 w-14 rounded-full bg-animor-border/30" />
        </div>

        {/* Botón CTA */}
        <div className="h-10 w-full rounded-sm bg-animor-border/40 mt-1" />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
