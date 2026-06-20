-- ÉCLAT Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query → Paste → Run)

-- ============================================================
-- 1. CREATORS TABLE
-- ============================================================
create table if not exists public.creators (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  username text,
  niche text default 'general',
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.creators enable row level security;

-- Policies: users can only see/modify their own row
create policy "Users can view own creator profile"
  on public.creators for select
  using (auth.uid() = user_id);

create policy "Users can insert own creator profile"
  on public.creators for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creator profile"
  on public.creators for update
  using (auth.uid() = user_id);

-- Auto-confirm email when a new user signs up (bypasses manual email confirmation)
create or replace function public.handle_auto_confirm_user()
returns trigger as $$
begin
  new.email_confirmed_at := now();
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created_auto_confirm on auth.users;
create trigger on_auth_user_created_auto_confirm
  before insert on auth.users
  for each row execute procedure public.handle_auto_confirm_user();

-- Auto-create creator row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.creators (user_id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. POSTS TABLE
-- ============================================================
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.creators(id) on delete cascade not null,
  platform text default 'instagram',
  
  -- Video metadata (from upload guidance form)
  video_length integer,           -- seconds
  has_text_overlay boolean default false,
  audio_type text default 'none', -- 'trending', 'original', 'none'
  is_original boolean default true,
  caption_text text,
  dish_topic text,
  
  -- Computed results
  hook_score integer default 0,   -- 0-100
  checklist_results jsonb,        -- 7-point pass/fail details
  generated_caption text,         -- auto-generated caption template
  
  -- Post performance stats (filled later via analyze page)
  upload_time timestamptz,
  views integer default 0,
  likes integer default 0,
  shares integer default 0,
  saves integer default 0,
  comments integer default 0,
  completion_rate numeric(5,2) default 0,
  evs_score numeric(5,2) default 0,
  
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.posts enable row level security;

-- Policies: users see only their own posts (via creator_id)
create policy "Users can view own posts"
  on public.posts for select
  using (
    creator_id in (
      select id from public.creators where user_id = auth.uid()
    )
  );

create policy "Users can insert own posts"
  on public.posts for insert
  with check (
    creator_id in (
      select id from public.creators where user_id = auth.uid()
    )
  );

create policy "Users can update own posts"
  on public.posts for update
  using (
    creator_id in (
      select id from public.creators where user_id = auth.uid()
    )
  );

create policy "Users can delete own posts"
  on public.posts for delete
  using (
    creator_id in (
      select id from public.creators where user_id = auth.uid()
    )
  );

-- ============================================================
-- 3. TRENDS TABLE (shared — no RLS, same data for all users)
-- ============================================================
create table if not exists public.trends (
  id uuid default gen_random_uuid() primary key,
  keyword text not null,
  category text default 'general',
  trend_score numeric(5,2) default 0,
  date date default current_date not null,
  platform text default 'youtube',
  video_id text,
  video_title text,
  thumbnail_url text,
  channel_name text,
  view_count bigint default 0,
  like_count bigint default 0,
  created_at timestamptz default now() not null,
  
  -- Prevent duplicate entries for same video on same day
  unique(video_id, date)
);

-- No RLS on trends — everyone sees the same data
-- But we still want to allow the cron job (service role) to write
-- and all authenticated users to read
alter table public.trends enable row level security;

create policy "Anyone can read trends"
  on public.trends for select
  to authenticated
  using (true);

create policy "Service role can insert trends"
  on public.trends for insert
  to service_role
  with check (true);

create policy "Service role can update trends"
  on public.trends for update
  to service_role
  using (true);

create policy "Service role can delete trends"
  on public.trends for delete
  to service_role
  using (true);

-- Also allow anon to read trends (for the cron job or public API)
create policy "Anon can read trends"
  on public.trends for select
  to anon
  using (true);

-- Allow authenticated and anon users to insert trends (for the API route using anon key)
create policy "Anyone can insert trends"
  on public.trends for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can delete old trends"
  on public.trends for delete
  to anon, authenticated
  using (true);

create policy "Anyone can update trends"
  on public.trends for update
  to anon, authenticated
  using (true);

-- ============================================================
-- 4. INDEXES for performance
-- ============================================================
create index if not exists idx_creators_user_id on public.creators(user_id);
create index if not exists idx_posts_creator_id on public.posts(creator_id);
create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_trends_date on public.trends(date desc);
create index if not exists idx_trends_score on public.trends(trend_score desc);
