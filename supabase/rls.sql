alter table public.vehicles enable row level security;
alter table public.leads enable row level security;

drop policy if exists "Public can read published vehicles" on public.vehicles;
create policy "Public can read published vehicles"
on public.vehicles
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated can read all vehicles" on public.vehicles;
create policy "Authenticated can read all vehicles"
on public.vehicles
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert vehicles" on public.vehicles;
create policy "Authenticated can insert vehicles"
on public.vehicles
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update vehicles" on public.vehicles;
create policy "Authenticated can update vehicles"
on public.vehicles
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete vehicles" on public.vehicles;
create policy "Authenticated can delete vehicles"
on public.vehicles
for delete
to authenticated
using (true);

drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "Authenticated can delete leads" on public.leads;
create policy "Authenticated can delete leads"
on public.leads
for delete
to authenticated
using (true);