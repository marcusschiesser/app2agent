# App2Agent

This repository contains both the backend service and the browser extension for App2Agent. Follow these instructions to get started with development.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Google Gemini API key

## Project Structure

- `/backend` - Backend service
- `/extension` - Browser extension

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. **Configure seed data (IMPORTANT - Do this BEFORE starting Supabase):**

Navigate to `backend/supabase/seed.sql` and update the following:

```sql
-- Replace 'your gemini key here' with your actual Google Gemini API key
INSERT INTO user_manuals (...) VALUES (
    ...
    'your gemini key here',  -- ← Replace this with your Gemini API key
    ...
);
```

### Configure Website URL
Choose based on your development approach:

**For Inject Script Development:**
```sql
'localhost:3001',  -- Use this for inject script testing
```

**For Browser Extension Development:**
```sql
'www.linkedin.com',  -- Or any website you want to test the extension on
```

### Update Context Instructions
The `context` field contains step-by-step instructions for the AI assistant. Customize this based on your website:

```sql
context,
-- Current LinkedIn example:
'To edit the services that a user provides on LinkedIn, follow these steps:
1. Click the Me icon at the top of your LinkedIn homepage.
2. Click "View profile".
3. Click on "View my Services" button.
4. Click on "Edit Services".
   Modify the services you want to edit in the pop-up window that appears.'

-- Replace with your website-specific instructions, for example:
'To navigate your website, follow these steps:
1. Click on the main navigation menu
2. Select the section you want to access
3. Use the search function to find specific content
4. Contact support if you need additional help'
```

### Update AI Assistant Prompt
The `prompt` field defines the AI assistant's behavior and personality:

```sql
prompt
-- Current example:
'You are an AI assistant for the App2Agent test environment. Help users test the extension functionality. Provide clear and concise responses to demonstrate how the AI assistant works.'

-- Customize for your use case, for example:
'You are a helpful customer support assistant for [Your Company]. You help users navigate the website, answer questions about our services, and provide technical support. Always be friendly, professional, and concise in your responses.'
```

### Complete Example Configuration
```sql
INSERT INTO user_manuals (
    id,
    url,
    context,
    created_at,
    updated_at,
    gemini_key,
    user_id,
    prompt
) VALUES (
    'c2d6f9a0-1f1a-4c1c-9cf3-b7d286e7a5f1',
    'localhost:3001',  -- Your target URL
    'Your custom step-by-step instructions for using your website...',  -- Your context
    '2024-12-31 12:23:22+07',
    '2024-12-31 12:23:22+07',
    'your_actual_gemini_api_key_here',  -- Your Gemini API key
    'd0e7df0e-3f3a-4d3c-9e4b-b7d286e7a5f2',
    'Your custom AI assistant prompt and personality...'  -- Your prompt
);
```

3. Start the backend service:

```bash
cd backend
```

## Setup Supabase for local development

```bash
npx supabase start
```

This will automatically:
- Create the database
- Apply all migrations
- **Run the seed.sql file with your configured Gemini API key and website**

Retrieve supabase status:

```bash
npx supabase status
```

Create a `.env` file in the backend directory and add the following variables (get these from `supabase status`):

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY=your_service_role_key_from_supabase_status
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_status
```

## Chrome Extension ID Configuration

To secure the communication between the Chrome extension and the backend, you need to configure the `ALLOWED_EXTENSION_IDS` environment variable. This is a security measure that ensures only authorized extensions can access the backend API.

### Getting the Extension ID

The extension ID can be found in two ways:

1. During development: The ID is automatically logged to the console when the extension makes API calls. Look for the log message "Chrome extension ID:" in your browser's developer tools console.
2. In production: The ID is assigned by the Chrome Web Store when you publish your extension.

### Setting up ALLOWED_EXTENSION_IDS

Add the following to your `.env` file:

```bash
ALLOWED_EXTENSION_IDS=your_extension_id_here
```

## Start the development servers

For backend run:
```bash
cd backend
pnpm dev
```
The backend service will run on `http://localhost:3000` by default

## Extension Development Options

Choose one of the following based on how you want to use App2Agent:

### Option 1: Inject Script Development

4a. Start the inject script development server:

```bash
cd extension
pnpm dev
```

This will:
- Open a sample website at `http://localhost:3001` 
- Automatically inject the App2Agent script into the page
- Perfect for testing the inject script functionality

**Make sure your seed.sql is configured with `'localhost:3001'` as the URL.**

### Option 2: Browser Extension Development

4b. Build the extension for Chrome:

```bash
cd extension
pnpm dev:sidepanel
```

Then load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist/sidepanel` directory
5. The extension will appear as a side panel in Chrome

**Make sure your seed.sql is configured with the website URL you want to test (e.g., `'www.linkedin.com'`).**


## Testing the Setup

After setup, you can test with the pre-configured API key from seed.sql:

**API Key**: `f47ac10b-58cc-4372-a567-0e02b2c3d479`

## Usage Options

### Browser Extension
- Configure the URL in seed.sql to match the website you want to test
- Load the extension in Chrome/Edge
- Use the pre-seeded API key for testing

### Inject Script
- Set the domain in seed.sql to match where you'll inject the script
- The inject script can be embedded in any website you control
- Access the script at `http://localhost:3000/extension/inject.js`

## Additional Information

- The project uses pnpm workspaces for managing dependencies
- Make sure to run `pnpm install` from the root directory to install all dependencies
- The seed.sql file runs automatically when you start Supabase for the first time
- Check the respective directories for more specific setup instructions

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3)
with an additional hosting restriction. Only Schiesser IT, LLC is permitted
to host, deploy, or run the software on a server or network-accessible environment - see the [LICENSE](LICENSE) file for details.
