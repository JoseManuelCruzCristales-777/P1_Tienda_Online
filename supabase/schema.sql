-- P1_ROUSSE_SHOPPING — ejecutar en Supabase → SQL Editor
-- Desactiva confirmación de email: Authentication → Providers → Email → Confirm email OFF

-- ── Perfiles de clientas (vinculados a auth.users) ──────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Apartados / pedidos ─────────────────────────────────────────────────────
create table if not exists public.orders (
  id text primary key,
  customer_id uuid references public.profiles (id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  items jsonb not null default '[]'::jsonb,
  total numeric(12, 2) not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'picked_up')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = customer_id);

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = customer_id);

-- ── Trigger: crear perfil al registrarse ────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Trigger: actualizar updated_at en orders ────────────────────────────────
create or replace function public.set_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_orders_updated_at();

-- ── Catálogo de productos ─────────────────────────────────────────────────────
create table if not exists public.products (
  id text primary key,
  title text not null,
  price text not null,
  image_url text not null,
  description text not null,
  category text not null,
  layout_role text not null default 'standard'
    check (layout_role in ('featured', 'standard')),
  featured_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_layout_role_idx on public.products (layout_role);

alter table public.products enable row level security;

create policy "products_public_read"
  on public.products for select
  using (true);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_products_updated_at();
