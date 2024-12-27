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

Create a `.env` file in the root landing-page project and add the following variables:

NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY= **service_role key**
NEXT_PUBLIC_SUPABASE_ANON_KEY = **anon key**
RESEND_API_KEY=Resend API key // get it here: https://resend.com/api-keys

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
