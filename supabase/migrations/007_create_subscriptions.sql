-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'lifetime')),
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due
  payment_id TEXT, -- External payment ID from Dodo Payments
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);

-- Disable RLS for testing (REMOVE IN PRODUCTION)
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- Grant full access for testing
GRANT ALL ON subscriptions TO anon, authenticated;
