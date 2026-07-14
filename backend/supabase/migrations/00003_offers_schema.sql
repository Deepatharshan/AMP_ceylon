-- Create offers table
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text,
  discount_percentage numeric,
  original_price_note text,
  valid_from date not null,
  valid_until date not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Create offer_regions table
create table public.offer_regions (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references public.offers(id) on delete cascade,
  region_id uuid references public.regions(id) on delete cascade
);

-- RLS
alter table public.offers enable row level security;
alter table public.offer_regions enable row level security;

-- Public read for active and currently valid offers
create policy "Public read active offers" on public.offers for select using (
  is_active = true and valid_from <= current_date and valid_until >= current_date
);
create policy "Admin all offers" on public.offers for all to authenticated using (true) with check (true);

-- Public read for regions of active/valid offers
create policy "Public read offer regions" on public.offer_regions for select using (
  exists (
    select 1 from public.offers 
    where id = offer_regions.offer_id 
      and is_active = true 
      and valid_from <= current_date 
      and valid_until >= current_date
  )
);
create policy "Admin all offer_regions" on public.offer_regions for all to authenticated using (true) with check (true);

-- RPC for transactional insert of offer with regions
create or replace function public.create_offer_with_regions(
  p_title text,
  p_description text,
  p_image text,
  p_discount_percentage numeric,
  p_original_price_note text,
  p_valid_from date,
  p_valid_until date,
  p_is_active boolean,
  p_region_ids uuid[]
) returns uuid as $$
declare
  v_offer_id uuid;
  v_region_id uuid;
begin
  insert into public.offers (
    title, description, image, discount_percentage, original_price_note, valid_from, valid_until, is_active
  ) values (
    p_title, p_description, p_image, p_discount_percentage, p_original_price_note, p_valid_from, p_valid_until, p_is_active
  ) returning id into v_offer_id;

  if p_region_ids is not null then
    foreach v_region_id in array p_region_ids
    loop
      insert into public.offer_regions (offer_id, region_id) values (v_offer_id, v_region_id);
    end loop;
  end if;

  return v_offer_id;
end;
$$ language plpgsql security definer;

-- RPC for transactional update of offer
create or replace function public.update_offer_with_regions(
  p_offer_id uuid,
  p_title text,
  p_description text,
  p_image text,
  p_discount_percentage numeric,
  p_original_price_note text,
  p_valid_from date,
  p_valid_until date,
  p_is_active boolean,
  p_region_ids uuid[]
) returns void as $$
declare
  v_region_id uuid;
begin
  update public.offers set
    title = p_title,
    description = p_description,
    image = p_image,
    discount_percentage = p_discount_percentage,
    original_price_note = p_original_price_note,
    valid_from = p_valid_from,
    valid_until = p_valid_until,
    is_active = p_is_active
  where id = p_offer_id;

  delete from public.offer_regions where offer_id = p_offer_id;
  if p_region_ids is not null then
    foreach v_region_id in array p_region_ids
    loop
      insert into public.offer_regions (offer_id, region_id) values (p_offer_id, v_region_id);
    end loop;
  end if;
end;
$$ language plpgsql security definer;
