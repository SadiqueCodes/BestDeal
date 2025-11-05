import { supabase } from '../lib/supabase';
import { Product, Price, PriceAlert, ProductWithPrices, PriceTrend } from '../types';

// Products
export async function getProducts(limit = 20): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getProductById(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }
  return data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

// Prices
export async function getLatestPricesForProduct(productId: string): Promise<Price[]> {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Group by store and get latest
  const latestPrices = Object.values(
    (data || []).reduce((acc: any, price: any) => {
      if (!acc[price.store_id] || new Date(acc[price.store_id].created_at) < new Date(price.created_at)) {
        acc[price.store_id] = {
          productId: price.product_id,
          store: price.store_id,
          currentPrice: Number(price.current_price),
          originalPrice: price.original_price ? Number(price.original_price) : undefined,
          discount: price.discount || 0,
          currency: '₹',
          inStock: price.in_stock,
          productUrl: `https://${price.store_id}.com/product/${productId}`,
          lastUpdated: new Date(price.created_at),
        };
      }
      return acc;
    }, {})
  ) as Price[];

  return latestPrices;
}

export async function getProductWithPrices(productId: string): Promise<ProductWithPrices | null> {
  const product = await getProductById(productId);
  if (!product) return null;

  const prices = await getLatestPricesForProduct(productId);
  if (prices.length === 0) return null;

  const lowestPrice = prices.reduce((min, p) => p.currentPrice < min.currentPrice ? p : min);

  // Get price trend
  const trend = await getPriceTrend(productId);

  return {
    product,
    prices,
    lowestPrice,
    trend,
  };
}

export async function getPriceHistory(productId: string, storeId: string, days = 30): Promise<any[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('prices')
    .select('current_price, created_at')
    .eq('product_id', productId)
    .eq('store_id', storeId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data || []).map(item => ({
    price: Number(item.current_price),
    timestamp: new Date(item.created_at),
  }));
}

export async function getPriceTrend(productId: string): Promise<PriceTrend | null> {
  const { data: allPrices, error } = await supabase
    .from('prices')
    .select('current_price, created_at')
    .eq('product_id', productId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true });

  if (error || !allPrices || allPrices.length === 0) return null;

  const prices = allPrices.map(p => Number(p.current_price));
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const currentPrice = prices[prices.length - 1];

  const priceChange = Math.round(((currentPrice - averagePrice) / averagePrice) * 100);
  const priceChangeAmount = currentPrice - averagePrice;

  const history = allPrices.map(item => ({
    productId,
    store: 'amazon' as const,
    price: Number(item.current_price),
    timestamp: new Date(item.created_at),
  }));

  return {
    productId,
    lowestPrice,
    highestPrice,
    averagePrice,
    currentPrice,
    priceChange,
    priceChangeAmount,
    history,
  };
}

// Price Alerts
export async function createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<PriceAlert> {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([{
      user_id: alert.userId,
      product_id: alert.productId,
      target_price: alert.targetPrice,
      store_id: alert.store || null,
      is_active: alert.isActive,
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    productId: data.product_id,
    targetPrice: Number(data.target_price),
    currentPrice: Number(data.target_price), // Will be updated by background job
    store: data.store_id,
    isActive: data.is_active,
    createdAt: new Date(data.created_at),
  };
}

export async function getUserAlerts(userId: string): Promise<PriceAlert[]> {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*, products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id: item.id,
    userId: item.user_id,
    productId: item.product_id,
    targetPrice: Number(item.target_price),
    currentPrice: Number(item.target_price),
    store: item.store_id,
    isActive: item.is_active,
    createdAt: new Date(item.created_at),
  }));
}

export async function updatePriceAlert(alertId: string, updates: Partial<PriceAlert>): Promise<void> {
  const { error } = await supabase
    .from('price_alerts')
    .update({
      target_price: updates.targetPrice,
      is_active: updates.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', alertId);

  if (error) throw error;
}

export async function deletePriceAlert(alertId: string): Promise<void> {
  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId);

  if (error) throw error;
}

// Saved Products
export async function saveProduct(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_products')
    .insert([{ user_id: userId, product_id: productId }]);

  if (error && error.code !== '23505') throw error; // Ignore duplicate key error
}

export async function unsaveProduct(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_products')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
}

export async function getSavedProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('saved_products')
    .select('products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((item: any) => item.products);
}

export async function isProductSaved(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('saved_products')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  return !error && !!data;
}
