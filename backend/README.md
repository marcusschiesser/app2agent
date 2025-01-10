# app2agent Landing Page

This is the landing page for app2agent's IT-Support product - an AI-powered IT support solution that can be added to any web app without code.

## Setup Supabase for local development

```bash
npx supabase start
```

Retrieve supabase status:

```bash
npx supabase status
```

Create a `.env` file in this project and add the following variables:

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY= **service_role key**
NEXT_PUBLIC_SUPABASE_ANON_KEY = **anon key**

To apply migrations to your local DB, run:

```bash
supabase migration up
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

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Modern, responsive design
- Email collection form for early access
- Built with Next.js 14 and TypeScript
- Styled with Tailwind CSS
- Optimized for SEO

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- React Icons
