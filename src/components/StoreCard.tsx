import { MapPin, Clock, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Store } from "@/data/mockData";

interface StoreCardProps {
  store: Store & { matchedProduct: { name: string; price: number; quantity: number } };
  onClick: () => void;
  isBestPrice?: boolean;
}

const StoreCard = ({ store, onClick, isBestPrice }: StoreCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="p-4 cursor-pointer hover:shadow-md transition-all border border-border bg-card active:scale-[0.98]"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground truncate">{store.name}</h3>
            {isBestPrice && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">
                <BadgeCheck size={11} /> Melhor Preço
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{store.matchedProduct.name}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-foreground/80">
              <MapPin size={12} /> a {store.distanceKm.toFixed(1).replace(".", ",")} km
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {store.openHours}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
              store.matchedProduct.quantity > 5 
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                : store.matchedProduct.quantity > 0
                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                : "bg-destructive/10 text-destructive"
            }`}>
              Estoque: {store.matchedProduct.quantity > 0 ? `${store.matchedProduct.quantity} un` : "Esgotado"}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-primary">
            R$ {store.matchedProduct.price.toFixed(2).replace(".", ",")}
          </p>
          <span
            className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              store.isOpen
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {store.isOpen ? "Aberto" : "Fechado"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StoreCard;
