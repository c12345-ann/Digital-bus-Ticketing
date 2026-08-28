-- Local development accounts. Change or remove these credentials outside local/dev environments.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000001','authenticated','authenticated','passenger@example.com',extensions.crypt('Password123!', extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{"first_name":"Aminata","last_name":"Kamara","phone":"+23276123456","role":"passenger"}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000002','authenticated','authenticated','conductor@example.com',extensions.crypt('Password123!', extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{"first_name":"Mohamed","last_name":"Bangura","phone":"+23276222333","role":"conductor"}',now(),now(),'','','',''),
  ('00000000-0000-0000-0000-000000000000','10000000-0000-0000-0000-000000000003','authenticated','authenticated','admin@example.com',extensions.crypt('Password123!', extensions.gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{"first_name":"Man","last_name":"Conteh","phone":"+23276333444","role":"administrator"}',now(),now(),'','','','')
on conflict (id) do nothing;

insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select id, id::text, id, jsonb_build_object('sub',id::text,'email',email), 'email', now(), now(), now()
from auth.users where id in (
  '10000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000003'
) on conflict (provider_id, provider) do nothing;

update public.profiles set role='conductor' where id='10000000-0000-0000-0000-000000000002';
update public.profiles set role='administrator' where id='10000000-0000-0000-0000-000000000003';

insert into public.routes (id,origin,destination,departure_time,duration,distance_km,fare,status,stops,operating_days) values
('rt-001','Central Terminal','East Station','08:30 AM','45 min',28,35,'active',array['Central Terminal','City Mall','Hospital Junc.','East Station'],'Mon - Sun'),
('rt-002','Waterfront','University Gate','09:15 AM','55 min',34,42,'active',array['Waterfront','Harbor Point','Tech Park','University Gate'],'Mon - Sat'),
('rt-003','Market Square','North Depot','10:00 AM','35 min',22,28,'active',array['Market Square','Civic Center','Industrial Park','North Depot'],'Mon - Sun'),
('rt-004','Airport Junction','Downtown Express','11:30 AM','50 min',40,50,'scheduled',array['Airport Junction','Toll Gate','Financial Center','Downtown Express'],'Daily')
on conflict (id) do nothing;

insert into public.buses (id,plate,model,capacity,route_id,conductor_id,status,amenities) values
('BUS-18','SL-1842','Mercedes-Benz Citaro (40 Seats)',40,'rt-001','10000000-0000-0000-0000-000000000002','In Service',array['High-speed WiFi','Air Conditioning','USB Charging','CCTV']),
('BUS-21','SL-2108','Volvo 7900 Hybrid (45 Seats)',45,'rt-002',null,'Ready',array['Air Conditioning','Luggage Rack','Wheelchair Ramp']),
('BUS-14','SL-1405','Scania Citywide (38 Seats)',38,'rt-003',null,'In Service',array['Air Conditioning','USB Charging']),
('BUS-09','SL-0919','Yutong Luxury Coach (50 Seats)',50,'rt-004',null,'Standby',array['High-speed WiFi','Air Conditioning','Reclining Seats','Overhead Video'])
on conflict (id) do nothing;

insert into public.trips (id,trip_number,bus_id,route_id,conductor_id,departure_at,estimated_arrival_at,status,current_stop_index) values
('TRIP-301','EXP-101','BUS-18','rt-001','10000000-0000-0000-0000-000000000002','2026-08-25 08:30:00+00','2026-08-25 09:15:00+00','Boarding',0),
('TRIP-302','EXP-102','BUS-21','rt-002',null,'2026-08-25 09:15:00+00','2026-08-25 10:10:00+00','Scheduled',0),
('TRIP-303','REG-204','BUS-14','rt-003',null,'2026-08-25 10:00:00+00','2026-08-25 10:35:00+00','Scheduled',0)
on conflict (id) do nothing;

insert into public.tickets (id,reference,passenger_id,route_id,trip_id,passenger_name,passenger_phone,travel_date,seat_number,bus_id,fare,status,payment_method,purchased_at) values
('ticket-001','BT-2026-0148','10000000-0000-0000-0000-000000000001','rt-001','TRIP-301','Aminata Kamara','+23276123456','2026-08-25','12A','BUS-18',35,'unused','Orange Money','2026-08-25 07:15:00+00')
on conflict (id) do nothing;

insert into public.payments (id,ticket_id,passenger_id,amount,method,status,transaction_ref,paid_at) values
('PAY-9001','ticket-001','10000000-0000-0000-0000-000000000001',35,'Orange Money','Successful','OM-8839210','2026-08-25 07:15:00+00')
on conflict (id) do nothing;

insert into public.manifest_passengers(id,trip_id,ticket_id) values ('P-101','TRIP-301','ticket-001') on conflict (id) do nothing;

insert into public.user_preferences(user_id) values
('10000000-0000-0000-0000-000000000001'),('10000000-0000-0000-0000-000000000002'),('10000000-0000-0000-0000-000000000003')
on conflict (user_id) do nothing;

insert into public.notifications(user_id,title,message,type) values
('10000000-0000-0000-0000-000000000001','Boarding Pass Ready','Ticket BT-2026-0148 for Central Terminal is ready.','ticket'),
('10000000-0000-0000-0000-000000000001','Payment Confirmed','Orange Money payment of NLe 35 settled successfully.','payment'),
('10000000-0000-0000-0000-000000000002','Shift Started on BUS-18','Trip EXP-101 is boarding at Central Terminal.','bus'),
('10000000-0000-0000-0000-000000000003','System Ready','Supabase database integration is active.','system');
