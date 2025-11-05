const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Search products from backend API
export async function searchProductsFromAPI(query: string) {
  try {
    const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('API search error:', error);
    throw error;
  }
}

// Get product prices from backend
export async function getProductPricesFromAPI(productId: string) {
  try {
    const response = await fetch(`${API_URL}/api/product/${productId}/prices`);
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    const data = await response.json();
    return data.prices || [];
  } catch (error) {
    console.error('API prices error:', error);
    throw error;
  }
}

// Get price history from backend
export async function getPriceHistoryFromAPI(productId: string, store?: string, days = 30) {
  try {
    let url = `${API_URL}/api/product/${productId}/history?days=${days}`;
    if (store) {
      url += `&store=${store}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch price history');
    }
    const data = await response.json();
    return data.history || [];
  } catch (error) {
    console.error('API history error:', error);
    throw error;
  }
}

// Trigger product scraping
export async function scrapeProduct(productName: string) {
  try {
    const response = await fetch(`${API_URL}/api/scrape/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productName }),
    });
    if (!response.ok) {
      throw new Error('Scraping failed');
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('API scraping error:', error);
    throw error;
  }
}

// Check if API is healthy
export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
