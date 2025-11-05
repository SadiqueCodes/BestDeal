import express, { Request, Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'BestDeal API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      search: '/api/search?q=product_name',
      prices: '/api/product/:productId/prices',
      history: '/api/product/:productId/history'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'BestDeal API is running' });
});

// Search products (simplified version)
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    // Search database for existing products
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;

    res.json({ 
      results: dbProducts || [],
      source: 'database'
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

// Get product prices
app.get('/api/product/:productId/prices', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const { data: prices, error } = await supabase
      .from('prices')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ prices: prices || [] });
  } catch (error: any) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// Get price history
app.get('/api/product/:productId/history', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const { data, error } = await supabase
      .from('prices')
      .select('current_price, store_id, created_at')
      .eq('product_id', productId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({ history: data || [] });
  } catch (error: any) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

export default app;
