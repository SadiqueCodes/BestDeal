import create from 'zustand';
import { ProductWithPrices } from '../types';
import { fetchProducts } from '../services/api';

interface AppState {
  products: ProductWithPrices[];
  loading: boolean;
  loadProducts: () => Promise<void>;
}

export const useAppStore = create<AppState>(set => ({
  products: [],
  loading: false,
  loadProducts: async () => {
    set({ loading: true });
    try {
      const products = await fetchProducts();
      set({ products });
    } catch (e) {
      console.warn('Failed to load products', e);
    } finally {
      set({ loading: false });
    }
  },
}));
