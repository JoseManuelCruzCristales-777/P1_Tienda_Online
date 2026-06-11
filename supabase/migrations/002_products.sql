-- Catálogo de productos (ejecutar en Supabase → SQL Editor)

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
  variants jsonb not null default '[]'::jsonb
    check (jsonb_typeof(variants) = 'array'),
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
