import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { searchAllStores, saveProductToDatabase, savePriceToDatabase } from './services/productService';
import { supabase } from './config/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'BestDeal API is running' });
});

// Search products across all stores
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    console.log(`Search request for: ${query}`);

    // First, check database for existing products
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
      .limit(10);

    // If we have recent data, return it
    if (dbProducts && dbProducts.length > 0) {
      console.log(`Found ${dbProducts.length} products in database`);
      return res.json({ 
        results: dbProducts,
        source: 'database'
      });
    }

    // Otherwise, scrape fresh data
    console.log('No database results, scraping...');
    const scrapedResults = await searchAllStores(query);

    // Save scraped products to database for future queries
    for (const result of scrapedResults.slice(0, 5)) {
      const productId = await saveProductToDatabase({
        name: result.name,
        imageUrl: result.imageUrl,
      });

      if (productId) {
        for (const price of result.prices) {
          await savePriceToDatabase(
            productId,
            price.store,
            price.price,
            price.originalPrice,
            price.inStock
          );
        }
      }
    }

    res.json({ 
      results: scrapedResults,
      source: 'scraped'
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

// Get product prices from all stores
app.get('/api/product/:productId/prices', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const { data: prices, error } = await supabase
      .from('prices')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by store and get latest
    const latestPrices = Object.values(
      (prices || []).reduce((acc: any, price: any) => {
        if (!acc[price.store_id] || new Date(acc[price.store_id].created_at) < new Date(price.created_at)) {
          acc[price.store_id] = price;
        }
        return acc;
      }, {})
    );

    res.json({ prices: latestPrices });
  } catch (error: any) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// Get price history for a product
app.get('/api/product/:productId/history', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { store, days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    let query = supabase
      .from('prices')
      .select('current_price, store_id, created_at')
      .eq('product_id', productId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (store) {
      query = query.eq('store_id', store);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ history: data || [] });
  } catch (error: any) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// Manually trigger scraping for a specific product
app.post('/api/scrape/product', async (req: Request, res: Response) => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'productName required' });
    }

    const results = await searchAllStores(productName);
    
    res.json({ success: true, results });
  } catch (error: any) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

// Check price alerts (called by cron job)
app.post('/api/alerts/check', async (req: Request, res: Response) => {
  try {
    // Get all active alerts
    const { data: alerts } = await supabase
      .from('price_alerts')
      .select('*, products(*), profiles(push_token)')
      .eq('is_active', true);

    if (!alerts || alerts.length === 0) {
      return res.json({ message: 'No active alerts', checked: 0 });
    }

    let triggered = 0;

    for (const alert of alerts) {
      // Get latest price for product
      const { data: latestPrice } = await supabase
        .from('prices')
        .select('current_price, store_id')
        .eq('product_id', alert.product_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Check if target price reached
      if (latestPrice && Number(latestPrice.current_price) <= alert.target_price) {
        // Send push notification (if you have Expo push notification service set up)
        // This would require additional setup with Expo's push notification service
        
        // Mark alert as triggered
        await supabase
          .from('price_alerts')
          .update({
            triggered_at: new Date().toISOString(),
            is_active: false
          })
          .eq('id', alert.id);

        triggered++;
      }
    }

    res.json({ 
      message: `Checked ${alerts.length} alerts, triggered ${triggered}`,
      checked: alerts.length,
      triggered
    });
  } catch (error: any) {
    console.error('Error checking alerts:', error);
    res.status(500).json({ error: 'Failed to check alerts' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BestDeal API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
