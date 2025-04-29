-- machines table (if not already)
create table if not exists public.machines (
  id           uuid primary key default gen_random_uuid(),
  hostname     text not null unique,
  status       text not null default 'available' check (status in ('available','occupied')),
  current_session uuid references public.sessions(id),
  name         text not null,
  specs        text not null,
  hourly_rate  numeric not null
);

-- commands table
create table if not exists public.commands (
  id         uuid primary key default gen_random_uuid(),
  machine_id uuid not null references public.machines(id),
  action     text not null check (action in ('changePassword','lockWorkstation')),
  payload    jsonb,
  dispatched boolean not null default false,
  created_at timestamp with time zone default now()
);

-- sessions table (if not exists)
create table if not exists public.sessions (
  id           uuid primary key default gen_random_uuid(),
  machine_id   uuid not null references public.machines(id),
  user_id      uuid not null references auth.users(id),
  start_time   timestamp with time zone default now(),
  end_time     timestamp with time zone,
  duration     integer, -- in minutes
  cost         numeric,
  temp_password text
);

-- enable realtime on machines and commands tables
alter publication supabase_realtime add table public.machines;
alter publication supabase_realtime add table public.commands; 