-- Create products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  season_id uuid references public.seasons(id),
  name text not null,
  product_code text unique,
  description text,
  materials text,
  images text[],
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create product_variants table
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  variant_name text not null,
  color_hex text,
  image text,
  sort_order integer default 0
);

-- Create product_badges table
create table public.product_badges (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade
);

-- RLS for products
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_badges enable row level security;

create policy "Public read active products" on public.products for select using (is_active = true);
create policy "Admin all products" on public.products for all to authenticated using (true) with check (true);

create policy "Public read variants for active products" on public.product_variants for select using (
  exists (select 1 from public.products where id = product_variants.product_id and is_active = true)
);
create policy "Admin all product_variants" on public.product_variants for all to authenticated using (true) with check (true);

create policy "Public read badges for active products" on public.product_badges for select using (
  exists (select 1 from public.products where id = product_badges.product_id and is_active = true)
);
create policy "Admin all product_badges" on public.product_badges for all to authenticated using (true) with check (true);

-- RPC for transactional insert of product with variants and badges
create or replace function public.create_product_with_relations(
  p_category_id uuid,
  p_season_id uuid,
  p_name text,
  p_product_code text,
  p_description text,
  p_materials text,
  p_images text[],
  p_is_active boolean,
  p_variants jsonb,
  p_badge_ids uuid[]
) returns uuid as $$
declare
  v_product_id uuid;
  v_variant jsonb;
  v_badge_id uuid;
begin
  insert into public.products (
    category_id, season_id, name, product_code, description, materials, images, is_active
  ) values (
    p_category_id, p_season_id, p_name, p_product_code, p_description, p_materials, p_images, p_is_active
  ) returning id into v_product_id;

  if p_variants is not null then
    for v_variant in select * from jsonb_array_elements(p_variants)
    loop
      insert into public.product_variants (
        product_id, variant_name, color_hex, image, sort_order
      ) values (
        v_product_id,
        v_variant->>'variant_name',
        v_variant->>'color_hex',
        v_variant->>'image',
        COALESCE((v_variant->>'sort_order')::integer, 0)
      );
    end loop;
  end if;

  if p_badge_ids is not null then
    foreach v_badge_id in array p_badge_ids
    loop
      insert into public.product_badges (product_id, badge_id) values (v_product_id, v_badge_id);
    end loop;
  end if;

  return v_product_id;
end;
$$ language plpgsql security definer;

-- RPC for transactional update of product
create or replace function public.update_product_with_relations(
  p_product_id uuid,
  p_category_id uuid,
  p_season_id uuid,
  p_name text,
  p_product_code text,
  p_description text,
  p_materials text,
  p_images text[],
  p_is_active boolean,
  p_variants jsonb,
  p_badge_ids uuid[]
) returns void as $$
declare
  v_variant jsonb;
  v_badge_id uuid;
begin
  update public.products set
    category_id = p_category_id,
    season_id = p_season_id,
    name = p_name,
    product_code = p_product_code,
    description = p_description,
    materials = p_materials,
    images = p_images,
    is_active = p_is_active,
    updated_at = now()
  where id = p_product_id;

  delete from public.product_variants where product_id = p_product_id;
  if p_variants is not null then
    for v_variant in select * from jsonb_array_elements(p_variants)
    loop
      insert into public.product_variants (
        product_id, variant_name, color_hex, image, sort_order
      ) values (
        p_product_id,
        v_variant->>'variant_name',
        v_variant->>'color_hex',
        v_variant->>'image',
        COALESCE((v_variant->>'sort_order')::integer, 0)
      );
    end loop;
  end if;

  delete from public.product_badges where product_id = p_product_id;
  if p_badge_ids is not null then
    foreach v_badge_id in array p_badge_ids
    loop
      insert into public.product_badges (product_id, badge_id) values (p_product_id, v_badge_id);
    end loop;
  end if;
end;
$$ language plpgsql security definer;
