# App2Agent

App2Agent is a voice agent that adds a voice agent to any website. It is build using the [Live API from LLamaIndexTS](https://ts.llamaindex.ai/docs/llamaindex/modules/models/llms/gemini#live-api-real-time-conversations).

Follow these instructions to get started with development.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Google Gemini API key (get it from [AI Studio](https://aistudio.google.com))

## Project Structure

- `/backend` - Backend service
- `/extension` - Browser extension

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the backend service:

```bash
cd backend
npx supabase start
```

This will automatically create a local Supabase database and apply all migrations.

Retrieve supabase status:

```bash
npx supabase status
```

Create a `.env` file in the `backend` directory and add the following variables (get these from `supabase status`):

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY=your_service_role_key_from_supabase_status
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_status
```

Then you can start the backend service:

```bash
pnpm dev
```

The backend service will run on `http://localhost:3000` by default

3. Configure the voice agent website

Go to `http://localhost:3000/auth` and login with the test user `'test@example.com'` to setup the website that you want the voice agent to work on.

The default configured website is `www.linkedin.com` (check [`seed.sql`](./backend/supabase/seed.sql) for the initial data).

> **Important**: Make sure to add a working Gemini API key that you get from [AI Studio](https://aistudio.google.com).

4. Start the Chrome extension:

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

After starting the extension you have to add the pre-configured app2agent API key from `seed.sql` in the extension:

**API Key**: `f47ac10b-58cc-4372-a567-0e02b2c3d479`

And then test the voice agent by going to http://www.linkedin.com

## Using the inject script

Instead of the Chrome extension, you can also use the inject script to test the voice agent.

**Important**: `url` in the `user_manuals` table must be configured with `'localhost:3001'` as the URL for this to work.

Start the inject script development server:

```bash
cd extension
pnpm dev
```

This will:

- Open a sample website at `http://localhost:3001`
- Automatically inject the App2Agent script into the page
- Perfect for testing the inject script functionality

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3)
with an additional hosting restriction. Only Schiesser IT, LLC is permitted
to host, deploy, or run the software on a server or network-accessible environment - see the [LICENSE](LICENSE) file for details.
