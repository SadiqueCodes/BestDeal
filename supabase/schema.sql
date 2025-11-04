-- Supabase schema for BestDeal
-- Run in Supabase SQL editor or via psql to create tables used by the app

-- Products table stores product metadata and a JSON column for prices/trend
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  product jsonb NOT NULL,
  prices jsonb,
  lowest_price jsonb,
  trend jsonb,
  created_at timestamptz DEFAULT now()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id text PRIMARY KEY,
  user_id text,
  product_id text REFERENCES products(id) ON DELETE SET NULL,
  target_price numeric,
  current_price numeric,
  store text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  triggered_at timestamptz
);

-- Deals
CREATE TABLE IF NOT EXISTS deals (
  id text PRIMARY KEY,
  product_id text REFERENCES products(id) ON DELETE SET NULL,
  store text,
  title text,
  current_price numeric,
  claimed_original_price numeric,
  claimed_discount integer,
  actual_discount integer,
  is_genuine boolean,
  price_before_deal numeric,
  analysis text,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now()
);
