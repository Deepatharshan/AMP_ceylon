export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
}

export const CATEGORIES = [
  "All Collections",
  "Floral Arrangements",
  "Acrylic Flowers",
  "Plants & Foliage",
  "Candles & Scent",
  "Rattan & Woven",
  "Holiday Decor"
];

export const SPECIFICATIONS = [
  "UV Resistant",
  "In Stock",
  "Fire Retardant",
  "Custom Colors"
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Antique Rose Peony",
    sku: "SKU: ART-425-RP",
    image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop",
    category: "Floral Arrangements"
  },
  {
    id: "2",
    name: "Modern Calla Ensemble",
    sku: "SKU: MO-721-WL",
    image: "https://images.unsplash.com/photo-1591040854298-5c088898b9de?q=80&w=800&auto=format&fit=crop",
    category: "Floral Arrangements"
  },
  {
    id: "3",
    name: "Midnight Hydrangea",
    sku: "SKU: HO-560-MD",
    image: "https://images.unsplash.com/photo-1507421884488-8255df599c9c?q=80&w=800&auto=format&fit=crop",
    category: "Floral Arrangements"
  },
  {
    id: "4",
    name: "Rustic Provencal Lavender",
    sku: "SKU: RL-104-LV",
    image: "https://images.unsplash.com/photo-1463130456064-07d0f10b771e?q=80&w=800&auto=format&fit=crop",
    category: "Plants & Foliage"
  },
  {
    id: "5",
    name: "Graceful Stargazer Lily",
    sku: "SKU: SL-552-WH",
    image: "https://images.unsplash.com/photo-1563241598-646bc5683794?q=80&w=800&auto=format&fit=crop",
    category: "Floral Arrangements"
  },
  {
    id: "6",
    name: "Desert Bloom Succulents",
    sku: "SKU: DS-329-MX",
    image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=800&auto=format&fit=crop",
    category: "Plants & Foliage"
  },
  {
    id: "7",
    name: "Acrylic Lotus Centerpiece",
    sku: "SKU: AL-991-CL",
    image: "https://images.unsplash.com/photo-1579730248882-7476839352e0?q=80&w=800&auto=format&fit=crop",
    category: "Acrylic Flowers"
  },
  {
    id: "8",
    name: "Woven Rattan Pampas",
    sku: "SKU: WR-112-NT",
    image: "https://images.unsplash.com/photo-1509315354972-2710360a7e58?q=80&w=800&auto=format&fit=crop",
    category: "Rattan & Woven"
  },
  {
    id: "9",
    name: "Winter Berry Garland",
    sku: "SKU: HD-884-RD",
    image: "https://images.unsplash.com/photo-1512413914493-27038e4a9e22?q=80&w=800&auto=format&fit=crop",
    category: "Holiday Decor"
  }
];
