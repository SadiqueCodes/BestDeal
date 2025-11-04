const Constants = require('expo-constants');
import { ProductWithPrices, PriceAlert, Deal } from '../types';
import {
  mockProductPrices,
  getProductById as getMockProductById,
  searchProducts as searchMockProducts,
  mockAlerts,
  mockDeals,
} from './mockData';

let supabaseClient: any = null;
try {
  // require at runtime so CI/dev environments without package won't fail at import time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { supabase } = require('./supabaseClient');
  supabaseClient = supabase;
} catch (e) {
  // ignore - supabase client may not be configured
}

const extra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};
const API_BASE = extra.API_BASE_URL || '';
const SUPABASE_URL = extra.SUPABASE_URL || '';

export const fetchProducts = async (): Promise<ProductWithPrices[]> => {
  // If Supabase is configured, try to fetch from a `products` table
  if (SUPABASE_URL && supabaseClient) {
    const { data, error } = await supabaseClient.from('products').select('*');
    if (!error && Array.isArray(data)) return data as ProductWithPrices[];
  }

  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }

  return Promise.resolve(mockProductPrices);
};

export const fetchProductById = async (id: string): Promise<ProductWithPrices | undefined> => {
  if (SUPABASE_URL && supabaseClient) {
    const { data, error } = await supabaseClient.from('products').select('*').eq('product->>id', id).limit(1).single();
    if (!error && data) return data as ProductWithPrices;
  }

  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/products/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  }

  return Promise.resolve(getMockProductById(id));
};

export const search = async (q: string): Promise<ProductWithPrices[]> => {
  if (SUPABASE_URL && supabaseClient) {
    // naive search: search product name/brand/category
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .or(`product->>name.ilike.%${q}%,product->>brand.ilike.%${q}%,product->>category.ilike.%${q}%`);
    if (!error && Array.isArray(data)) return data as ProductWithPrices[];
  }

  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  }

  return Promise.resolve(searchMockProducts(q));
};

export const fetchAlerts = async (): Promise<PriceAlert[]> => {
  if (SUPABASE_URL && supabaseClient) {
    const { data, error } = await supabaseClient.from('alerts').select('*');
    if (!error && Array.isArray(data)) return data as PriceAlert[];
  }
  return Promise.resolve(mockAlerts);
};

export const fetchDeals = async (): Promise<Deal[]> => {
  if (SUPABASE_URL && supabaseClient) {
    const { data, error } = await supabaseClient.from('deals').select('*');
    if (!error && Array.isArray(data)) return data as Deal[];
  }
  return Promise.resolve(mockDeals);
};
