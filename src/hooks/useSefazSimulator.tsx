import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import { Store, stores as initialStores, products } from "@/data/mockData";

export interface InvoiceLog {
  id: string;
  type: "NF-e" | "NFC-e";
  storeName: string;
  productName: string;
  quantity: number;
  price: number;
  timestamp: Date;
  xmlMock: string;
}

interface SefazContextValue {
  stores: Store[];
  searchStores: (query: string) => (Store & { matchedProduct: { name: string; price: number; quantity: number } })[];
  simulateNfeReceipt: (storeId: string, productId: string, qty: number, wholesalePrice: number) => void;
  simulateNfceSale: (storeId: string, productId: string, qty: number, salePrice: number) => void;
  invoiceLogs: InvoiceLog[];
  clearLogs: () => void;
}

const SefazContext = createContext<SefazContextValue | null>(null);

export const SefazProvider = ({ children }: { children: ReactNode }) => {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [invoiceLogs, setInvoiceLogs] = useState<InvoiceLog[]>([]);

  const searchStoresDynamic = useCallback((query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const matchedProducts = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );

    if (matchedProducts.length === 0) return [];

    const results: (Store & { matchedProduct: { name: string; price: number; quantity: number } })[] = [];

    for (const store of stores) {
      for (const mp of matchedProducts) {
        const sp = store.products.find((p) => p.productId === mp.id);
        if (sp) {
          results.push({
            ...store,
            matchedProduct: { name: mp.name, price: sp.price, quantity: sp.quantity },
          });
        }
      }
    }
    return results;
  }, [stores]);

  const simulateNfeReceipt = useCallback((storeId: string, productId: string, qty: number, wholesalePrice: number) => {
    setStores((prevStores) =>
      prevStores.map((s) => {
        if (s.id !== storeId) return s;
        
        const hasProduct = s.products.some((p) => p.productId === productId);
        let updatedProducts;
        if (hasProduct) {
          updatedProducts = s.products.map((p) =>
            p.productId === productId
              ? { ...p, quantity: p.quantity + qty }
              : p
          );
        } else {
          updatedProducts = [...s.products, { productId, price: wholesalePrice * 1.3, quantity: qty }];
        }
        return { ...s, products: updatedProducts };
      })
    );

    const store = stores.find((s) => s.id === storeId);
    const product = products.find((p) => p.id === productId);
    const xmlMock = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe352607...">
      <emit>
        <CNPJ>12.345.678/0001-90</CNPJ>
        <xNome>Distribuidor Brasil LTDA</xNome>
      </emit>
      <dest>
        <CNPJ>98.765.432/0001-00</CNPJ>
        <xNome>${store?.name ?? "Lojista"}</xNome>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>${productId}</cProd>
          <cEAN>${productId === 'p1' ? '7891000000011' : '7891000000022'}</cEAN>
          <xProd>${product?.name ?? "Produto"}</xProd>
          <qCom>${qty}.00</qCom>
          <vUnCom>${wholesalePrice.toFixed(2)}</vUnCom>
        </prod>
      </det>
    </infNFe>
  </NFe>
</nfeProc>`;

    setInvoiceLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "NF-e",
        storeName: store?.name ?? "Loja",
        productName: product?.name ?? "Produto",
        quantity: qty,
        price: wholesalePrice,
        timestamp: new Date(),
        xmlMock,
      },
      ...prev,
    ]);
  }, [stores]);

  const simulateNfceSale = useCallback((storeId: string, productId: string, qty: number, salePrice: number) => {
    setStores((prevStores) =>
      prevStores.map((s) => {
        if (s.id !== storeId) return s;
        return {
          ...s,
          products: s.products.map((p) =>
            p.productId === productId
              ? { ...p, quantity: Math.max(0, p.quantity - qty), price: salePrice }
              : p
          ),
        };
      })
    );

    const store = stores.find((s) => s.id === storeId);
    const product = products.find((p) => p.id === productId);
    const xmlMock = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFCe352607...">
      <emit>
        <CNPJ>98.765.432/0001-00</CNPJ>
        <xNome>${store?.name ?? "Lojista"}</xNome>
      </emit>
      <dest>
        <CPF>***.***.***-**</CPF>
        <xNome>Consumidor Final</xNome>
      </dest>
      <det nItem="1">
        <prod>
          <cProd>${productId}</cProd>
          <cEAN>${productId === 'p1' ? '7891000000011' : '7891000000022'}</cEAN>
          <xProd>${product?.name ?? "Produto"}</xProd>
          <qCom>${qty}.00</qCom>
          <vUnCom>${salePrice.toFixed(2)}</vUnCom>
        </prod>
      </det>
    </infNFe>
  </NFe>
</nfeProc>`;

    setInvoiceLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: "NFC-e",
        storeName: store?.name ?? "Loja",
        productName: product?.name ?? "Produto",
        quantity: qty,
        price: salePrice,
        timestamp: new Date(),
        xmlMock,
      },
      ...prev,
    ]);
  }, [stores]);

  const clearLogs = useCallback(() => {
    setInvoiceLogs([]);
  }, []);

  return (
    <SefazContext.Provider
      value={{
        stores,
        searchStores: searchStoresDynamic,
        simulateNfeReceipt,
        simulateNfceSale,
        invoiceLogs,
        clearLogs,
      }}
    >
      {children}
    </SefazContext.Provider>
  );
};

export const useSefazSimulator = () => {
  const ctx = useContext(SefazContext);
  if (!ctx) throw new Error("useSefazSimulator must be used within SefazProvider");
  return ctx;
};
