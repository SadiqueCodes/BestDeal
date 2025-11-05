import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          brand: string | null;
          model: string | null;
          category: string | null;
          image_url: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      stores: {
        Row: {
          id: string;
          name: string;
          display_name: string;
          color: string | null;
          url: string | null;
          logo_url: string | null;
        };
        Insert: Database['public']['Tables']['stores']['Row'];
        Update: Partial<Database['public']['Tables']['stores']['Insert']>;
      };
      prices: {
        Row: {
          id: string;
          product_id: string;
          store_id: string;
          current_price: number;
          original_price: number | null;
          discount: number | null;
          currency: string;
          in_stock: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['prices']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['prices']['Insert']>;
      };
      price_alerts: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          target_price: number;
          store_id: string | null;
          is_active: boolean;
          triggered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['price_alerts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['price_alerts']['Insert']>;
      };
      saved_products: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_products']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
}
