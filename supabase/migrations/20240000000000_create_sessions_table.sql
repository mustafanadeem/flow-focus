-- Create sessions table
create table
if not exists public.sessions
(
  id uuid default uuid_generate_v4
() primary key,
  user_id uuid references auth.users
(id),
  type text not null check
(type in
('Focus', 'Break', 'Long Break')),
  duration integer not null,
  created_at timestamp
with time zone default timezone
('utc'::text, now
()) not null
);

-- Enable RLS
alter table public.sessions enable row level security;

-- Create policy to allow users to see only their own sessions
create policy "Users can view their own sessions"
  on public.sessions
  for
select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own sessions
create policy "Users can insert their own sessions"
  on public.sessions
  for
insert
  with check (auth.uid() =
user_id); 