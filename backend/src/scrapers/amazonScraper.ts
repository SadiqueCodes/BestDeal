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

export async function searchAmazon(query: string): Promise<ScrapedProduct[]> {
  try {
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const products: ScrapedProduct[] = [];

    $('[data-component-type="s-search-result"]').each((index, element) => {
      if (index >= 10) return; // Limit to 10 results

      const $element = $(element);
      
      const name = $element.find('h2 a span').first().text().trim();
      const priceWhole = $element.find('.a-price-whole').first().text().replace(/[^0-9]/g, '');
      const priceFraction = $element.find('.a-price-fraction').first().text();
      const originalPriceText = $element.find('.a-price.a-text-price .a-offscreen').first().text();
      const imageUrl = $element.find('.s-image').attr('src') || '';
      const productLink = $element.find('h2 a').attr('href') || '';
      
      if (name && priceWhole) {
        const price = parseFloat(`${priceWhole}.${priceFraction || '00'}`);
        const originalPrice = originalPriceText 
          ? parseFloat(originalPriceText.replace(/[^0-9.]/g, ''))
          : undefined;

        products.push({
          name,
          price,
          originalPrice,
          imageUrl,
          productUrl: productLink.startsWith('http') ? productLink : `https://www.amazon.in${productLink}`,
          inStock: true,
        });
      }
    });

    return products;
  } catch (error: any) {
    console.error('Amazon scraping error:', error.message);
    return [];
  }
}

export async function scrapeAmazonProduct(productUrl: string): Promise<{ price: number; inStock: boolean } | null> {
  try {
    const response = await axios.get(productUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    
    const priceWhole = $('.a-price-whole').first().text().replace(/[^0-9]/g, '');
    const priceFraction = $('.a-price-fraction').first().text();
    const availability = $('#availability span').text().toLowerCase();

    if (priceWhole) {
      return {
        price: parseFloat(`${priceWhole}.${priceFraction || '00'}`),
        inStock: availability.includes('in stock') || availability.includes('available'),
      };
    }

    return null;
  } catch (error: any) {
    console.error('Amazon product scraping error:', error.message);
    return null;
  }
}
