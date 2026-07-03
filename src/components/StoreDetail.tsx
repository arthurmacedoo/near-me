import { MapPin, Phone, Navigation, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Store } from "@/data/mockData";

interface StoreDetailProps {
  store: Store & { matchedProduct: { name: string; price: number } };
  onClose: () => void;
}

const StoreDetail = ({ store, onClose }: StoreDetailProps) => {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{store.name}</h2>
            <span
              className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                store.isOpen
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {store.isOpen ? "Aberto" : "Fechado"} · {store.openHours}
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X size={20} />
          </button>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 mb-4">
          <p className="text-sm text-muted-foreground">{store.matchedProduct.name}</p>
          <p className="text-2xl font-bold text-primary mt-1">
            R$ {store.matchedProduct.price.toFixed(2).replace(".", ",")}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-sm">
            <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
            <span className="text-foreground">{store.address}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-muted-foreground shrink-0" />
            <span className="text-foreground">{store.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock size={16} className="text-muted-foreground shrink-0" />
            <span className="text-foreground">{store.distanceKm} km de você</span>
          </div>
        </div>

        <Button asChild className="w-full h-12 rounded-xl text-base font-semibold gap-2">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation size={18} /> Como Chegar
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StoreDetail;
