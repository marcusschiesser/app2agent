-- Create user_manuals table
create table if not exists user_manuals (
    id uuid default gen_random_uuid() primary key,
    url text not null unique,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS without any policies
-- This blocks all access except service_role
alter table user_manuals enable row level security;

-- Create function to automatically update updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger set_updated_at
    before update on user_manuals
    for each row
    execute procedure handle_updated_at();
