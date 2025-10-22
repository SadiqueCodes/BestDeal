// Store Types
export type Store = 'amazon' | 'flipkart' | 'myntra' | 'ajio' | 'alibaba';

export interface StoreInfo {
  id: Store;
  name: string;
  displayName: string;
  color: string;
  logo?: string;
  url: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  model?: string;
  category: string;
  imageUrl: string;
  description?: string;
}

// Price Types
export interface Price {
  productId: string;
  store: Store;
  currentPrice: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  inStock: boolean;
  productUrl: string;
  lastUpdated: Date;
}

export interface PriceHistory {
  productId: string;
  store: Store;
  price: number;
  timestamp: Date;
}

export interface PriceTrend {
  productId: string;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  currentPrice: number;
  priceChange: number; // percentage
  priceChangeAmount: number; // absolute
  history: PriceHistory[];
}

// Product with prices from all stores
export interface ProductWithPrices {
  product: Product;
  prices: Price[];
  lowestPrice: Price;
  trend?: PriceTrend;
}

// Search Results
export interface SearchResult {
  products: ProductWithPrices[];
  query: string;
  totalResults: number;
}

// Price Alert Types
export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  store?: Store; // If undefined, alert for any store
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

// Deal Verification Types
export interface Deal {
  id: string;
  productId: string;
  store: Store;
  title: string;
  currentPrice: number;
  claimedOriginalPrice: number;
  claimedDiscount: number;
  actualDiscount: number;
  isGenuine: boolean;
  priceBeforeDeal: number;
  analysis: string;
  startDate: Date;
  endDate?: Date;
}

// Image Search Types
export interface ImageSearchResult {
  product: Product;
  confidence: number; // 0-1
  matchedImageUrl: string;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  ProductDetail: { productId: string };
  PriceHistory: { productId: string };
  DealVerification: { dealId?: string; productUrl?: string };
  ImageSearch: undefined;
  Alerts: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Camera: undefined;
  Alerts: undefined;
  Profile: undefined;
};
