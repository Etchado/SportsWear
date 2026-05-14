# Supabase Setup

## 1. Create a Supabase project
Go to https://supabase.com → New Project → choose a region close to your users.

## 2. Run the schema
In **Supabase Dashboard → SQL Editor**, paste and run `schema.sql` in full.

## 3. Set your admin email
In the SQL Editor run:
```sql
alter database postgres set app.admin_email = 'your@email.com';
```

## 4. Enable OAuth providers (optional)
Dashboard → Authentication → Providers → enable Google and/or Apple.

## 5. Copy your env vars
Dashboard → Project Settings → API → copy:
- `Project URL` → `VITE_SUPABASE_URL`
- `anon public` key → `VITE_SUPABASE_ANON_KEY`

Paste into `.env.local`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_ADMIN_EMAIL=your@email.com
```

## 6. Run seed data (Step 4)
After Step 4 is complete, run `seed.sql` to populate 30+ products.

## Tables

| Table | Purpose |
|---|---|
| `products` | Product catalog |
| `product_variants` | Per-color/size stock |
| `drops` | Flash sale drops |
| `profiles` | User display name + size preferences |
| `loyalty_points` | Points balance + tier |
| `loyalty_history` | Points earned/redeemed log |
| `orders` | Order records |
| `order_items` | Line items per order |
| `wishlists` | Saved products per user |
| `outfits` | Saved outfit builds |
| `reviews` | Product reviews |
| `notify_me` | Drop notification requests |

## RLS Summary

| Table | Public | Authenticated | Admin |
|---|---|---|---|
| products | read | — | full |
| product_variants | read | — | full |
| drops | read | — | full |
| profiles | — | own row | — |
| loyalty_points | — | own row | read |
| loyalty_history | — | own row | — |
| orders | — | own rows | full |
| order_items | — | own (via order) | full |
| wishlists | — | own rows | — |
| outfits | — | own rows | — |
| reviews | read | own row | delete |
| notify_me | insert | — | read |
