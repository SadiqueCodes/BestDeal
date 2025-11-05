import express, { Request, Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Amazon scraper
async function searchAmazon(query: string) {
  try {
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    const $ = cheerio.load(data);
    const products: any[] = [];

    $('[data-component-type="s-search-result"]').slice(0, 10).each((_, element) => {
      const $el = $(element);
      const name = $el.find('h2 a span').first().text().trim();
      const priceWhole = $el.find('.a-price-whole').first().text().replace(/,/g, '');
      const image = $el.find('img.s-image').attr('src');
      const asin = $el.attr('data-asin');

      if (name && priceWhole) {
        const price = parseFloat(priceWhole);
        products.push({
          name,
          price,
          imageUrl: image || '',
          store: 'amazon',
          url: `https://www.amazon.in/dp/${asin}`,
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Amazon scraping error:', error);
    return [];
  }
}

// Flipkart scraper
async function searchFlipkart(query: string) {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    const $ = cheerio.load(data);
    const products: any[] = [];

    $('[data-id]').slice(0, 10).each((_, element) => {
      const $el = $(element);
      const name = $el.find('a.s1Q9rs, a.IRpwTa, div.KzDlHZ').first().text().trim();
      const priceText = $el.find('div._30jeq3, div._1_WHN1').first().text().replace(/[₹,]/g, '');
      const image = $el.find('img').attr('src');

      if (name && priceText) {
        const price = parseFloat(priceText);
        products.push({
          name,
          price,
          imageUrl: image || '',
          store: 'flipkart',
          url: searchUrl,
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Flipkart scraping error:', error);
    return [];
  }
}

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

// Search products - scrapes real data from Amazon and Flipkart
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter required' });
    }

    console.log(`🔍 Searching for: ${query}`);

    // Scrape from both sites in parallel
    const [amazonProducts, flipkartProducts] = await Promise.all([
      searchAmazon(query),
      searchFlipkart(query),
    ]);

    console.log(`✅ Found ${amazonProducts.length} from Amazon, ${flipkartProducts.length} from Flipkart`);

    // Combine results and group by product name
    const allProducts = [...amazonProducts, ...flipkartProducts];
    
    // Group products by similar names
    const productMap = new Map();
    
    for (const product of allProducts) {
      const key = product.name.toLowerCase().substring(0, 50);
      
      if (!productMap.has(key)) {
        // Save product to database
        const { data: dbProduct, error: productError } = await supabase
          .from('products')
          .upsert([{
            name: product.name,
            image_url: product.imageUrl,
            category: 'Electronics', // You can improve this with categorization
          }], { 
            onConflict: 'name',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (!productError && dbProduct) {
          // Save price
          await supabase
            .from('prices')
            .insert([{
              product_id: dbProduct.id,
              store_id: product.store,
              current_price: product.price,
              in_stock: true,
            }]);

          productMap.set(key, {
            product: dbProduct,
            prices: [{ 
              store_id: product.store, 
              current_price: product.price,
              url: product.url 
            }],
          });
        }
      } else {
        // Add price to existing product
        const existing = productMap.get(key);
        existing.prices.push({ 
          store_id: product.store, 
          current_price: product.price,
          url: product.url 
        });
      }
    }

    const results = Array.from(productMap.values());

    res.json({ 
      results,
      source: 'scraped',
      count: results.length,
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
