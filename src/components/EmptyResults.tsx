import { SearchX, Car, UtensilsCrossed, Headphones, Coffee, Sparkles, Wrench } from "lucide-react";

const POPULAR = [
  { label: "Automotivo", icon: Car, query: "Pneu" },
  { label: "Alimentos", icon: UtensilsCrossed, query: "Leite" },
  { label: "Eletrônicos", icon: Headphones, query: "Fone" },
  { label: "Café & Bebidas", icon: Coffee, query: "Café" },
  { label: "Higiene", icon: Sparkles, query: "Shampoo" },
  { label: "Limpeza", icon: Wrench, query: "Detergente" },
];

interface EmptyResultsProps {
  query: string;
  onPickCategory: (query: string) => void;
}

const EmptyResults = ({ query, onPickCategory }: EmptyResultsProps) => {
  return (
    <div className="px-4 py-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <SearchX size={28} className="text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        Nenhum resultado para “{query}”
      </h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        Não encontramos esse item por perto. Que tal explorar uma das categorias populares?
      </p>

      <div className="w-full mt-6 grid grid-cols-2 gap-3 max-w-md">
        {POPULAR.map(({ label, icon: Icon, query: q }) => (
          <button
            key={label}
            onClick={() => onPickCategory(q)}
            className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card hover:border-primary hover:bg-primary/5 active:scale-[0.98] transition-all text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyResults;
