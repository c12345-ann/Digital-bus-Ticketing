create extension if not exists pgcrypto with schema extensions;

create type public.user_role as enum ('passenger', 'conductor', 'administrator');
create type public.ticket_status as enum ('unused', 'used', 'invalid', 'cancelled');
create type public.route_status as enum ('active', 'scheduled', 'paused');
create type public.bus_status as enum ('In Service', 'Maintenance', 'Ready', 'Standby');
create type public.trip_status as enum ('Scheduled', 'Boarding', 'In Transit', 'Arrived', 'Delayed', 'Completed');
create type public.payment_method as enum ('Orange Money', 'Africell Money', 'Credit/Debit Card', 'Bank Transfer', 'Cash on Board', 'Apple Pay');
create type public.payment_status as enum ('Successful', 'Pending', 'Refunded', 'Failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_id text unique not null default ('USR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  first_name text not null,
  middle_name text,
  last_name text not null,
  email text unique not null,
  phone text,
  national_id text,
  role public.user_role not null default 'passenger',
  account_status text not null default 'Active' check (account_status in ('Active','Suspended')),
  avatar_url text,
  emergency_contact text,
  preferred_currency text not null default 'NLe',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.routes (
  id text primary key default ('RT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  origin text not null,
  destination text not null,
  departure_time text not null,
  duration text not null,
  distance_km numeric(8,2),
  fare numeric(12,2) not null check (fare >= 0),
  status public.route_status not null default 'active',
  stops text[] not null default '{}',
  operating_days text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.buses (
  id text primary key,
  plate text unique not null,
  model text not null,
  capacity integer not null check (capacity > 0),
  route_id text references public.routes(id) on delete set null,
  conductor_id uuid references public.profiles(id) on delete set null,
  status public.bus_status not null default 'Ready',
  amenities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id text primary key default ('TRIP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  trip_number text unique not null,
  bus_id text not null references public.buses(id) on delete restrict,
  route_id text not null references public.routes(id) on delete restrict,
  conductor_id uuid references public.profiles(id) on delete set null,
  departure_at timestamptz not null,
  estimated_arrival_at timestamptz not null,
  status public.trip_status not null default 'Scheduled',
  current_stop_index integer not null default 0 check (current_stop_index >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tickets (
  id text primary key default ('TKT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  reference text unique not null default ('BT-' || extract(year from now())::text || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  passenger_id uuid not null references public.profiles(id) on delete restrict,
  route_id text not null references public.routes(id) on delete restrict,
  trip_id text references public.trips(id) on delete set null,
  passenger_name text not null,
  passenger_phone text,
  travel_date date not null,
  seat_number text not null,
  bus_id text references public.buses(id) on delete set null,
  fare numeric(12,2) not null check (fare >= 0),
  status public.ticket_status not null default 'unused',
  payment_method public.payment_method not null,
  purchased_at timestamptz not null default now(),
  validated_at timestamptz,
  validated_by uuid references public.profiles(id) on delete set null,
  cancelled_at timestamptz,
  unique (trip_id, seat_number)
);

create table public.payments (
  id text primary key default ('PAY-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  ticket_id text unique not null references public.tickets(id) on delete restrict,
  passenger_id uuid not null references public.profiles(id) on delete restrict,
  amount numeric(12,2) not null check (amount >= 0),
  method public.payment_method not null,
  status public.payment_status not null default 'Successful',
  transaction_ref text unique not null,
  paid_at timestamptz not null default now()
);

create table public.manifest_passengers (
  id text primary key default ('MAN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  trip_id text references public.trips(id) on delete cascade,
  ticket_id text unique not null references public.tickets(id) on delete cascade,
  is_boarded boolean not null default false,
  special_assistance boolean not null default false,
  boarded_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.incident_reports (
  id text primary key default ('INC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  trip_id text not null references public.trips(id) on delete restrict,
  conductor_id uuid not null references public.profiles(id) on delete restrict,
  type text not null check (type in ('Delay','Mechanical','Overcrowding','Fare Dispute','Medical','Other')),
  severity text not null check (severity in ('Low','Medium','High','Critical')),
  title text not null,
  description text not null,
  status text not null default 'Submitted' check (status in ('Submitted','Under Review','Resolved')),
  submitted_at timestamptz not null default now()
);

create table public.feedback (
  id text primary key default ('FB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  passenger_id uuid not null references public.profiles(id) on delete restrict,
  route_id text references public.routes(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  category text not null check (category in ('Punctuality','Cleanliness','Staff Behavior','Booking Ease','Other')),
  comment text not null,
  status text not null default 'Received' check (status in ('Received','Reviewed','Addressed')),
  created_at timestamptz not null default now()
);

create table public.validation_logs (
  id text primary key default ('LOG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  ticket_id text references public.tickets(id) on delete set null,
  ticket_reference text not null,
  conductor_id uuid not null references public.profiles(id) on delete restrict,
  bus_id text references public.buses(id) on delete set null,
  status text not null check (status in ('Valid','Invalid','Already Used','Cancelled')),
  scanned_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  push_enabled boolean not null default true,
  email_alerts boolean not null default true,
  audio_chime boolean not null default true,
  currency text not null default 'NLe (Leone)',
  theme text not null default 'System Default',
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'system' check (type in ('ticket','bus','payment','scan','security','system')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'New' check (status in ('New','In Progress','Resolved')),
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

create index tickets_passenger_idx on public.tickets(passenger_id, purchased_at desc);
create index tickets_reference_idx on public.tickets(reference);
create unique index tickets_active_seat_idx on public.tickets(route_id, travel_date, seat_number) where status <> 'cancelled';
create index payments_passenger_idx on public.payments(passenger_id, paid_at desc);
create index trips_conductor_idx on public.trips(conductor_id, departure_at desc);
create index feedback_passenger_idx on public.feedback(passenger_id, created_at desc);
create index validation_logs_conductor_idx on public.validation_logs(conductor_id, scanned_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger routes_touch before update on public.routes for each row execute function public.touch_updated_at();
create trigger buses_touch before update on public.buses for each row execute function public.touch_updated_at();
create trigger trips_touch before update on public.trips for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, first_name, middle_name, last_name, email, phone, national_id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', split_part(coalesce(new.email,''), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'middle_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'last_name', ''), 'User'),
    coalesce(new.email, new.id::text || '@invalid.local'),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'national_id', ''),
    'passenger'::public.user_role
  ) on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.current_user_role() returns public.user_role
language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function public.book_ticket(
  p_route_id text, p_travel_date date, p_seat_number text,
  p_passenger_name text, p_passenger_phone text, p_payment_method public.payment_method
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_route public.routes; v_trip public.trips; v_ticket public.tickets; v_payment public.payments;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select * into v_route from public.routes where id = p_route_id and status <> 'paused';
  if not found then raise exception 'Route is unavailable'; end if;
  select * into v_trip from public.trips where route_id = p_route_id and departure_at::date = p_travel_date
    and status in ('Scheduled','Boarding') order by departure_at limit 1;
  if exists (select 1 from public.tickets where route_id = p_route_id and travel_date = p_travel_date and seat_number = p_seat_number and status <> 'cancelled') then
    raise exception 'Seat is already booked';
  end if;
  insert into public.tickets (passenger_id, route_id, trip_id, passenger_name, passenger_phone, travel_date, seat_number, bus_id, fare, payment_method)
  values (v_user, v_route.id, v_trip.id, p_passenger_name, p_passenger_phone, p_travel_date, p_seat_number, v_trip.bus_id, v_route.fare, p_payment_method)
  returning * into v_ticket;
  insert into public.payments (ticket_id, passenger_id, amount, method, transaction_ref)
  values (v_ticket.id, v_user, v_route.fare, p_payment_method, 'TXN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))) returning * into v_payment;
  insert into public.manifest_passengers (trip_id, ticket_id) values (v_trip.id, v_ticket.id);
  insert into public.notifications(user_id,title,message,type)
  values(v_user,'Boarding Pass Ready','Ticket ' || v_ticket.reference || ' has been booked successfully.','ticket');
  return jsonb_build_object('ticket_id', v_ticket.id, 'reference', v_ticket.reference, 'payment_id', v_payment.id);
exception when unique_violation then
  raise exception 'Seat is already booked';
end $$;

create or replace function public.validate_ticket(p_reference text, p_bus_id text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_role public.user_role; v_ticket public.tickets; v_result text;
begin
  select role into v_role from public.profiles where id = v_user;
  if v_role not in ('conductor','administrator') then raise exception 'Not authorized to validate tickets'; end if;
  select * into v_ticket from public.tickets where upper(reference) = upper(trim(p_reference)) for update;
  if not found then
    insert into public.validation_logs(ticket_reference, conductor_id, bus_id, status) values (upper(trim(p_reference)), v_user, p_bus_id, 'Invalid');
    return jsonb_build_object('success', false, 'reason', 'invalid');
  end if;
  if v_ticket.status = 'used' then v_result := 'Already Used';
  elsif v_ticket.status = 'cancelled' then v_result := 'Cancelled';
  else
    v_result := 'Valid';
    update public.tickets set status='used', validated_at=now(), validated_by=v_user where id=v_ticket.id returning * into v_ticket;
    update public.manifest_passengers set is_boarded=true, boarded_at=coalesce(boarded_at,now()) where ticket_id=v_ticket.id;
  end if;
  insert into public.validation_logs(ticket_id,ticket_reference,conductor_id,bus_id,status) values(v_ticket.id,v_ticket.reference,v_user,p_bus_id,v_result);
  if v_result = 'Valid' then
    insert into public.notifications(user_id,title,message,type) values(v_ticket.passenger_id,'Ticket Validated','Ticket ' || v_ticket.reference || ' was validated for boarding.','scan');
  end if;
  return jsonb_build_object('success', v_result='Valid', 'reason', lower(replace(v_result,' ','_')), 'ticket_id', v_ticket.id);
end $$;

create or replace function public.cancel_ticket(p_ticket_id text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid();
begin
  update public.tickets set status='cancelled', cancelled_at=now()
  where id=p_ticket_id and passenger_id=v_user and status='unused';
  if not found then return false; end if;
  update public.payments set status='Refunded' where ticket_id=p_ticket_id and status='Successful';
  insert into public.notifications(user_id,title,message,type) values(v_user,'Ticket Cancelled','Your ticket was cancelled and its refund was initiated.','payment');
  return true;
end $$;

alter table public.profiles enable row level security;
alter table public.routes enable row level security;
alter table public.buses enable row level security;
alter table public.trips enable row level security;
alter table public.tickets enable row level security;
alter table public.payments enable row level security;
alter table public.manifest_passengers enable row level security;
alter table public.incident_reports enable row level security;
alter table public.feedback enable row level security;
alter table public.validation_logs enable row level security;
alter table public.user_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.contact_messages enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.routes, public.buses, public.trips to authenticated;
grant select on public.profiles to authenticated;
grant update(first_name,middle_name,last_name,phone,national_id,avatar_url,emergency_contact,preferred_currency) on public.profiles to authenticated;
grant select on public.tickets, public.payments to authenticated;
grant select on public.manifest_passengers to authenticated;
grant update(is_boarded,boarded_at) on public.manifest_passengers to authenticated;
grant select, insert on public.incident_reports to authenticated;
grant update(status) on public.incident_reports to authenticated;
grant select, insert on public.feedback to authenticated;
grant update(status) on public.feedback to authenticated;
grant select on public.validation_logs to authenticated;
grant select, insert, update on public.user_preferences to authenticated;
grant select, update, delete on public.notifications to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update on public.contact_messages to authenticated;
grant insert, update, delete on public.routes, public.buses to authenticated;
grant insert, delete on public.trips to authenticated;
grant update(status,current_stop_index) on public.trips to authenticated;
grant execute on function public.book_ticket(text,date,text,text,text,public.payment_method) to authenticated;
grant execute on function public.validate_ticket(text,text) to authenticated;
grant execute on function public.cancel_ticket(text) to authenticated;
grant select on public.routes, public.buses, public.trips to anon;

create policy profiles_select on public.profiles for select to authenticated using (id=(select auth.uid()) or public.current_user_role()='administrator');
create policy profiles_update on public.profiles for update to authenticated using (id=(select auth.uid()) or public.current_user_role()='administrator') with check (id=(select auth.uid()) or public.current_user_role()='administrator');
create policy routes_select on public.routes for select to authenticated using (true);
create policy routes_public_select on public.routes for select to anon using (status <> 'paused');
create policy routes_admin_insert on public.routes for insert to authenticated with check (public.current_user_role()='administrator');
create policy routes_admin_update on public.routes for update to authenticated using (public.current_user_role()='administrator') with check (public.current_user_role()='administrator');
create policy routes_admin_delete on public.routes for delete to authenticated using (public.current_user_role()='administrator');
create policy buses_select on public.buses for select to authenticated using (true);
create policy buses_public_select on public.buses for select to anon using (true);
create policy buses_admin_insert on public.buses for insert to authenticated with check (public.current_user_role()='administrator');
create policy buses_admin_update on public.buses for update to authenticated using (public.current_user_role()='administrator') with check (public.current_user_role()='administrator');
create policy buses_admin_delete on public.buses for delete to authenticated using (public.current_user_role()='administrator');
create policy trips_select on public.trips for select to authenticated using (public.current_user_role()='administrator' or conductor_id=(select auth.uid()) or public.current_user_role()='passenger');
create policy trips_public_select on public.trips for select to anon using (status in ('Scheduled','Boarding','In Transit'));
create policy trips_admin_insert on public.trips for insert to authenticated with check (public.current_user_role()='administrator');
create policy trips_update on public.trips for update to authenticated using (public.current_user_role()='administrator' or conductor_id=(select auth.uid())) with check (public.current_user_role()='administrator' or conductor_id=(select auth.uid()));
create policy trips_admin_delete on public.trips for delete to authenticated using (public.current_user_role()='administrator');
create policy tickets_select on public.tickets for select to authenticated using (passenger_id=(select auth.uid()) or public.current_user_role() in ('conductor','administrator'));
create policy tickets_update on public.tickets for update to authenticated using (passenger_id=(select auth.uid()) or public.current_user_role() in ('conductor','administrator')) with check (passenger_id=(select auth.uid()) or public.current_user_role() in ('conductor','administrator'));
create policy payments_select on public.payments for select to authenticated using (passenger_id=(select auth.uid()) or public.current_user_role()='administrator');
create policy payments_update on public.payments for update to authenticated using (public.current_user_role()='administrator') with check (public.current_user_role()='administrator');
create policy manifest_select on public.manifest_passengers for select to authenticated using (public.current_user_role() in ('conductor','administrator') or exists(select 1 from public.tickets t where t.id=ticket_id and t.passenger_id=(select auth.uid())));
create policy manifest_update on public.manifest_passengers for update to authenticated using (public.current_user_role() in ('conductor','administrator')) with check (public.current_user_role() in ('conductor','administrator'));
create policy reports_select on public.incident_reports for select to authenticated using (conductor_id=(select auth.uid()) or public.current_user_role()='administrator');
create policy reports_insert on public.incident_reports for insert to authenticated with check (conductor_id=(select auth.uid()) and public.current_user_role()='conductor');
create policy reports_update on public.incident_reports for update to authenticated using (public.current_user_role()='administrator') with check (public.current_user_role()='administrator');
create policy feedback_select on public.feedback for select to authenticated using (passenger_id=(select auth.uid()) or public.current_user_role()='administrator');
create policy feedback_insert on public.feedback for insert to authenticated with check (passenger_id=(select auth.uid()) and public.current_user_role()='passenger');
create policy feedback_update on public.feedback for update to authenticated using (public.current_user_role()='administrator') with check (public.current_user_role()='administrator');
create policy logs_select on public.validation_logs for select to authenticated using (conductor_id=(select auth.uid()) or public.current_user_role()='administrator');
create policy preferences_select on public.user_preferences for select to authenticated using (user_id=(select auth.uid()));
create policy preferences_insert on public.user_preferences for insert to authenticated with check (user_id=(select auth.uid()));
create policy preferences_update on public.user_preferences for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy notifications_select on public.notifications for select to authenticated using (user_id=(select auth.uid()));
create policy notifications_update on public.notifications for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy notifications_delete on public.notifications for delete to authenticated using (user_id=(select auth.uid()));
create policy contact_insert on public.contact_messages for insert to anon, authenticated with check (true);
create policy contact_admin_select on public.contact_messages for select to authenticated using (public.current_user_role()='administrator');
create policy contact_admin_update on public.contact_messages for update to authenticated using (public.current_user_role()='administrator') with check (public.current_user_role()='administrator');

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy avatar_public_read on storage.objects for select to anon,authenticated using(bucket_id='avatars');
create policy avatar_owner_insert on storage.objects for insert to authenticated with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy avatar_owner_update on storage.objects for update to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy avatar_owner_delete on storage.objects for delete to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=(select auth.uid())::text);
