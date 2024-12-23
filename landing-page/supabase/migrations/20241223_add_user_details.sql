-- Add new columns to email_signups table
ALTER TABLE email_signups
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS intended_usage TEXT;

-- Create indexes for potential future filtering/searching
CREATE INDEX IF NOT EXISTS email_signups_name_idx ON email_signups (name);
CREATE INDEX IF NOT EXISTS email_signups_intended_usage_idx ON email_signups (intended_usage);

-- Update the existing policies to include the new columns
DROP POLICY IF EXISTS "Allow service role inserts" ON email_signups;
CREATE POLICY "Allow service role inserts"
ON email_signups
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'service_role');

COMMENT ON COLUMN email_signups.name IS 'Optional user name';
COMMENT ON COLUMN email_signups.intended_usage IS 'Optional description of how the user intends to use the solution';
