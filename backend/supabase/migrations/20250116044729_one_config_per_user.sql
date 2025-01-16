-- First, delete duplicate entries keeping only the first one per user
DELETE FROM
    public.user_manuals a USING public.user_manuals b
WHERE
    a.user_id = b.user_id
    AND a.created_at < b.created_at;

ALTER TABLE
    public.user_manuals DROP CONSTRAINT user_manuals_url_key;

ALTER TABLE
    public.user_manuals
ADD
    CONSTRAINT user_manuals_user_id_key UNIQUE (user_id);