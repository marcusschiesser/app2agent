-- First create a test user
INSERT INTO auth.users (id, email)
VALUES ('d0e7df0e-3f3a-4d3c-9e4b-b7d286e7a5f2', 'test@example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed data for user_manuals table
INSERT INTO
    user_manuals (
        id,
        url,
        content,
        created_at,
        updated_at,
        gemini_key,
        user_id
    )
VALUES
    (
        'c2d6f9a0-1f1a-4c1c-9cf3-b7d286e7a5f1',
        'linkedin.com',
        'To edit the services that a user provides on LinkedIn, follow these steps:
1. Click the Me icon at the top of your LinkedIn homepage.
2. Click "View profile".
3. Click the "View my Services" button.
4. Click on "Edit Services".
   Modify the services you want to edit in the pop-up window that appears.',
        '2024-12-31 12:23:22+07',
        '2024-12-31 12:23:22+07',
        'your key',
        'd0e7df0e-3f3a-4d3c-9e4b-b7d286e7a5f2'
    );