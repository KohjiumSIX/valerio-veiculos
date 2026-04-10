create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  brand text not null,
  model text not null,
  year integer not null check (year >= 1900 and year <= 2100),
  price numeric(12,2) not null check (price >= 0),
  km integer not null default 0 check (km >= 0),
  fuel text not null,
  transmission text not null,
  color text,
  description text,
  cover_image text,
  images text[] default '{}',
  is_featured boolean not null default false,
  is_offer boolean not null default false,
  is_new_arrival boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete set null,
  name text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists vehicles_set_updated_at on public.vehicles;

create trigger vehicles_set_updated_at
before update on public.vehicles
for each row
execute function public.set_updated_at();

create index if not exists vehicles_slug_idx on public.vehicles(slug);
create index if not exists vehicles_brand_idx on public.vehicles(brand);
create index if not exists vehicles_model_idx on public.vehicles(model);
create index if not exists vehicles_year_idx on public.vehicles(year);
create index if not exists vehicles_price_idx on public.vehicles(price);
create index if not exists vehicles_featured_idx on public.vehicles(is_featured);
create index if not exists vehicles_offer_idx on public.vehicles(is_offer);
create index if not exists vehicles_new_arrival_idx on public.vehicles(is_new_arrival);
create index if not exists vehicles_published_idx on public.vehicles(is_published);
create index if not exists leads_vehicle_id_idx on public.leads(vehicle_id);
create index if not exists leads_created_at_idx on public.leads(created_at desc);