import { Search, MapPin, Locate, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import AccountAvatarButton from "@/components/AccountAvatarButton";

interface WelcomeScreenProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
  onLocate: () => void;
  locationStatus: string;
}

const suggestions = ["Pneu aro 15", "Leite condensado", "Fone Bluetooth", "Café em grãos"];

const WelcomeScreen = ({
  query,
  onQueryChange,
  onSearch,
  onLocate,
  locationStatus,
}: WelcomeScreenProps) => {
  const hasLocation = !!locationStatus && /detect|encontrad|localiz/i.test(locationStatus);

  return (
    <div className="relative flex flex-col min-h-screen bg-city-map transition-colors duration-300">
      <div className="flex justify-end items-center gap-2 px-4 pt-4 relative z-10">
        <ThemeToggle />
        <AccountAvatarButton />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-20 relative z-10">
        <div className="w-full max-w-md rounded-3xl border border-white/40 dark:border-white/5 bg-white/70 dark:bg-card/60 backdrop-blur-xl shadow-[0_20px_60px_-20px_hsl(220_40%_20%/0.25)] dark:shadow-[0_20px_60px_-20px_hsl(0_0%_0%/0.6)] p-7 sm:p-8 transition-colors duration-300">

          {/* Logo with radar rings */}
          <div className="flex justify-center mb-5">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2.4s" }} />
              <span className="absolute inset-2 rounded-full border border-primary/25" />
              <span className="absolute inset-4 rounded-full border border-primary/30" />
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary/30"
                style={{ background: "linear-gradient(135deg, hsl(217 91% 62%), hsl(224 85% 48%))" }}
              >
                <MapPin size={26} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-center text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Near Me
          </h1>
          <p className="text-center text-sm text-muted-foreground mt-1.5 mb-6">
            Encontre produtos perto de você
          </p>

          {/* Search */}
          <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="space-y-3">
            <div className="relative">
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="O que você procura?"
                className="pl-5 pr-12 h-12 rounded-2xl bg-slate-50/80 dark:bg-white/5 border-slate-200/70 dark:border-white/10 text-base focus-visible:ring-primary/40"
              />
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              type="submit"
              disabled={!query.trim()}
              className="w-full h-12 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 active:scale-[0.98] shadow-lg shadow-primary/25 transition-all"
            >
              Buscar
            </Button>
          </form>

          {/* Location status */}
          <button
            onClick={onLocate}
            className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {hasLocation ? (
              <>
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>{locationStatus}</span>
                <MapPin size={12} className="text-primary" />
              </>
            ) : (
              <>
                <Locate size={14} className="text-primary" />
                <span>{locationStatus || "Usar minha localização"}</span>
              </>
            )}
          </button>

          {/* Suggestions footer */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/5">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold text-center mb-3">
              Sugestões populares
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => onQueryChange(s)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-100/70 text-cyan-900 hover:bg-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-300 dark:hover:bg-cyan-500/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
