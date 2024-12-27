-- Add user_id column and foreign key constraint
alter table public.user_manuals
add column user_id uuid references auth.users(id) not null;

-- Add gemini_key column
alter table public.user_manuals
add column gemini_key text;

-- Update RLS policies to include the new columns
create policy "Users can update their own manual's gemini_key"
  on public.user_manuals
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
