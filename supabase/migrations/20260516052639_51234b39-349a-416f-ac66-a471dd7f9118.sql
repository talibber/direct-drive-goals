
-- coaching_events
create table public.coaching_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal_id uuid,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.coaching_events enable row level security;
create policy "Users view own events" on public.coaching_events for select to authenticated using (auth.uid() = user_id);
create policy "Users create own events" on public.coaching_events for insert to authenticated with check (auth.uid() = user_id);
create policy "Coaches view all events" on public.coaching_events for select to authenticated using (true);
create policy "Coaches create events" on public.coaching_events for insert to authenticated with check (true);
create index on public.coaching_events (user_id, created_at desc);

-- coach_message_drafts
create table public.coach_message_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal_id uuid,
  event_id uuid references public.coaching_events(id) on delete cascade,
  trigger_type text not null,
  ai_draft text not null,
  final_message text,
  status text not null default 'pending',
  confidence_score numeric not null default 0,
  suggested_tone text,
  approved_by uuid,
  approved_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.coach_message_drafts enable row level security;
create policy "Users view own sent drafts" on public.coach_message_drafts for select to authenticated using (auth.uid() = user_id and status = 'sent');
create policy "Coaches view all drafts" on public.coach_message_drafts for select to authenticated using (true);
create policy "Coaches create drafts" on public.coach_message_drafts for insert to authenticated with check (true);
create policy "Coaches update drafts" on public.coach_message_drafts for update to authenticated using (true);
create trigger trg_drafts_updated before update on public.coach_message_drafts for each row execute function public.update_updated_at_column();
create index on public.coach_message_drafts (status, created_at desc);

-- coach_style_learning
create table public.coach_style_learning (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null,
  draft_id uuid references public.coach_message_drafts(id) on delete cascade,
  phrase_added text,
  phrase_removed text,
  tone_shift text,
  pressure_level numeric,
  encouragement_level numeric,
  directness_level numeric,
  humor_level numeric,
  example_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.coach_style_learning enable row level security;
create policy "Coaches view all learning" on public.coach_style_learning for select to authenticated using (true);
create policy "Coaches insert learning" on public.coach_style_learning for insert to authenticated with check (true);

-- user_coaching_profiles
create table public.user_coaching_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  preferred_tone text not null default 'balanced',
  motivation_pattern text,
  avoidance_pattern text,
  common_blockers jsonb not null default '[]'::jsonb,
  completion_rate numeric not null default 0,
  reply_rate numeric not null default 0,
  breach_count integer not null default 0,
  at_risk_count integer not null default 0,
  missed_goal_count integer not null default 0,
  last_engagement_at timestamptz,
  coaching_notes jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_coaching_profiles enable row level security;
create policy "Users view own profile" on public.user_coaching_profiles for select to authenticated using (auth.uid() = user_id);
create policy "Coaches view all profiles" on public.user_coaching_profiles for select to authenticated using (true);
create policy "Coaches upsert profiles" on public.user_coaching_profiles for insert to authenticated with check (true);
create policy "Coaches update profiles" on public.user_coaching_profiles for update to authenticated using (true);
create trigger trg_profiles_updated before update on public.user_coaching_profiles for each row execute function public.update_updated_at_column();

-- message_learning_outcomes
create table public.message_learning_outcomes (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.coach_message_drafts(id) on delete cascade,
  user_id uuid not null,
  user_replied boolean not null default false,
  user_reply_text text,
  next_action_completed boolean not null default false,
  goal_status_after_message text,
  engagement_score numeric not null default 0,
  created_at timestamptz not null default now()
);
alter table public.message_learning_outcomes enable row level security;
create policy "Users view own outcomes" on public.message_learning_outcomes for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own outcomes" on public.message_learning_outcomes for insert to authenticated with check (auth.uid() = user_id);
create policy "Coaches view all outcomes" on public.message_learning_outcomes for select to authenticated using (true);
create policy "Coaches insert outcomes" on public.message_learning_outcomes for insert to authenticated with check (true);
create policy "Coaches update outcomes" on public.message_learning_outcomes for update to authenticated using (true);
