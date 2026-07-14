-- Create inquiries table
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company_name text,
  email text not null,
  phone text,
  country text,
  message text,
  status text default 'new', -- 'new', 'contacted', 'closed'
  created_at timestamptz default now()
);

-- Create inquiry_items table
create table public.inquiry_items (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid references public.inquiries(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer default 1,
  notes text
);

-- RLS
alter table public.inquiries enable row level security;
alter table public.inquiry_items enable row level security;

-- Public can insert inquiries
create policy "Public insert inquiries" on public.inquiries for insert with check (true);
create policy "Public insert inquiry items" on public.inquiry_items for insert with check (true);

-- Admin can read and update inquiries
create policy "Admin all inquiries" on public.inquiries for all to authenticated using (true) with check (true);
create policy "Admin all inquiry_items" on public.inquiry_items for all to authenticated using (true) with check (true);

-- RPC for transactional insert of inquiry
create or replace function public.submit_inquiry(
  p_customer_name text,
  p_company_name text,
  p_email text,
  p_phone text,
  p_country text,
  p_message text,
  p_items jsonb
) returns uuid as $$
declare
  v_inquiry_id uuid;
  v_item jsonb;
begin
  insert into public.inquiries (
    customer_name, company_name, email, phone, country, message
  ) values (
    p_customer_name, p_company_name, p_email, p_phone, p_country, p_message
  ) returning id into v_inquiry_id;

  if p_items is not null then
    for v_item in select * from jsonb_array_elements(p_items)
    loop
      insert into public.inquiry_items (
        inquiry_id, product_id, quantity, notes
      ) values (
        v_inquiry_id,
        (v_item->>'product_id')::uuid,
        COALESCE((v_item->>'quantity')::integer, 1),
        v_item->>'notes'
      );
    end loop;
  end if;

  return v_inquiry_id;
end;
$$ language plpgsql security definer;
