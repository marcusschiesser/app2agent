-- Add api_key column to user_manuals table
alter table public.user_manuals
add column api_key text;

-- Update RLS policies to include the new column
create policy "Users can update their own api key"
  on public.user_manuals
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id); 