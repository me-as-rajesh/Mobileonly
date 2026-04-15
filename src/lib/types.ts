import type { PlaceHolderImages } from "./placeholder-images";

export type Seller = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
};

export type Listing = {
  id: string;
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
  images: (typeof PlaceHolderImages)[number]["id"][];
  location: {
    city: string;
    state: string;
  };
  purchaseYear?: number;
  seller: Seller;
  isBoosted: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
};

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
