import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedProduct {
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  productUrl: string;
  inStock: boolean;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function searchFlipkart(query: string): Promise<ScrapedProduct[]> {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    // Flipkart uses different selectors - these may need adjustment
    $('[data-id]').each((index, element) => {
      if (index >= 10) return;

      const $element = $(element);
      
      const name = $element.find('a').attr('title') || $element.find('.s1Q9rs').text().trim();
      const priceText = $element.find('._30jeq3').text().replace(/[^0-9]/g, '');
      const originalPriceText = $element.find('._3I9_wc').text().replace(/[^0-9]/g, '');
      const imageUrl = $element.find('img').attr('src') || '';
      const productLink = $element.find('a').attr('href') || '';

      if (name && priceText) {
        products.push({
          name,
          price: parseFloat(priceText),
          originalPrice: originalPriceText ? parseFloat(originalPriceText) : undefined,
          imageUrl,
          productUrl: productLink.startsWith('http') ? productLink : `https://www.flipkart.com${productLink}`,
          inStock: true,
        });
      }
    });

    return products;
  } catch (error: any) {
    console.error('Flipkart scraping error:', error.message);
    return [];
  }
}

export async function scrapeFlipkartProduct(productUrl: string): Promise<{ price: number; inStock: boolean } | null> {
  try {
    const response = await axios.get(productUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    
    const priceText = $('._30jeq3').first().text().replace(/[^0-9]/g, '');
    const availability = $('._16FRp0').text().toLowerCase();

    if (priceText) {
      return {
        price: parseFloat(priceText),
        inStock: !availability.includes('out of stock'),
      };
    }

    return null;
  } catch (error: any) {
    console.error('Flipkart product scraping error:', error.message);
    return null;
  }
}
