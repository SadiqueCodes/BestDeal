# BestDeal - Production Deployment Guide

This guide walks you through taking BestDeal from a working prototype to a production-ready app available on app stores.

---

## Table of Contents

1. [Replace Mock Data with Real Price Scraping APIs](#1-replace-mock-data-with-real-price-scraping-apis)
2. [Set Up Supabase Database](#2-set-up-supabase-database)
3. [Add User Authentication](#3-add-user-authentication)
4. [Configure Push Notifications](#4-configure-push-notifications)
5. [Deploy Backend Services](#5-deploy-backend-services)
6. [Submit to App Stores](#6-submit-to-app-stores)

---

## 1. Replace Mock Data with Real Price Scraping APIs

### Overview
Currently, the app uses mock data from `src/services/mockData.ts`. We need to replace this with real price data scraped from Amazon, Flipkart, Myntra, Ajio, and Alibaba.

### Option A: Build Your Own Web Scraper (Recommended for Learning)

#### Step 1.1: Set Up Backend Scraping Service

Create a Node.js backend service for web scraping:

```bash
# Create backend directory
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express puppeteer cors dotenv
npm install --save-dev typescript @types/express @types/node ts-node
```

#### Step 1.2: Create Scraper for Each Store

**File: `backend/src/scrapers/amazonScraper.ts`**

```typescript
import puppeteer from 'puppeteer';

interface ProductPrice {
  store: 'amazon';
  currentPrice: number;
  originalPrice?: number;
  inStock: boolean;
  productUrl: string;
  lastUpdated: Date;
}

export async function scrapeAmazonProduct(productUrl: string): Promise<ProductPrice | null> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Extract price data
    const priceData = await page.evaluate(() => {
      // Amazon price selectors (these change frequently, need to update)
      const priceElement = document.querySelector('.a-price-whole');
      const originalPriceElement = document.querySelector('.a-text-price .a-offscreen');
      const availabilityElement = document.querySelector('#availability span');

      const currentPrice = priceElement
        ? parseFloat(priceElement.textContent?.replace(/[^0-9.]/g, '') || '0')
        : 0;

      const originalPrice = originalPriceElement
        ? parseFloat(originalPriceElement.textContent?.replace(/[^0-9.]/g, '') || '0')
        : undefined;

      const inStock = availabilityElement?.textContent?.toLowerCase().includes('in stock') || false;

      return { currentPrice, originalPrice, inStock };
    });

    if (priceData.currentPrice === 0) {
      return null;
    }

    return {
      store: 'amazon',
      currentPrice: priceData.currentPrice,
      originalPrice: priceData.originalPrice,
      inStock: priceData.inStock,
      productUrl,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Amazon scraping error:', error);
    return null;
  } finally {
    await browser.close();
  }
}

// Search Amazon by product name
export async function searchAmazon(query: string): Promise<any[]> {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    const products = await page.evaluate(() => {
      const results: any[] = [];
      const productCards = document.querySelectorAll('[data-component-type="s-search-result"]');

      productCards.forEach((card, index) => {
        if (index >= 10) return; // Limit to 10 results

        const titleElement = card.querySelector('h2 a span');
        const priceElement = card.querySelector('.a-price-whole');
        const imageElement = card.querySelector('.s-image') as HTMLImageElement;
        const linkElement = card.querySelector('h2 a') as HTMLAnchorElement;

        if (titleElement && priceElement) {
          results.push({
            name: titleElement.textContent?.trim(),
            price: parseFloat(priceElement.textContent?.replace(/[^0-9.]/g, '') || '0'),
            imageUrl: imageElement?.src,
            productUrl: linkElement ? `https://www.amazon.in${linkElement.getAttribute('href')}` : '',
          });
        }
      });

      return results;
    });

    return products;
  } finally {
    await browser.close();
  }
}
```

**Repeat similar scrapers for:**
- `flipkartScraper.ts`
- `myntraScraper.ts`
- `ajioScraper.ts`
- `alibabaScraper.ts`

#### Step 1.3: Create API Endpoints

**File: `backend/src/server.ts`**

```typescript
import express from 'express';
import cors from 'cors';
import { scrapeAmazonProduct, searchAmazon } from './scrapers/amazonScraper';
// Import other scrapers...

const app = express();
app.use(cors());
app.use(express.json());

// Search products across all stores
app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    // Search all stores in parallel
    const [amazonResults, flipkartResults, myntraResults] = await Promise.all([
      searchAmazon(query as string),
      // searchFlipkart(query as string),
      // searchMyntra(query as string),
    ]);

    // Combine and deduplicate results
    const allResults = [...amazonResults /* , ...flipkartResults, ...myntraResults */];

    res.json({ results: allResults });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get product prices from all stores
app.post('/api/product/prices', async (req, res) => {
  const { urls } = req.body; // { amazon: 'url', flipkart: 'url', ... }

  try {
    const prices = await Promise.all([
      urls.amazon ? scrapeAmazonProduct(urls.amazon) : null,
      // urls.flipkart ? scrapeFlipkartProduct(urls.flipkart) : null,
      // ... other stores
    ]);

    res.json({ prices: prices.filter(p => p !== null) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Step 1.4: Update App to Use Real API

**File: `src/services/api.ts`**

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function searchProducts(query: string) {
  const response = await fetch(`${API_URL}/api/search?query=${encodeURIComponent(query)}`);
  return response.json();
}

export async function getProductPrices(urls: Record<string, string>) {
  const response = await fetch(`${API_URL}/api/product/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  });
  return response.json();
}
```

**Update `src/screens/SearchScreen.tsx`:**

```typescript
import { searchProducts } from '../services/api';

const handleSearch = async (query: string) => {
  setSearchQuery(query);
  setLoading(true);

  try {
    const data = await searchProducts(query);
    setResults(data.results);
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    setLoading(false);
  }
};
```

### Option B: Use Third-Party APIs (Faster, May Cost Money)

#### Recommended Services:

1. **Rainforest API** (https://www.rainforestapi.com/)
   - Amazon product data
   - $0.50 per 1000 requests
   - Reliable and well-maintained

2. **ScraperAPI** (https://www.scraperapi.com/)
   - General web scraping
   - Handles proxies and anti-bot
   - Free tier: 5,000 requests/month

3. **Oxylabs** (https://oxylabs.io/)
   - E-commerce scraping
   - Premium service
   - Best for enterprise

#### Example with Rainforest API:

```typescript
// File: src/services/rainforestApi.ts
const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY;

export async function searchAmazonProducts(query: string) {
  const response = await fetch(
    `https://api.rainforestapi.com/request?api_key=${RAINFOREST_API_KEY}&type=search&amazon_domain=amazon.in&search_term=${query}`
  );
  return response.json();
}

export async function getAmazonProduct(asin: string) {
  const response = await fetch(
    `https://api.rainforestapi.com/request?api_key=${RAINFOREST_API_KEY}&type=product&amazon_domain=amazon.in&asin=${asin}`
  );
  return response.json();
}
```

### Important Legal Considerations

⚠️ **WARNING**: Web scraping may violate Terms of Service

- **Check each store's robots.txt**: `https://amazon.in/robots.txt`
- **Respect rate limits**: Don't overload servers
- **Use proxies**: Avoid IP bans
- **Consider alternatives**: Official APIs when available (Amazon Product Advertising API)
- **Legal consultation**: Consult a lawyer for commercial use

### Recommended Approach for BestDeal:

1. Start with **affiliate APIs** where available (Amazon Associates, Flipkart Affiliate)
2. Use **third-party services** like Rainforest API for missing data
3. Implement **caching** to reduce API calls (store prices in database)
4. Set up **scheduled jobs** to refresh prices every hour

---

## 2. Set Up Supabase Database

### Step 2.1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project:
   - Name: `bestdeal-production`
   - Database Password: (generate strong password, save it!)
   - Region: Choose closest to your users
   - Pricing: Start with Free tier

### Step 2.2: Set Up Database Schema

In Supabase Dashboard → SQL Editor, run:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  category TEXT,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table
CREATE TABLE public.stores (
  id TEXT PRIMARY KEY, -- 'amazon', 'flipkart', etc.
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT,
  url TEXT,
  logo_url TEXT
);

-- Product URLs (links to products on each store)
CREATE TABLE public.product_urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products ON DELETE CASCADE,
  store_id TEXT REFERENCES public.stores,
  url TEXT NOT NULL,
  asin_or_id TEXT, -- Store-specific product ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, store_id)
);

-- Prices table (historical data)
CREATE TABLE public.prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products ON DELETE CASCADE,
  store_id TEXT REFERENCES public.stores,
  current_price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  discount INTEGER,
  currency TEXT DEFAULT 'INR',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster price queries
CREATE INDEX idx_prices_product_store ON public.prices(product_id, store_id, created_at DESC);

-- Price Alerts table
CREATE TABLE public.price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  product_id UUID REFERENCES public.products ON DELETE CASCADE,
  target_price DECIMAL(10, 2) NOT NULL,
  store_id TEXT REFERENCES public.stores, -- NULL means any store
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Products (Wishlist)
CREATE TABLE public.saved_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  product_id UUID REFERENCES public.products ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Row Level Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Price Alerts: Users can only manage their own alerts
CREATE POLICY "Users can view own alerts" ON public.price_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts" ON public.price_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.price_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON public.price_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Saved Products: Users can only manage their own saved products
CREATE POLICY "Users can view own saved products" ON public.saved_products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add saved products" ON public.saved_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved products" ON public.saved_products
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for products, stores, prices
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Anyone can view stores" ON public.stores
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Anyone can view prices" ON public.prices
  FOR SELECT TO authenticated, anon USING (true);

-- Insert initial store data
INSERT INTO public.stores (id, name, display_name, color, url) VALUES
  ('amazon', 'amazon', 'Amazon', '#FF9900', 'https://www.amazon.in'),
  ('flipkart', 'flipkart', 'Flipkart', '#2874F0', 'https://www.flipkart.com'),
  ('myntra', 'myntra', 'Myntra', '#FF3F6C', 'https://www.myntra.com'),
  ('ajio', 'ajio', 'AJIO', '#C53678', 'https://www.ajio.com'),
  ('alibaba', 'alibaba', 'Alibaba', '#FF6A00', 'https://www.alibaba.com');
```

### Step 2.3: Install Supabase Client in App

```bash
npm install @supabase/supabase-js
```

### Step 2.4: Configure Supabase Client

**File: `src/lib/supabase.ts`**

```typescript
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**File: `.env`** (Create this file in root):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from Supabase Dashboard → Settings → API

### Step 2.5: Create Database Service Functions

**File: `src/services/database.ts`**

```typescript
import { supabase } from '../lib/supabase';
import { Product, Price, PriceAlert } from '../types';

// Fetch products
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Search products
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get product with latest prices
export async function getProductWithPrices(productId: string) {
  // Get product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (productError) throw productError;

  // Get latest price for each store
  const { data: prices, error: pricesError } = await supabase
    .from('prices')
    .select('*, stores(*)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (pricesError) throw pricesError;

  // Group by store and get latest
  const latestPrices = Object.values(
    prices.reduce((acc, price) => {
      if (!acc[price.store_id] || acc[price.store_id].created_at < price.created_at) {
        acc[price.store_id] = price;
      }
      return acc;
    }, {} as Record<string, any>)
  );

  return { product, prices: latestPrices };
}

// Get price history for product
export async function getPriceHistory(productId: string, storeId: string, days = 30) {
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
  return data;
}

// Create price alert
export async function createPriceAlert(alert: Omit<PriceAlert, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert([alert])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get user's price alerts
export async function getUserAlerts(userId: string) {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*, products(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Update price alert
export async function updatePriceAlert(alertId: string, updates: Partial<PriceAlert>) {
  const { data, error } = await supabase
    .from('price_alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete price alert
export async function deletePriceAlert(alertId: string) {
  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId);

  if (error) throw error;
}
```

### Step 2.6: Update Screens to Use Database

**Update `src/screens/SearchScreen.tsx`:**

```typescript
import { searchProducts } from '../services/database';

const handleSearch = async (query: string) => {
  setSearchQuery(query);
  setLoading(true);

  try {
    const products = await searchProducts(query);
    setResults(products);
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 3. Add User Authentication

### Step 3.1: Install Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install react-native-url-polyfill
```

### Step 3.2: Create Auth Context

**File: `src/contexts/AuthContext.tsx`**

```typescript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email,
          full_name: fullName,
        },
      ]);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Step 3.3: Create Auth Screens

**File: `src/screens/LoginScreen.tsx`**

```typescript
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, GlowCard } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, borderRadius, typography } from '../theme';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>Welcome Back</Text>
        <Text variant="body" color={colors.text.secondary} style={styles.subtitle}>
          Sign in to continue to BestDeal
        </Text>

        <GlowCard variant="primary" glow style={styles.card}>
          <Text variant="bodyMedium" style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor={colors.text.tertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text variant="bodyMedium" style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.text.tertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Sign In"
            variant="primary"
            fullWidth
            loading={loading}
            onPress={handleLogin}
            style={styles.button}
          />
        </GlowCard>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.ui.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.base,
    ...typography.variants.body,
    color: colors.text.primary,
  },
  button: {
    marginTop: spacing.base,
  },
});
```

### Step 3.4: Wrap App with Auth Provider

**Update `App.tsx`:**

```typescript
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
```

### Step 3.5: Add Protected Routes

**Update `src/navigation/AppNavigator.tsx`:**

```typescript
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />; // Create a loading screen
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      {/* Your existing navigation */}
    </NavigationContainer>
  );
};
```

---

## 4. Configure Push Notifications

### Step 4.1: Set Up Expo Push Notifications

```bash
npm install expo-notifications expo-device expo-constants
```

### Step 4.2: Request Permissions and Get Token

**File: `src/services/notifications.ts`**

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C84FFF',
    });
  }

  return token;
}

// Save push token to database
export async function savePushToken(userId: string, token: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ push_token: token })
    .eq('id', userId);

  if (error) console.error('Error saving push token:', error);
}

// Send local notification (for testing)
export async function sendLocalNotification(title: string, body: string, data?: any) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // Send immediately
  });
}
```

### Step 4.3: Add Push Token Column to Database

```sql
-- Add push_token column to profiles
ALTER TABLE public.profiles ADD COLUMN push_token TEXT;
```

### Step 4.4: Register for Notifications on Login

**Update `src/contexts/AuthContext.tsx`:**

```typescript
import { registerForPushNotifications, savePushToken } from '../services/notifications';

const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Register for push notifications
  if (data.user) {
    const token = await registerForPushNotifications();
    if (token) {
      await savePushToken(data.user.id, token);
    }
  }
};
```

### Step 4.5: Create Supabase Edge Function for Price Alerts

In Supabase Dashboard → Edge Functions, create a new function:

**File: `supabase/functions/check-price-alerts/index.ts`**

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    // Get all active alerts
    const { data: alerts } = await supabase
      .from('price_alerts')
      .select('*, products(*), profiles(push_token)')
      .eq('is_active', true);

    if (!alerts) return new Response('No alerts', { status: 200 });

    for (const alert of alerts) {
      // Get latest price for product
      const { data: latestPrice } = await supabase
        .from('prices')
        .select('current_price, store_id, stores(display_name)')
        .eq('product_id', alert.product_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Check if target price reached
      if (latestPrice && latestPrice.current_price <= alert.target_price) {
        // Send push notification
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: alert.profiles.push_token,
            title: '🎉 Price Alert!',
            body: `${alert.products.name} is now ₹${latestPrice.current_price} on ${latestPrice.stores.display_name}!`,
            data: { productId: alert.product_id },
          }),
        });

        // Mark alert as triggered
        await supabase
          .from('price_alerts')
          .update({
            triggered_at: new Date().toISOString(),
            is_active: false
          })
          .eq('id', alert.id);
      }
    }

    return new Response('Alerts checked', { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### Step 4.6: Schedule Edge Function with Cron

In Supabase Dashboard → Database → Extensions → Enable `pg_cron`

Then run:

```sql
-- Schedule price alert checks every hour
SELECT cron.schedule(
  'check-price-alerts',
  '0 * * * *', -- Every hour
  $$
  SELECT net.http_post(
    url:='https://your-project.supabase.co/functions/v1/check-price-alerts',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

---

## 5. Deploy Backend Services

### Option A: Deploy to Railway (Recommended - Easy & Free)

#### Step 5.1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"

#### Step 5.2: Prepare Backend for Deployment

**Add `package.json` scripts:**

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node src/server.ts"
  }
}
```

**Create `Procfile`:**

```
web: npm start
```

**Create `.env.example`:**

```
PORT=3000
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
NODE_ENV=production
```

#### Step 5.3: Deploy

1. Push your backend code to GitHub
2. In Railway, select your repo
3. Railway auto-detects Node.js and deploys
4. Add environment variables in Railway dashboard
5. Copy the deployment URL

#### Step 5.4: Update App to Use Production API

**Update `.env`:**

```
EXPO_PUBLIC_API_URL=https://your-app.railway.app
```

### Option B: Deploy to Vercel (Serverless)

Good for API endpoints without long-running scrapers.

```bash
npm install -g vercel
cd backend
vercel
```

### Option C: Deploy to Heroku

```bash
heroku create bestdeal-api
git push heroku main
heroku config:set SUPABASE_URL=your-url
```

### Step 5.5: Set Up Background Jobs

For price scraping, use a separate worker:

**Option 1: Railway Cron Jobs**
- Add a cron service in Railway
- Schedule scraping every hour

**Option 2: GitHub Actions**

```yaml
# .github/workflows/scrape-prices.yml
name: Scrape Prices
on:
  schedule:
    - cron: '0 * * * *' # Every hour
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Scrape prices
        run: |
          curl -X POST https://your-api.railway.app/api/scrape-all
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

---

## 6. Submit to App Stores

### Step 6.1: Prepare Assets

#### App Icon (Required)
- Size: 1024x1024 PNG
- No transparency
- No rounded corners (iOS adds them)

#### Splash Screen
- Size: 2048x2048 PNG
- Center logo on solid background

#### Screenshots (Required)
- iPhone: 6.5" (1284 x 2778) - at least 3
- iPad: 12.9" (2048 x 2732) - at least 2
- Android: Various sizes - at least 2

**Create these using:**
- Figma
- Adobe Illustrator
- Canva

### Step 6.2: Build Production App

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

**Configure `eas.json`:**

```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "bundleIdentifier": "com.bestdeal.app"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### Step 6.3: iOS App Store Submission

#### Prerequisites:
- **Apple Developer Account**: $99/year
- **App Store Connect**: Create app listing
- **Certificates**: Generated by EAS automatically

#### Steps:

1. **Create App in App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Click "+" → "New App"
   - Fill in app information:
     - Name: BestDeal
     - Primary Language: English
     - Bundle ID: com.bestdeal.app
     - SKU: bestdeal-app-001

2. **Fill App Information**
   - **App Category**: Shopping
   - **Privacy Policy URL**: (required - create one)
   - **Description**: Write compelling description
   - **Keywords**: price comparison, deals, shopping, discounts
   - **Screenshots**: Upload required screenshots
   - **App Icon**: Upload 1024x1024 icon

3. **Build and Submit**
   ```bash
   # Build for iOS
   eas build --platform ios --profile production

   # Submit to App Store
   eas submit --platform ios --profile production
   ```

4. **App Review**
   - Answer questionnaire about app functionality
   - Provide test account if login required
   - Wait 1-3 days for review

5. **Release**
   - Once approved, click "Release this version"
   - App goes live in 24 hours

### Step 6.4: Google Play Store Submission

#### Prerequisites:
- **Google Play Console Account**: $25 one-time fee
- **Service Account**: For automated submissions

#### Steps:

1. **Create App in Google Play Console**
   - Go to https://play.google.com/console
   - Click "Create app"
   - Fill in details:
     - App name: BestDeal
     - Default language: English
     - App type: Application
     - Free or paid: Free

2. **Complete Store Listing**
   - **Short description**: 80 characters
   - **Full description**: 4000 characters
   - **App icon**: 512x512 PNG
   - **Feature graphic**: 1024x500 PNG
   - **Screenshots**: At least 2 (phone + tablet)
   - **Category**: Shopping
   - **Privacy policy**: URL required

3. **Content Rating**
   - Fill questionnaire
   - Get rating (typically "Everyone")

4. **Create Release**
   ```bash
   # Build for Android
   eas build --platform android --profile production

   # Submit to Play Store
   eas submit --platform android --profile production
   ```

5. **Review and Publish**
   - Internal testing → Closed testing → Open testing → Production
   - Or go straight to Production
   - Review takes 1-7 days

### Step 6.5: Privacy Policy (Required)

Create a privacy policy page and host it:

**Simple Template:**

```markdown
# Privacy Policy for BestDeal

Last updated: January 2025

## Information We Collect
- Email address (for account creation)
- Product searches and preferences
- Price alerts you set

## How We Use Your Information
- To provide price comparison services
- To send price drop notifications
- To improve our app

## Data Storage
- Data stored securely on Supabase servers
- Encrypted in transit and at rest

## Third-Party Services
- Supabase (database)
- Expo (push notifications)

## Your Rights
- Access your data
- Delete your account
- Opt-out of notifications

## Contact
Email: privacy@bestdeal.app
```

Host on:
- GitHub Pages (free)
- Vercel (free)
- Your own domain

### Step 6.6: App Store Optimization (ASO)

**Keywords Research:**
- Use App Annie, Sensor Tower
- Research competitor keywords
- Include: "price comparison", "deals", "shopping", "discounts", "price tracker"

**Description Template:**

```
Find the Best Deals, Save Money Every Day

BestDeal compares prices across Amazon, Flipkart, Myntra, AJIO, and Alibaba to help you find the lowest price instantly.

KEY FEATURES:
✓ Compare prices from 5+ stores instantly
✓ Track price history with beautiful charts
✓ Get notified when prices drop
✓ Search products by photo
✓ Verify if deals are genuine or fake
✓ Save hundreds on every purchase

Never overpay again. Download BestDeal now!
```

---

## Deployment Checklist

### Pre-Launch
- [ ] All features tested on real devices
- [ ] Database schema finalized
- [ ] Authentication working
- [ ] Push notifications tested
- [ ] Backend deployed and stable
- [ ] Error tracking set up (Sentry)
- [ ] Analytics configured
- [ ] Privacy policy published
- [ ] Terms of service created

### App Store Ready
- [ ] App icon (1024x1024)
- [ ] Screenshots (all sizes)
- [ ] Feature graphic (Android)
- [ ] Description written
- [ ] Keywords researched
- [ ] Privacy policy URL
- [ ] Support email set up
- [ ] Test accounts created

### Production Environment
- [ ] Environment variables set
- [ ] API rate limits configured
- [ ] Caching implemented
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] SSL certificates active
- [ ] CDN configured (if needed)

### Post-Launch
- [ ] Monitor crash reports
- [ ] Track user feedback
- [ ] Respond to reviews
- [ ] Fix critical bugs immediately
- [ ] Plan feature updates
- [ ] Marketing campaign

---

## Estimated Timeline

| Phase | Duration | Effort |
|-------|----------|--------|
| Price Scraping APIs | 2-3 weeks | High |
| Supabase Setup | 3-5 days | Medium |
| Authentication | 1 week | Medium |
| Push Notifications | 1 week | Medium |
| Backend Deployment | 2-3 days | Low |
| App Store Submission | 1-2 weeks | Medium |
| **Total** | **6-8 weeks** | - |

## Estimated Costs

| Service | Free Tier | Paid (Monthly) |
|---------|-----------|----------------|
| Supabase | 500MB DB | $25+ |
| Railway | $5 credit | $5-20 |
| Expo EAS | Limited builds | $29 |
| Scraping API | 5K requests | $50-200 |
| Apple Developer | - | $99/year |
| Google Play | $25 one-time | - |
| **Total Year 1** | **~$200** | **~$500-1000** |

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **App Store Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Play Store Policies**: https://play.google.com/about/developer-content-policy/

---

**Need Help?** Create an issue in the project repository or consult the documentation links above.

**Good luck with your launch! 🚀**
