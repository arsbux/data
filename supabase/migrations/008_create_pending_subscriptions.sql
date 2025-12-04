-- Create pending_subscriptions table to store payments before user signup
CREATE TABLE IF NOT EXISTS pending_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  plan_type TEXT NOT NULL, -- 'monthly' or 'lifetime'
  payment_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for testing
ALTER TABLE pending_subscriptions DISABLE ROW LEVEL SECURITY;

-- Grant access
GRANT ALL ON pending_subscriptions TO anon, authenticated;
