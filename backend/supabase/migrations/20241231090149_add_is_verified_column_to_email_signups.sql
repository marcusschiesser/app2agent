alter table public.email_signups
add column is_verified boolean default false not null;