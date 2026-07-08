-- SatışMetni AI - Veritabanı Şeması
-- Neon PostgreSQL için

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  kvkk_consent_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  package_type TEXT NOT NULL CHECK (package_type IN ('trial', 'starter', 'growth', 'subscription')),
  amount_try INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'delivered', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer' CHECK (payment_method IN ('bank_transfer', 'paytr')),
  payment_notified_at TIMESTAMP,
  approved_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  input_title TEXT NOT NULL,
  input_description TEXT NOT NULL,
  input_category TEXT,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE generations (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  seo_title TEXT NOT NULL,
  description_html TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]',
  social_posts JSONB NOT NULL DEFAULT '[]',
  model_used TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'done', 'failed')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  monthly_quota INTEGER NOT NULL DEFAULT 50,
  used_this_month INTEGER NOT NULL DEFAULT 0,
  renews_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexler
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_order_id ON products(order_id);
CREATE INDEX idx_generations_product_id ON generations(product_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
