-- Create new api_keys table
create table public.api_keys (
    key uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) not null,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add RLS policies for api_keys table
alter table
    public.api_keys enable row level security;

create policy "Users can view their own api keys" on public.api_keys for
select
    to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own api keys" on public.api_keys for
insert
    to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own api keys" on public.api_keys for
update
    to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete their own api keys" on public.api_keys for delete to authenticated using (auth.uid() = user_id);

-- Create index for faster lookups
create index api_keys_user_id_idx on public.api_keys(user_id);

create index api_keys_key_idx on public.api_keys(key);

create index api_keys_active_idx on public.api_keys(is_active);