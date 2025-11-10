-- DigiGet Loyalty Platform Schema
-- Generated from project brief

-- Super Admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  pin_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Shop Applications (before approval)
CREATE TABLE IF NOT EXISTS shop_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  shop_name TEXT NOT NULL,
  shop_type TEXT NOT NULL,
  shop_address_line1 TEXT NOT NULL,
  shop_address_line2 TEXT,
  shop_postcode TEXT NOT NULL,
  shop_logo_url TEXT,
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT NOT NULL,
  points_per_visit INTEGER NOT NULL DEFAULT 10,
  reward_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES admins(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT
);

-- Shops (after approval)
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES shop_applications(id),
  shop_name TEXT NOT NULL,
  shop_type TEXT NOT NULL,
  shop_address_line1 TEXT NOT NULL,
  shop_address_line2 TEXT,
  shop_postcode TEXT NOT NULL,
  shop_logo_url TEXT,
  owner_name TEXT NOT NULL,
  owner_email TEXT UNIQUE NOT NULL,
  owner_phone TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  pin_hash TEXT,
  email_verified BOOLEAN DEFAULT false,
  nfc_tag_id TEXT UNIQUE NOT NULL,
  trial_ends_at TIMESTAMPTZ NOT NULL,
  subscription_status TEXT DEFAULT 'trial',
  points_per_visit INTEGER NOT NULL DEFAULT 10,
  setup_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ
);

-- Rewards (shop can have multiple tiers)
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  points_required INTEGER NOT NULL,
  reward_description TEXT NOT NULL,
  reward_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ
);

-- Customer Points (per shop)
CREATE TABLE IF NOT EXISTS customer_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  points_balance INTEGER DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  last_visit_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, shop_id)
);

-- Transactions Log
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  points_change INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NFC Tags Inventory
CREATE TABLE IF NOT EXISTS nfc_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tag_id TEXT UNIQUE NOT NULL,
  assigned_to_shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_at TIMESTAMPTZ
);

-- Activation Tokens
CREATE TABLE IF NOT EXISTS activation_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password Reset Tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type TEXT NOT NULL,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PIN Reset Tokens
CREATE TABLE IF NOT EXISTS pin_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type TEXT NOT NULL,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  reset_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Verification Tokens
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_type TEXT NOT NULL,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_tags ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins full access" ON shops FOR ALL USING (true);
CREATE POLICY "Admins full access apps" ON shop_applications FOR ALL USING (true);
CREATE POLICY "Admins full access tags" ON nfc_tags FOR ALL USING (true);
CREATE POLICY "Shops see own data" ON shops FOR SELECT USING (owner_phone = current_setting('app.user_phone', true));
CREATE POLICY "Shops see own customers" ON customer_points FOR ALL USING (
  shop_id IN (SELECT id FROM shops WHERE owner_phone = current_setting('app.user_phone', true))
);
CREATE POLICY "Customers see own points" ON customer_points FOR SELECT USING (
  customer_id IN (
    SELECT id FROM customers WHERE phone_number = current_setting('app.user_phone', true)
  )
);

