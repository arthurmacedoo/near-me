import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";
import AccountAvatarButton from "@/components/AccountAvatarButton";

interface SearchHeaderProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
  onBack: () => void;
  showBack?: boolean;
}

const SearchHeader = ({ query, onQueryChange, onSearch, onBack, showBack }: SearchHeaderProps) => {
  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3 flex items-center gap-2">
      {showBack && (
        <button onClick={onBack} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={22} />
        </button>
      )}
      <form
        onSubmit={(e) => { e.preventDefault(); onSearch(); }}
        className="flex-1 relative"
      >
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar produto..."
          className="pl-10 bg-secondary border-0 h-11 rounded-xl text-sm"
        />
      </form>
      <ThemeToggle />
      <AccountAvatarButton />
    </div>
  );
};

export default SearchHeader;
