# Dodo Payments Setup Guide for Fast Data

## Overview

Fast Data uses Dodo Payments for processing payments. The flow is:
1. User selects a plan on `/pricing` 
2. User is redirected to Dodo's hosted checkout
3. User pays (Dodo collects their email)
4. User is redirected back to `/payment/success`
5. User creates an account with the email they paid with
6. Subscription is activated

## Step 1: Create a Dodo Payments Account

1. Go to [Dodo Payments](https://dodopayments.com)
2. Sign up for a merchant account
3. Complete the onboarding process

## Step 2: Create Products in Dashboard

Create two products in your Dodo Payments Dashboard:

### Monthly Subscription ($9/month)
1. Go to **Products** in the dashboard
2. Click **Create Product**
3. Set:
   - Name: `Fast Data Monthly`
   - Price: `$9.00`
   - Type: `Subscription` (recurring monthly)
4. Save and copy the **Product ID**

### Lifetime Deal ($39 one-time)
1. Create another product
2. Set:
   - Name: `Fast Data Lifetime`
   - Price: `$39.00`
   - Type: `One-time payment`
3. Save and copy the **Product ID**

## Step 3: Generate API Keys

1. Go to **Developer > API** in your dashboard
2. Click **Generate API Key**
3. Copy the API key (starts with `sk_live_` or `sk_test_`)

## Step 4: Set Up Webhooks

1. Go to **Developer > Webhooks**
2. Click **Add Webhook**
3. Set the URL to: `https://your-domain.com/api/webhooks/dodo`
4. Select these events:
   - `payment.succeeded`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
5. Save and copy the **Webhook Secret**

## Step 5: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Dodo Payments
DODO_PAYMENTS_API_KEY=sk_test_your_api_key_here
DODO_WEBHOOK_SECRET=whsec_your_webhook_secret_here
DODO_MONTHLY_PRODUCT_ID=prod_your_monthly_product_id
DODO_LIFETIME_PRODUCT_ID=prod_your_lifetime_product_id

# App URL (for return URLs)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Step 6: Test the Flow

### In Test Mode:
1. Use test API keys (starting with `sk_test_`)
2. Go to `/pricing` on your site
3. Click a plan
4. Complete payment with test card: `4242 4242 4242 4242`
5. You should be redirected to `/payment/success`
6. Create your account

### Test Cards:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0000 0000 3220

## Step 7: Go Live

1. Complete Dodo Payments verification
2. Switch to live API keys (`sk_live_`)
3. Update your `.env.local` with production keys
4. Update webhook URL to production domain
5. Test with a real card (refund yourself)

## Webhook Events Handled

| Event | Action |
|-------|--------|
| `payment.succeeded` | Stores pending subscription for email |
| `subscription.created` | Activates monthly subscription |
| `subscription.updated` | Updates subscription status |
| `subscription.cancelled` | Marks subscription as cancelled |

## Troubleshooting

### Payment redirect not working
- Check that `DODO_MONTHLY_PRODUCT_ID` and `DODO_LIFETIME_PRODUCT_ID` are set correctly
- Check browser console for errors

### Webhook not receiving events
- Ensure webhook URL is publicly accessible (not localhost)
- Check webhook signature matches
- Use ngrok for local testing: `ngrok http 3000`

### Subscription not activating
- Check Supabase logs for errors
- Verify webhook secret is correct
- Check that `subscriptions` table exists and RLS is disabled (for testing)

## Database Schema

The `subscriptions` table stores:
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL, -- 'monthly' or 'lifetime'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled'
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
