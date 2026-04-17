export type Location = {
  district: string;
  state: string;
  address?: string;
};

export type Seller = {
  id: string; // This is the MongoDB ObjectId as a string
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
};

export type Listing = {
  id: string; // This is the MongoDB ObjectId as a string
  title: string;
  brand: string;
  model: string;
  variant: {
    ram: number;
    storage: number;
    color: string;
  };
  price: number;
  isNegotiable: boolean;
  condition: "new" | "like_new" | "good" | "fair";
  description: string;
  images: string[];
  location: Location;
  purchaseYear?: number;
  seller: Seller;
  isBoosted: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  status?: 'active' | 'sold' | 'flagged';
};

export interface SearchParams {
  q?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  ram?: string;
  storage?: string;
  district?: string;
  limit?: number;
  sellerId?: string;
}

export const BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Realme",
  "Oppo",
  "Vivo",
  "Nothing",
  "Asus",
];
export const CONDITIONS: { value: Listing["condition"]; label: string }[] = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];
export const RAM_OPTIONS = [2, 4, 6, 8, 12, 16];
export const STORAGE_OPTIONS = [32, 64, 128, 256, 512, 1024];
