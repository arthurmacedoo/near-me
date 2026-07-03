import { useState, useMemo } from "react";
import { List, Map } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";
import SearchHeader from "@/components/SearchHeader";
import FilterBar, { type SortMode } from "@/components/FilterBar";
import StoreCard from "@/components/StoreCard";
import PurchaseModal from "@/components/PurchaseModal";
import MapViewPlaceholder from "@/components/MapViewPlaceholder";
import EmptyResults from "@/components/EmptyResults";
import CreateListingFAB from "@/components/CreateListingFAB";
import { useSefazSimulator } from "@/hooks/useSefazSimulator";
import {
  type Store,
} from "@/data/mockData";

type ViewMode = "list" | "map";
type StoreResult = Store & { matchedProduct: { name: string; price: number; quantity: number } };

const Index = () => {
  const { searchStores } = useSefazSimulator();
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [locationStatus, setLocationStatus] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("distance");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedStore, setSelectedStore] = useState<StoreResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const productResults = useMemo(() => {
    if (!searchedQuery) return [];
    let r = searchStores(searchedQuery);
    if (sortMode === "available") {
      r = r.filter((s) => s.isOpen);
    }
    return [...r].sort((a, b) =>
      sortMode === "price"
        ? a.matchedProduct.price - b.matchedProduct.price
        : a.distanceKm - b.distanceKm
    );
  }, [searchedQuery, sortMode]);

  const bestPrice = useMemo(
    () =>
      productResults.length
        ? Math.min(...productResults.map((s) => s.matchedProduct.price))
        : null,
    [productResults]
  );

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchedQuery(query.trim());
    setHasSearched(true);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocalização não suportada");
      return;
    }
    setLocationStatus("Localizando...");
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus("Localização detectada ✓"),
      () => setLocationStatus("Erro ao localizar"),
      { timeout: 10000 }
    );
  };

  const handleBack = () => {
    setHasSearched(false);
    setSearchedQuery("");
    setQuery("");
  };

  if (!hasSearched) {
    return (
      <>
        <WelcomeScreen
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onLocate={handleLocate}
          locationStatus={locationStatus}
        />
        <CreateListingFAB />
      </>
    );
  }

  const resultsLabel = `${productResults.length} resultado${productResults.length !== 1 ? "s" : ""} para "${searchedQuery}"`;

  return (
    <div className="min-h-screen bg-background pb-6">
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onBack={handleBack}
        showBack
      />

      {/* Filter + view toggle */}
      <div className="flex items-center justify-between pr-4 mt-2">
        <FilterBar active={sortMode} onChange={setSortMode} />
        <div className="flex bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "map" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <Map size={18} />
          </button>
        </div>
      </div>

      <p className="px-4 py-2 text-xs text-muted-foreground">{resultsLabel}</p>

      {/* Content */}
      {viewMode === "list" ? (
        <div className="px-4 space-y-3">
          {productResults.length === 0 ? (
            <EmptyResults
              query={searchedQuery}
              onPickCategory={(q) => {
                setQuery(q);
                setSearchedQuery(q);
              }}
            />
          ) : (
            productResults.map((store) => (
              <StoreCard
                key={`${store.id}-${store.matchedProduct.name}`}
                store={store}
                isBestPrice={bestPrice !== null && store.matchedProduct.price === bestPrice}
                onClick={() => setSelectedStore(store)}
              />
            ))
          )}
        </div>
      ) : productResults.length === 0 ? (
        <EmptyResults
          query={searchedQuery}
          onPickCategory={(q) => {
            setQuery(q);
            setSearchedQuery(q);
          }}
        />
      ) : (
        <MapViewPlaceholder stores={productResults} onSelect={setSelectedStore} />
      )}

      <PurchaseModal store={selectedStore} onClose={() => setSelectedStore(null)} />
      <CreateListingFAB />
    </div>
  );
};

export default Index;
