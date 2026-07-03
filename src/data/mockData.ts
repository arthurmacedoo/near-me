export interface Product {
  id: string;
  name: string;
  category: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distanceKm: number;
  isOpen: boolean;
  openHours: string;
  supportsPickup: boolean;
  supportsDelivery: boolean;
  deliveryFee: number;
  products: { productId: string; price: number; quantity: number }[];
}

export const products: Product[] = [
  { id: "p1", name: "Pneu aro 15", category: "Automotivo" },
  { id: "p2", name: "Leite condensado", category: "Alimentos" },
  { id: "p3", name: "Fone Bluetooth", category: "Eletrônicos" },
  { id: "p4", name: "Café em grãos 500g", category: "Alimentos" },
  { id: "p5", name: "Óleo de motor 5W30", category: "Automotivo" },
  { id: "p6", name: "Shampoo anticaspa", category: "Higiene" },
  { id: "p7", name: "Pilha AA", category: "Eletrônicos" },
  { id: "p8", name: "Detergente líquido", category: "Limpeza" },
];

export const stores: Store[] = [
  {
    id: "s1",
    name: "Auto Center Express",
    address: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
    phone: "(11) 3456-7890",
    lat: -23.5615,
    lng: -46.6559,
    distanceKm: 0.8,
    isOpen: true,
    openHours: "08:00 - 20:00",
    supportsPickup: true,
    supportsDelivery: false,
    deliveryFee: 0,
    products: [
      { productId: "p1", price: 289.90, quantity: 15 },
      { productId: "p5", price: 45.90, quantity: 8 },
    ],
  },
  {
    id: "s2",
    name: "Supermercado Bom Preço",
    address: "Rua Augusta, 2340 - Cerqueira César, São Paulo - SP",
    phone: "(11) 2345-6789",
    lat: -23.5580,
    lng: -46.6620,
    distanceKm: 1.2,
    isOpen: true,
    openHours: "07:00 - 22:00",
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 7.90,
    products: [
      { productId: "p2", price: 6.49, quantity: 42 },
      { productId: "p4", price: 32.90, quantity: 12 },
      { productId: "p6", price: 18.90, quantity: 20 },
      { productId: "p8", price: 3.49, quantity: 50 },
    ],
  },
  {
    id: "s3",
    name: "TechMais Eletrônicos",
    address: "Rua Oscar Freire, 890 - Jardins, São Paulo - SP",
    phone: "(11) 9876-5432",
    lat: -23.5640,
    lng: -46.6700,
    distanceKm: 2.5,
    isOpen: false,
    openHours: "09:00 - 18:00",
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 12.00,
    products: [
      { productId: "p3", price: 79.90, quantity: 4 },
      { productId: "p7", price: 12.90, quantity: 30 },
    ],
  },
  {
    id: "s4",
    name: "Mega Atacadão",
    address: "Av. Rebouças, 3200 - Pinheiros, São Paulo - SP",
    phone: "(11) 5555-1234",
    lat: -23.5700,
    lng: -46.6800,
    distanceKm: 3.1,
    isOpen: true,
    openHours: "06:00 - 23:00",
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 9.90,
    products: [
      { productId: "p1", price: 259.90, quantity: 8 },
      { productId: "p2", price: 5.99, quantity: 100 },
      { productId: "p4", price: 28.50, quantity: 40 },
      { productId: "p5", price: 39.90, quantity: 15 },
      { productId: "p7", price: 9.90, quantity: 60 },
      { productId: "p8", price: 2.99, quantity: 120 },
    ],
  },
  {
    id: "s5",
    name: "Farmácia Vida & Saúde",
    address: "Rua Haddock Lobo, 1644 - Cerqueira César, São Paulo - SP",
    phone: "(11) 3333-4444",
    lat: -23.5560,
    lng: -46.6650,
    distanceKm: 1.8,
    isOpen: true,
    openHours: "08:00 - 21:00",
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 5.00,
    products: [
      { productId: "p6", price: 22.90, quantity: 18 },
      { productId: "p7", price: 14.50, quantity: 22 },
    ],
  },
];

export function searchStores(query: string): (Store & { matchedProduct: { name: string; price: number; quantity: number } })[] {
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
}
