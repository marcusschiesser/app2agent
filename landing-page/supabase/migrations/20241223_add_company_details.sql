-- Add company name and comment columns to email_signups table
ALTER TABLE email_signups
ADD COLUMN company_name TEXT,
ADD COLUMN internal_comment TEXT;
