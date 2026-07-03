import { useEffect, useState } from "react";
import { Navigation2, Plus, Minus, MapPin, Clock, BadgeCheck, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Store } from "@/data/mockData";

type StoreResult = Store & { matchedProduct: { name: string; price: number; quantity: number } };

interface MapViewPlaceholderProps {
  stores: StoreResult[];
  onSelect: (store: StoreResult) => void;
}

const PIN_POSITIONS = [
  { top: "22%", left: "30%" },
  { top: "34%", left: "64%" },
  { top: "54%", left: "24%" },
  { top: "46%", left: "76%" },
  { top: "68%", left: "50%" },
  { top: "76%", left: "72%" },
  { top: "28%", left: "82%" },
];

const MapViewPlaceholder = ({ stores, onSelect }: MapViewPlaceholderProps) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const cheapest = stores.length
    ? Math.min(...stores.map((s) => s.matchedProduct.price))
    : null;

  useEffect(() => {
    setActiveIdx(null);
  }, [stores]);

  const activeStore = activeIdx !== null ? stores[activeIdx] : null;
  const activePos = activeIdx !== null ? PIN_POSITIONS[activeIdx % PIN_POSITIONS.length] : null;

  const formatPrice = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatKm = (n: number) => `${n.toFixed(1).replace(".", ",")} km`;

  return (
    <div className="mx-4">
      <div className="relative w-full h-[68vh] rounded-2xl overflow-hidden border border-border shadow-lg bg-[#eef2f7] dark:bg-[#0b1220]">
        {/* Light map base (Positron-inspired) */}
        <div className="absolute inset-0" onClick={() => setActiveIdx(null)}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#f5f7fa_0%,_#e6ebf2_75%)] dark:bg-[radial-gradient(ellipse_at_center,_#15233a_0%,_#0b1220_70%)]" />

          {/* Street network */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 400"
            preserveAspectRatio="none"
          >
            {/* Blocks (slightly darker than base for subtle definition) */}
            <g className="text-[#e2e8f0] dark:text-[#0f1b2d]" fill="currentColor">
              <rect x="40" y="50" width="100" height="78" rx="6" />
              <rect x="210" y="190" width="140" height="90" rx="6" />
              <rect x="50" y="250" width="90" height="100" rx="6" />
              <rect x="260" y="60" width="90" height="60" rx="6" />
            </g>

            {/* Water */}
            <path
              d="M 0 320 Q 100 300 200 330 T 400 320 L 400 400 L 0 400 Z"
              className="fill-[#d6e6f3] dark:fill-[#0a2030]"
              opacity="0.85"
            />

            {/* Streets — thin */}
            <g className="stroke-[#d8dee8] dark:stroke-[#1e2f4a]" strokeWidth="1.2" opacity="0.95">
              <line x1="0" y1="40" x2="400" y2="40" />
              <line x1="0" y1="150" x2="400" y2="150" />
              <line x1="0" y1="240" x2="400" y2="240" />
              <line x1="60" y1="0" x2="60" y2="400" />
              <line x1="180" y1="0" x2="180" y2="400" />
              <line x1="370" y1="0" x2="370" y2="400" />
            </g>
            {/* Streets — main avenues */}
            <g className="stroke-[#c4cdd9] dark:stroke-[#2a3e60]" strokeWidth="2.5" opacity="0.95">
              <line x1="0" y1="180" x2="400" y2="180" />
              <line x1="240" y1="0" x2="240" y2="400" />
            </g>
            {/* Route line — blue */}
            <path
              d="M 0 380 L 400 20"
              className="stroke-primary"
              strokeWidth="2"
              fill="none"
              opacity="0.55"
              strokeDasharray="0"
            />
          </svg>

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_60%,_rgba(15,23,42,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.45)_100%)] pointer-events-none" />
        </div>

        {/* User location — pulsing blue dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/30 rounded-full animate-ping" />
            <div className="absolute -inset-2 bg-primary/40 rounded-full blur-sm" />
            <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_12px_rgba(59,130,246,0.8)] relative" />
          </div>
        </div>

        {/* Price pins */}
        {stores.map((store, i) => {
          const pos = PIN_POSITIONS[i % PIN_POSITIONS.length];
          const isBest = cheapest !== null && store.matchedProduct.price === cheapest;
          const isActive = activeIdx === i;
          return (
            <button
              key={`${store.id}-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(i);
              }}
              className="absolute z-20 flex flex-col items-center group transition-all duration-300 ease-out"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `translate(-50%, -100%) scale(${isActive ? 1.08 : 1})`,
              }}
            >
              {isBest && (
                <span className="mb-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-success text-success-foreground shadow-md whitespace-nowrap">
                  Melhor Preço
                </span>
              )}
              <div
                className={`relative px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap shadow-lg transition-all flex items-center gap-1.5 ${
                  isBest
                    ? "bg-success text-success-foreground shadow-[0_4px_14px_rgba(34,197,94,0.45)]"
                    : "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(59,130,246,0.4)]"
                } ${isActive ? "ring-2 ring-offset-2 ring-offset-transparent ring-foreground/20" : ""}`}
              >
                <span>{formatPrice(store.matchedProduct.price)}</span>
                <span className="opacity-80">•</span>
                <span className="font-semibold">{formatKm(store.distanceKm)}</span>
                <div
                  className={`absolute left-1/2 -bottom-1 -translate-x-1/2 w-2.5 h-2.5 rotate-45 ${
                    isBest ? "bg-success" : "bg-primary"
                  }`}
                />
              </div>
            </button>
          );
        })}

        {/* Focus ring */}
        {activePos && (
          <div
            className="absolute z-[15] pointer-events-none"
            style={{ top: activePos.top, left: activePos.left, transform: "translate(-50%, -50%)" }}
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 animate-pulse" />
          </div>
        )}

        {/* Map controls */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          <button
            className="bg-card/95 backdrop-blur border border-border shadow-md rounded-lg w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            aria-label="Aproximar"
          >
            <Plus size={16} />
          </button>
          <button
            className="bg-card/95 backdrop-blur border border-border shadow-md rounded-lg w-9 h-9 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            aria-label="Afastar"
          >
            <Minus size={16} />
          </button>
        </div>

        <button
          className="absolute bottom-3 right-3 z-30 bg-primary text-primary-foreground shadow-lg rounded-full w-11 h-11 flex items-center justify-center hover:brightness-110 transition"
          aria-label="Centralizar na minha localização"
          onClick={(e) => {
            e.stopPropagation();
            setActiveIdx(null);
          }}
        >
          <Navigation2 size={18} />
        </button>

        {/* Counter chip */}
        <div className="absolute top-3 left-3 z-30 bg-card/95 backdrop-blur border border-border rounded-full px-3 py-1 text-[11px] text-foreground/80 shadow-sm">
          {stores.length} loja{stores.length !== 1 ? "s" : ""} no mapa
        </div>

        {/* Floating bottom sheet */}
        {activeStore && (
          <div
            className="absolute left-3 right-3 bottom-3 z-40 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">
                      {activeStore.name}
                    </h3>
                    {cheapest !== null &&
                      activeStore.matchedProduct.price === cheapest && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
                          <BadgeCheck size={11} /> Melhor Preço
                        </span>
                      )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">
                    {activeStore.matchedProduct.name}
                  </p>
                </div>
                <button
                  onClick={() => setActiveIdx(null)}
                  className="text-muted-foreground hover:text-foreground p-1 -m-1 rounded-md"
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-foreground/80">
                  <MapPin size={12} /> a {formatKm(activeStore.distanceKm)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                    activeStore.isOpen
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Clock size={12} /> {activeStore.isOpen ? "Aberto agora" : "Fechado"}
                </span>
                <span className="ml-auto text-lg font-bold text-foreground">
                  {formatPrice(activeStore.matchedProduct.price)}
                </span>
              </div>

              <Button
                onClick={() => onSelect(activeStore)}
                className="w-full h-11 mt-3 rounded-xl gap-2 font-semibold"
              >
                <ShoppingBag size={16} />
                Comprar agora
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapViewPlaceholder;
