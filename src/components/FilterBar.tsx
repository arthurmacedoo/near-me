import { ArrowDownNarrowWide, MapPinned, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortMode = "price" | "distance" | "available";

interface FilterBarProps {
  active: SortMode;
  onChange: (mode: SortMode) => void;
}

const FilterBar = ({ active, onChange }: FilterBarProps) => {
  return (
    <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
      <Button
        variant={active === "distance" ? "default" : "outline"}
        size="sm"
        className="rounded-full text-xs gap-1.5 shrink-0"
        onClick={() => onChange("distance")}
      >
        <MapPinned size={14} /> Mais Perto
      </Button>
      <Button
        variant={active === "price" ? "default" : "outline"}
        size="sm"
        className="rounded-full text-xs gap-1.5 shrink-0"
        onClick={() => onChange("price")}
      >
        <ArrowDownNarrowWide size={14} /> Mais Barato
      </Button>
      <Button
        variant={active === "available" ? "default" : "outline"}
        size="sm"
        className="rounded-full text-xs gap-1.5 shrink-0"
        onClick={() => onChange("available")}
      >
        <Zap size={14} /> Disponível Agora
      </Button>
    </div>
  );
};

export default FilterBar;
