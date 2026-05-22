-- ============================================================
-- Ticket Agent — Full Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Members
create table if not exists members (
  id          bigserial primary key,
  name        text not null,
  email       text,
  password    text,
  membership  text,
  club        text,
  points      int default 0,
  status      text default 'inactive',
  created_at  timestamptz default now()
);

-- Ticket Drops
create table if not exists drops (
  id            bigserial primary key,
  match         text not null,
  club          text,
  match_date    text,
  drop_time     text,
  points_needed int default 0,
  tickets       int default 0,
  close_count   int default 0,
  status        text default 'expected',
  created_at    timestamptz default now()
);

-- Ballots
create table if not exists ballots (
  id          bigserial primary key,
  match       text not null,
  club        text,
  open_date   text,
  close_date  text,
  applied     int default 0,
  total       int default 100,
  status      text default 'open',
  created_at  timestamptz default now()
);

-- Ballot Applications
create table if not exists ballot_applications (
  id          bigserial primary key,
  member_id   bigint references members(id) on delete cascade,
  ballot_id   bigint references ballots(id) on delete cascade,
  sectors     text[],
  created_at  timestamptz default now()
);

-- Pullers
create table if not exists pullers (
  id          bigserial primary key,
  name        text,
  contact     text,
  phone       text,
  attempted   int default 0,
  successful  int default 0,
  failed      int default 0,
  earnings    numeric default 0,
  status      text default 'active',
  created_at  timestamptz default now()
);

-- Puller assignments (puller ↔ drop)
create table if not exists puller_assignments (
  id          bigserial primary key,
  puller_id   bigint references pullers(id) on delete cascade,
  drop_id     bigint references drops(id) on delete cascade,
  member_id   bigint references members(id) on delete cascade,
  created_at  timestamptz default now()
);

-- Tickets
create table if not exists tickets (
  id            bigserial primary key,
  match         text,
  club          text,
  member        text,
  account       text,
  face_value    numeric default 0,
  listed_price  numeric default 0,
  platform      text,
  status        text default 'held',
  profit        numeric default 0,
  created_at    timestamptz default now()
);

-- P&L Entries
create table if not exists pnl_entries (
  id              bigserial primary key,
  drop_name       text,
  club            text,
  date            text,
  gross_revenue   numeric default 0,
  face_value      numeric default 0,
  platform_fees   numeric default 0,
  account_costs   numeric default 0,
  puller_fees     numeric default 0,
  status          text default 'pending',
  created_at      timestamptz default now()
);

-- Email Logs
create table if not exists email_logs (
  id            bigserial primary key,
  subject       text,
  from_address  text,
  member        text,
  club          text,
  type          text,
  received_at   timestamptz default now(),
  processed     boolean default false
);

-- Ban Checks
create table if not exists ban_checks (
  id          bigserial primary key,
  member      text,
  club        text,
  membership  text,
  status      text default 'clean',
  checked_at  timestamptz default now()
);

-- Club Links
create table if not exists club_links (
  id          bigserial primary key,
  member      text,
  club        text,
  link        text,
  expires_at  timestamptz,
  status      text default 'active',
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS: disable for now (enable + add policies when ready)
-- ============================================================
alter table members            disable row level security;
alter table drops              disable row level security;
alter table ballots            disable row level security;
alter table ballot_applications disable row level security;
alter table pullers            disable row level security;
alter table puller_assignments disable row level security;
alter table tickets            disable row level security;
alter table pnl_entries        disable row level security;
alter table email_logs         disable row level security;
alter table ban_checks         disable row level security;
alter table club_links         disable row level security;
