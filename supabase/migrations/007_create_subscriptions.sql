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

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update for now (via webhook)
-- But for simplicity in this demo, we might allow authenticated users to insert if we do client-side integration (not recommended for prod but ok for MVP)
-- Better to stick to service role for updates.
