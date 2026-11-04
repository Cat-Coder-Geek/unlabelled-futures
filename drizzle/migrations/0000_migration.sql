create type public.app_role as enum ('admin','moderator','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  category text not null check (category in ('stereotyping','discrimination','unfair_treatment','bullying_harassment','other')),
  description text not null check (char_length(description) between 10 and 5000),
  contact text check (contact is null or char_length(contact) <= 200),
  anonymous boolean not null default true,
  evidence_path text,
  status text not null default 'received' check (status in ('received','under_review','escalated','resolved','closed')),
  user_id uuid,
  staff_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, update on public.reports to authenticated;
grant all on public.reports to service_role;
alter table public.reports enable row level security;
create policy "Safeguarding staff read reports" on public.reports for select to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator'));
create policy "Safeguarding staff update reports" on public.reports for update to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator'));

create or replace function public.submit_report(_category text, _description text, _contact text, _anonymous boolean, _evidence_path text)
returns text language plpgsql security definer set search_path = public as $$
declare ref text;
begin
  ref := 'UNL-' || to_char(now(),'YYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text),1,6));
  insert into public.reports(reference, category, description, contact, anonymous, evidence_path, user_id)
  values (ref, _category, _description,
    case when _anonymous then null else nullif(trim(_contact),'') end,
    _anonymous, _evidence_path,
    case when _anonymous then null else auth.uid() end);
  return ref;
end $$;
grant execute on function public.submit_report(text,text,text,boolean,text) to anon, authenticated;

create table public.platform_counters (
  key text primary key check (key in ('myths_challenged','stories_shared','resources_explored')),
  value bigint not null default 0
);
grant select on public.platform_counters to anon, authenticated;
grant all on public.platform_counters to service_role;
alter table public.platform_counters enable row level security;
create policy "Counters are public" on public.platform_counters for select to anon, authenticated using (true);
insert into public.platform_counters(key, value) values ('myths_challenged',0),('stories_shared',0),('resources_explored',0);

create or replace function public.increment_counter(_key text)
returns void language sql security definer set search_path = public as $$
  update public.platform_counters set value = value + 1 where key = _key;
$$;
grant execute on function public.increment_counter(text) to anon, authenticated;

create or replace function public.get_impact()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'myths_challenged', (select value from platform_counters where key='myths_challenged'),
    'stories_shared', (select value from platform_counters where key='stories_shared'),
    'resources_explored', (select value from platform_counters where key='resources_explored'),
    'reports_submitted', (select count(*) from reports)
  )
$$;
grant execute on function public.get_impact() to anon, authenticated;

create policy "Anyone can upload evidence" on storage.objects for insert to anon, authenticated with check (bucket_id = 'evidence');
create policy "Staff read evidence" on storage.objects for select to authenticated
  using (bucket_id = 'evidence' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'moderator')));