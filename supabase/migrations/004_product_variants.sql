-- Inventario por talla: JSONB [{ "size": "M", "stock": 15 }, ...]

alter table public.products
  add column if not exists variants jsonb not null default '[]'::jsonb;

alter table public.products
  drop constraint if exists products_variants_is_array;

alter table public.products
  add constraint products_variants_is_array
  check (jsonb_typeof(variants) = 'array');

create index if not exists products_variants_gin_idx on public.products using gin (variants);
