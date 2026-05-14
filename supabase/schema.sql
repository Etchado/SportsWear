-- ============================================================
-- SportsWear — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fast text search on products


-- ────────────────────────────────────────────────────────────
-- HELPER: auto-update updated_at columns
-- ────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ────────────────────────────────────────────────────────────
-- HELPER: generate order number  (SW-YYYYMMDD-XXXXXX)
-- ────────────────────────────────────────────────────────────
create or replace function generate_order_number()
returns text language plpgsql as $$
declare
  v_number text;
begin
  v_number := 'SW-' ||
              to_char(now(), 'YYYYMMDD') || '-' ||
              upper(substr(md5(random()::text), 1, 6));
  return v_number;
end;
$$;


-- ────────────────────────────────────────────────────────────
-- HELPER: derive loyalty tier from points
-- ────────────────────────────────────────────────────────────
create or replace function loyalty_tier(p_points integer)
returns text language plpgsql immutable as $$
begin
  if p_points >= 5000 then return 'Platinum';
  elsif p_points >= 1500 then return 'Gold';
  elsif p_points >= 500  then return 'Silver';
  else return 'Bronze';
  end if;
end;
$$;


-- ============================================================
-- TABLES
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- products
-- ────────────────────────────────────────────────────────────
create table if not exists products (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  brand           text not null check (brand in ('Nike','Adidas','Puma','Under Armour','New Balance')),
  sport           text not null check (sport in ('Running','Football','Basketball','Gym','Yoga','Swimming','Casual')),
  gender          text not null check (gender in ('Men','Women','Kids','Unisex')),
  category        text not null check (category in ('Shoes','Tops','Bottoms','Jackets','Accessories')),
  price           numeric(10,2) not null check (price > 0),
  old_price       numeric(10,2),
  colors          text[]   not null default '{}',
  sizes           text[]   not null default '{}',
  images          text[]   not null default '{}',
  description     text     not null default '',
  long_description text    not null default '',
  specs           jsonb    not null default '{}',
  rating          numeric(3,2) not null default 0 check (rating between 0 and 5),
  reviews_count   integer  not null default 0,
  badge           text check (badge in ('NEW','SALE','BESTSELLER','EXCLUSIVE') or badge is null),
  is_drop         boolean  not null default false,
  in_stock        boolean  not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists products_brand_idx    on products (brand);
create index if not exists products_sport_idx    on products (sport);
create index if not exists products_gender_idx   on products (gender);
create index if not exists products_category_idx on products (category);
create index if not exists products_is_drop_idx  on products (is_drop) where is_drop = true;
create index if not exists products_in_stock_idx on products (in_stock) where in_stock = true;
create index if not exists products_title_trgm   on products using gin (title gin_trgm_ops);


-- ────────────────────────────────────────────────────────────
-- product_variants
-- ────────────────────────────────────────────────────────────
create table if not exists product_variants (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products (id) on delete cascade,
  color       text not null,
  size        text not null,
  stock_count integer not null default 0 check (stock_count >= 0),
  images      text[] not null default '{}',
  unique (product_id, color, size)
);

create index if not exists variants_product_id_idx on product_variants (product_id);
create index if not exists variants_color_idx       on product_variants (product_id, color);


-- ────────────────────────────────────────────────────────────
-- drops
-- ────────────────────────────────────────────────────────────
create table if not exists drops (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products (id) on delete cascade,
  drop_time   timestamptz not null,
  units_total integer not null check (units_total > 0),
  units_sold  integer not null default 0 check (units_sold >= 0),
  is_active   boolean not null default false
);

create index if not exists drops_active_idx on drops (is_active) where is_active = true;
create index if not exists drops_time_idx   on drops (drop_time);


-- ────────────────────────────────────────────────────────────
-- profiles  (extends auth.users 1-to-1)
-- ────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                      uuid primary key references auth.users (id) on delete cascade,
  display_name            text,
  preferred_shoe_size     text,
  preferred_clothing_size text,
  updated_at              timestamptz not null default now()
);

create or replace trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ────────────────────────────────────────────────────────────
-- loyalty_points
-- ────────────────────────────────────────────────────────────
create table if not exists loyalty_points (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  points     integer not null default 0 check (points >= 0),
  tier       text    not null default 'Bronze'
               check (tier in ('Bronze','Silver','Gold','Platinum')),
  updated_at timestamptz not null default now()
);

create or replace trigger loyalty_updated_at
  before update on loyalty_points
  for each row execute function update_updated_at();

-- Auto-create loyalty row when a new user signs up
create or replace function handle_new_user_loyalty()
returns trigger language plpgsql security definer as $$
begin
  insert into public.loyalty_points (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created_loyalty
  after insert on auth.users
  for each row execute function handle_new_user_loyalty();


-- ────────────────────────────────────────────────────────────
-- loyalty_history  (points log)
-- ────────────────────────────────────────────────────────────
create table if not exists loyalty_history (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  action     text not null check (action in ('earned','redeemed')),
  points     integer not null,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists loyalty_history_user_idx on loyalty_history (user_id, created_at desc);


-- ────────────────────────────────────────────────────────────
-- orders
-- ────────────────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users (id) on delete restrict,
  order_number     text not null unique default generate_order_number(),
  status           text not null default 'paid'
                     check (status in ('paid','processing','shipped','delivered','cancelled')),
  total            numeric(10,2) not null,
  subtotal         numeric(10,2) not null,
  shipping         numeric(10,2) not null default 0,
  vat              numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  coupon_code      text,
  shipping_address jsonb not null default '{}',
  created_at       timestamptz not null default now()
);

create index if not exists orders_user_idx   on orders (user_id, created_at desc);
create index if not exists orders_status_idx on orders (status);
create index if not exists orders_number_idx on orders (order_number);


-- ────────────────────────────────────────────────────────────
-- order_items
-- ────────────────────────────────────────────────────────────
create table if not exists order_items (
  id         uuid primary key default uuid_generate_v4(),
  order_id   uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id) on delete restrict,
  variant_id uuid references product_variants (id) on delete set null,
  title      text    not null,
  price      numeric(10,2) not null,
  qty        integer not null check (qty > 0),
  color      text    not null,
  size       text    not null,
  image      text    not null default ''
);

create index if not exists order_items_order_idx on order_items (order_id);


-- ────────────────────────────────────────────────────────────
-- wishlists
-- ────────────────────────────────────────────────────────────
create table if not exists wishlists (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references products (id) on delete cascade,
  unique (user_id, product_id)
);

create index if not exists wishlists_user_idx on wishlists (user_id);


-- ────────────────────────────────────────────────────────────
-- outfits
-- ────────────────────────────────────────────────────────────
create table if not exists outfits (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  item_ids   uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists outfits_user_idx on outfits (user_id);


-- ────────────────────────────────────────────────────────────
-- reviews
-- ────────────────────────────────────────────────────────────
create table if not exists reviews (
  id         uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  user_name  text not null,
  rating     integer not null check (rating between 1 and 5),
  body       text not null,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index if not exists reviews_product_idx on reviews (product_id, created_at desc);
create index if not exists reviews_user_idx    on reviews (user_id);

-- Auto-update product rating + reviews_count after insert/delete on reviews
create or replace function refresh_product_rating()
returns trigger language plpgsql as $$
declare
  v_pid uuid;
begin
  v_pid := coalesce(new.product_id, old.product_id);
  update products
  set
    rating        = coalesce((select round(avg(rating)::numeric, 2) from reviews where product_id = v_pid), 0),
    reviews_count = (select count(*) from reviews where product_id = v_pid)
  where id = v_pid;
  return null;
end;
$$;

create or replace trigger reviews_after_change
  after insert or update or delete on reviews
  for each row execute function refresh_product_rating();


-- ────────────────────────────────────────────────────────────
-- notify_me  (drop notification requests)
-- ────────────────────────────────────────────────────────────
create table if not exists notify_me (
  id         uuid primary key default uuid_generate_v4(),
  drop_id    uuid not null references drops (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now(),
  unique (drop_id, email)
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table products         enable row level security;
alter table product_variants enable row level security;
alter table drops            enable row level security;
alter table profiles         enable row level security;
alter table loyalty_points   enable row level security;
alter table loyalty_history  enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table wishlists        enable row level security;
alter table outfits          enable row level security;
alter table reviews          enable row level security;
alter table notify_me        enable row level security;


-- ── products (public read, admin write) ──────────────────────
create policy "products_public_read"
  on products for select using (true);

create policy "products_admin_all"
  on products for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── product_variants (public read, admin write) ───────────────
create policy "variants_public_read"
  on product_variants for select using (true);

create policy "variants_admin_all"
  on product_variants for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── drops (public read, admin write) ─────────────────────────
create policy "drops_public_read"
  on drops for select using (true);

create policy "drops_admin_all"
  on drops for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── profiles (own row only) ───────────────────────────────────
create policy "profiles_own_read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_own_update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_own_insert"
  on profiles for insert
  with check (auth.uid() = id);


-- ── loyalty_points (own row only) ─────────────────────────────
create policy "loyalty_own_read"
  on loyalty_points for select
  using (auth.uid() = user_id);

create policy "loyalty_own_update"
  on loyalty_points for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "loyalty_own_insert"
  on loyalty_points for insert
  with check (auth.uid() = user_id);

-- admin can read all
create policy "loyalty_admin_read"
  on loyalty_points for select
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── loyalty_history (own row only) ───────────────────────────
create policy "loyalty_history_own_read"
  on loyalty_history for select
  using (auth.uid() = user_id);

create policy "loyalty_history_own_insert"
  on loyalty_history for insert
  with check (auth.uid() = user_id);


-- ── orders (own rows, admin all) ─────────────────────────────
create policy "orders_own_read"
  on orders for select
  using (auth.uid() = user_id);

create policy "orders_own_insert"
  on orders for insert
  with check (auth.uid() = user_id);

create policy "orders_admin_all"
  on orders for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── order_items (own via parent order) ───────────────────────
create policy "order_items_own_read"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "order_items_own_insert"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

create policy "order_items_admin_all"
  on order_items for all
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  with check (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── wishlists (own rows) ──────────────────────────────────────
create policy "wishlists_own_read"
  on wishlists for select
  using (auth.uid() = user_id);

create policy "wishlists_own_insert"
  on wishlists for insert
  with check (auth.uid() = user_id);

create policy "wishlists_own_delete"
  on wishlists for delete
  using (auth.uid() = user_id);


-- ── outfits (own rows) ────────────────────────────────────────
create policy "outfits_own_read"
  on outfits for select
  using (auth.uid() = user_id);

create policy "outfits_own_insert"
  on outfits for insert
  with check (auth.uid() = user_id);

create policy "outfits_own_update"
  on outfits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "outfits_own_delete"
  on outfits for delete
  using (auth.uid() = user_id);


-- ── reviews (public read, own write, admin delete) ────────────
create policy "reviews_public_read"
  on reviews for select using (true);

create policy "reviews_own_insert"
  on reviews for insert
  with check (auth.uid() = user_id);

create policy "reviews_own_update"
  on reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "reviews_own_delete"
  on reviews for delete
  using (auth.uid() = user_id);

create policy "reviews_admin_delete"
  on reviews for delete
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ── notify_me (insert only for anyone, admin read) ────────────
create policy "notify_me_insert"
  on notify_me for insert
  with check (true);

create policy "notify_me_admin_read"
  on notify_me for select
  using (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ============================================================
-- SET ADMIN EMAIL CONFIG
-- (Replace with your actual admin email in Supabase Dashboard
--  → Settings → Database → Config → app.admin_email)
-- ============================================================
-- alter database postgres set app.admin_email = 'admin@yourdomain.com';
