import { supabase } from '../config/supabase';
import { searchAmazon, scrapeAmazonProduct } from '../scrapers/amazonScraper';
import { searchFlipkart, scrapeFlipkartProduct } from '../scrapers/flipkartScraper';

interface ProductData {
  name: string;
  brand?: string;
  category?: string;
  imageUrl: string;
}

export async function searchAllStores(query: string) {
  console.log(`Searching for: ${query}`);

  // Search all stores in parallel
  const [amazonResults, flipkartResults] = await Promise.allSettled([
    searchAmazon(query),
    searchFlipkart(query),
  ]);

  const amazon = amazonResults.status === 'fulfilled' ? amazonResults.value : [];
  const flipkart = flipkartResults.status === 'fulfilled' ? flipkartResults.value : [];

  // Combine results
  const allProducts = [
    ...amazon.map(p => ({ ...p, store: 'amazon' })),
    ...flipkart.map(p => ({ ...p, store: 'flipkart' })),
  ];

  // Group similar products
  const grouped = groupSimilarProducts(allProducts);

  return grouped;
}

function groupSimilarProducts(products: any[]) {
  // Simple grouping by similar names (can be enhanced with fuzzy matching)
  const groups: any[] = [];

  products.forEach(product => {
    const existing = groups.find(g => 
      isSimilarName(g.name, product.name)
    );

    if (existing) {
      existing.prices.push({
        store: product.store,
        price: product.price,
        originalPrice: product.originalPrice,
        url: product.productUrl,
        inStock: product.inStock,
      });
    } else {
      groups.push({
        name: product.name,
        imageUrl: product.imageUrl,
        prices: [{
          store: product.store,
          price: product.price,
          originalPrice: product.originalPrice,
          url: product.productUrl,
          inStock: product.inStock,
        }],
      });
    }
  });

  return groups;
}

function isSimilarName(name1: string, name2: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const n1 = normalize(name1);
  const n2 = normalize(name2);
  
  // Simple similarity: check if one contains the other or they share significant words
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  const words1 = n1.split(/\s+/).filter(w => w.length > 3);
  const words2 = n2.split(/\s+/).filter(w => w.length > 3);
  
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length >= Math.min(3, Math.min(words1.length, words2.length));
}

export async function saveProductToDatabase(productData: ProductData) {
  // Check if product exists
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('name', productData.name)
    .single();

  if (existing) {
    return existing.id;
  }

  // Extract brand from name (simple heuristic)
  const brand = productData.brand || extractBrand(productData.name);

  // Insert new product
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: productData.name,
      brand,
      category: productData.category,
      image_url: productData.imageUrl,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving product:', error);
    return null;
  }

  return data.id;
}

function extractBrand(productName: string): string {
  const commonBrands = [
    'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG', 'Dell', 
    'HP', 'Lenovo', 'Asus', 'Xiaomi', 'OnePlus', 'Realme',
    'Levi\'s', 'Zara', 'H&M', 'Puma', 'Reebok'
  ];

  for (const brand of commonBrands) {
    if (productName.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }

  // Return first word as fallback
  return productName.split(' ')[0];
}

export async function savePriceToDatabase(
  productId: string,
  storeId: string,
  price: number,
  originalPrice?: number,
  inStock = true
) {
  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const { error } = await supabase
    .from('prices')
    .insert([{
      product_id: productId,
      store_id: storeId,
      current_price: price,
      original_price: originalPrice,
      discount,
      currency: 'INR',
      in_stock: inStock,
    }]);

  if (error) {
    console.error('Error saving price:', error);
  }
}
