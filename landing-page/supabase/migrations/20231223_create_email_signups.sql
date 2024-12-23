-- Create email_signups table
CREATE TABLE IF NOT EXISTS email_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add a unique constraint on email to prevent duplicates
    CONSTRAINT email_signups_email_unique UNIQUE (email)
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS email_signups_email_idx ON email_signups (email);

-- Add row level security (RLS) policies
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Policy to prevent unauthorized reads
CREATE POLICY "Prevent unauthorized reads"
ON email_signups
FOR SELECT
TO authenticated
USING (auth.role() = 'service_role');

-- Policy to allow inserts from the service role
CREATE POLICY "Allow service role inserts"
ON email_signups
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'service_role');
