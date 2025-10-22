import { Product, Price, ProductWithPrices, PriceHistory, PriceTrend, PriceAlert, Deal } from '../types';

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Nike Air Max 270',
    brand: 'Nike',
    model: 'Air Max 270',
    category: 'Shoes',
    imageUrl: 'https://via.placeholder.com/400x400/FF6B9D/FFFFFF?text=Nike+Air+Max',
    description: 'Comfortable running shoes with air cushioning',
  },
  {
    id: 'p2',
    name: 'Apple AirPods Pro',
    brand: 'Apple',
    model: 'AirPods Pro (2nd Gen)',
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/400x400/C84FFF/FFFFFF?text=AirPods+Pro',
    description: 'Wireless earbuds with active noise cancellation',
  },
  {
    id: 'p3',
    name: 'Levi\'s 511 Slim Fit Jeans',
    brand: 'Levi\'s',
    model: '511',
    category: 'Clothing',
    imageUrl: 'https://via.placeholder.com/400x400/4F9FFF/FFFFFF?text=Levis+Jeans',
    description: 'Slim fit denim jeans, dark wash',
  },
  {
    id: 'p4',
    name: 'Samsung Galaxy Watch 6',
    brand: 'Samsung',
    model: 'Galaxy Watch 6',
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/400x400/00D4AA/FFFFFF?text=Galaxy+Watch',
    description: 'Smartwatch with health tracking features',
  },
  {
    id: 'p5',
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    model: 'Ultraboost 22',
    category: 'Shoes',
    imageUrl: 'https://via.placeholder.com/400x400/FF9900/FFFFFF?text=Ultraboost',
    description: 'Premium running shoes with boost technology',
  },
  {
    id: 'p6',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    model: 'WH-1000XM5',
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/400x400/2874F0/FFFFFF?text=Sony+Headphones',
    description: 'Wireless noise cancelling headphones',
  },
];

// Generate mock prices
const generatePrices = (productId: string, basePrice: number): Price[] => {
  const stores: Array<'amazon' | 'flipkart' | 'myntra' | 'ajio' | 'alibaba'> =
    ['amazon', 'flipkart', 'myntra', 'ajio', 'alibaba'];

  return stores.map((store, index) => {
    const variation = Math.random() * 0.3 - 0.1; // -10% to +20%
    const currentPrice = Math.round(basePrice * (1 + variation));
    const originalPrice = Math.round(currentPrice * (1 + Math.random() * 0.3));
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    return {
      productId,
      store,
      currentPrice,
      originalPrice,
      discount,
      currency: '₹',
      inStock: Math.random() > 0.1,
      productUrl: `https://${store}.com/product/${productId}`,
      lastUpdated: new Date(),
    };
  });
};

// Generate price history
const generatePriceHistory = (productId: string, currentPrice: number): PriceHistory[] => {
  const history: PriceHistory[] = [];
  const stores: Array<'amazon' | 'flipkart' | 'myntra' | 'ajio' | 'alibaba'> =
    ['amazon', 'flipkart'];

  stores.forEach(store => {
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const variation = Math.random() * 0.2 - 0.1;
      const price = Math.round(currentPrice * (1 + variation));

      history.push({
        productId,
        store,
        price,
        timestamp: date,
      });
    }
  });

  return history;
};

// Mock product prices data
export const mockProductPrices: ProductWithPrices[] = [
  {
    product: mockProducts[0],
    prices: generatePrices('p1', 12999),
    lowestPrice: generatePrices('p1', 12999).reduce((min, p) =>
      p.currentPrice < min.currentPrice ? p : min
    ),
    trend: {
      productId: 'p1',
      lowestPrice: 11499,
      highestPrice: 15999,
      averagePrice: 13500,
      currentPrice: 12999,
      priceChange: -8,
      priceChangeAmount: -1000,
      history: generatePriceHistory('p1', 12999),
    },
  },
  {
    product: mockProducts[1],
    prices: generatePrices('p2', 24999),
    lowestPrice: generatePrices('p2', 24999).reduce((min, p) =>
      p.currentPrice < min.currentPrice ? p : min
    ),
    trend: {
      productId: 'p2',
      lowestPrice: 22999,
      highestPrice: 26999,
      averagePrice: 24900,
      currentPrice: 24999,
      priceChange: 2,
      priceChangeAmount: 500,
      history: generatePriceHistory('p2', 24999),
    },
  },
  {
    product: mockProducts[2],
    prices: generatePrices('p3', 3499),
    lowestPrice: generatePrices('p3', 3499).reduce((min, p) =>
      p.currentPrice < min.currentPrice ? p : min
    ),
    trend: {
      productId: 'p3',
      lowestPrice: 2999,
      highestPrice: 4299,
      averagePrice: 3600,
      currentPrice: 3499,
      priceChange: -5,
      priceChangeAmount: -200,
      history: generatePriceHistory('p3', 3499),
    },
  },
  {
    product: mockProducts[3],
    prices: generatePrices('p4', 32999),
    lowestPrice: generatePrices('p4', 32999).reduce((min, p) =>
      p.currentPrice < min.currentPrice ? p : min
    ),
    trend: {
      productId: 'p4',
      lowestPrice: 29999,
      highestPrice: 36999,
      averagePrice: 33500,
      currentPrice: 32999,
      priceChange: -10,
      priceChangeAmount: -3300,
      history: generatePriceHistory('p4', 32999),
    },
  },
  {
    product: mockProducts[4],
    prices: generatePrices('p5', 16999),
    lowestPrice: generatePrices('p5', 16999).reduce((min, p) =>
      p.currentPrice < min.currentPrice ? p : min
    ),
    trend: {
      productId: 'p5',
      lowestPrice: 15499,
      highestPrice: 18999,
      averagePrice: 17200,
      currentPrice: 16999,
      priceChange: -6,
      priceChangeAmount: -1000,
      history: generatePriceHistory('p5', 16999),
    },
  },
  {
    product: mockProducts[5],
    prices: generatePrices('p6', 29999),
    lowestPrice: generatePrices('p6', 29999).reduce((min, p) =>
      p.currentPrice < min.currentPrice ? p : min
    ),
    trend: {
      productId: 'p6',
      lowestPrice: 27999,
      highestPrice: 32999,
      averagePrice: 30200,
      currentPrice: 29999,
      priceChange: -8,
      priceChangeAmount: -2400,
      history: generatePriceHistory('p6', 29999),
    },
  },
];

// Mock price alerts
export const mockAlerts: PriceAlert[] = [
  {
    id: 'a1',
    userId: 'user1',
    productId: 'p1',
    targetPrice: 11999,
    currentPrice: 12999,
    store: 'amazon',
    isActive: true,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'a2',
    userId: 'user1',
    productId: 'p2',
    targetPrice: 23999,
    currentPrice: 24999,
    isActive: true,
    createdAt: new Date('2025-01-18'),
  },
  {
    id: 'a3',
    userId: 'user1',
    productId: 'p4',
    targetPrice: 29999,
    currentPrice: 32999,
    store: 'flipkart',
    isActive: true,
    createdAt: new Date('2025-01-20'),
  },
];

// Mock deals
export const mockDeals: Deal[] = [
  {
    id: 'd1',
    productId: 'p1',
    store: 'amazon',
    title: 'Republic Day Sale - 40% OFF',
    currentPrice: 12999,
    claimedOriginalPrice: 21999,
    claimedDiscount: 40,
    actualDiscount: 18,
    isGenuine: false,
    priceBeforeDeal: 14999,
    analysis: 'This deal claims 40% off from ₹21,999, but the product was never sold at that price. The actual price before this deal was ₹14,999, making the real discount only 18%.',
    startDate: new Date('2025-01-24'),
    endDate: new Date('2025-01-28'),
  },
  {
    id: 'd2',
    productId: 'p6',
    store: 'flipkart',
    title: 'Flash Sale - 25% OFF',
    currentPrice: 27999,
    claimedOriginalPrice: 32999,
    claimedDiscount: 15,
    actualDiscount: 15,
    isGenuine: true,
    priceBeforeDeal: 32999,
    analysis: 'Genuine deal! The product was consistently priced at ₹32,999 for the past 30 days. This is a legitimate 15% discount.',
    startDate: new Date('2025-01-22'),
    endDate: new Date('2025-01-24'),
  },
];

// Helper functions
export const getProductById = (id: string): ProductWithPrices | undefined => {
  return mockProductPrices.find(p => p.product.id === id);
};

export const searchProducts = (query: string): ProductWithPrices[] => {
  const lowerQuery = query.toLowerCase();
  return mockProductPrices.filter(p =>
    p.product.name.toLowerCase().includes(lowerQuery) ||
    p.product.brand.toLowerCase().includes(lowerQuery) ||
    p.product.category.toLowerCase().includes(lowerQuery)
  );
};

export const getProductsByCategory = (category: string): ProductWithPrices[] => {
  return mockProductPrices.filter(p =>
    p.product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedDeals = (): ProductWithPrices[] => {
  return mockProductPrices
    .filter(p => p.trend && p.trend.priceChange < -5)
    .slice(0, 5);
};
