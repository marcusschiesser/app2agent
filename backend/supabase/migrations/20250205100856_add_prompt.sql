-- Rename content column to context
ALTER TABLE
    user_manuals RENAME COLUMN content TO context;

-- Add nullable prompt column
ALTER TABLE
    user_manuals
ADD
    COLUMN prompt TEXT NULL;