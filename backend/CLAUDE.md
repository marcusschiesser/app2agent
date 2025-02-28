# CLAUDE.md - App2Agent Backend Guidelines

## Build & Development Commands

- `pnpm dev` - Run development server with Turbopack
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm start` - Start production server

## Supabase Commands

- `pnpm sp:start` - Start Supabase local development
- `pnpm sp:stop` - Stop Supabase
- `pnpm sp:reset` - Reset Supabase database
- `pnpm sp:generate-migration` - Generate migration from changes

## Project Structure

- Next.js 15 with App Router organization in `app` folder
- Route groups:
  - `(auth)`: Authentication related pages (uses shadcn/ui + Tailwind)
  - `(extension)`: Routes used by the browser extension
  - `(landing)`: Landing page routes (uses Tailwind only)
- Shared components for route groups in `components` subfolder
- Supabase config in `supabase` folder for auth and data storage

## Code Style Guidelines

- **Imports**: Use absolute imports with `@/` alias for src directory
- **TypeScript**: Strict mode enabled, explicitly type props interfaces
- **Components**: Use React functional components with explicit prop types
- **Naming**: PascalCase for components, camelCase for functions/variables
- **CSS**: Use Tailwind with `cn()` utility for class merging
- **Error Handling**: Use React's error boundaries and try/catch where appropriate
- **State Management**: Use React hooks (useState, useEffect, useTransition)
- **UI Components**: Use shadcn/ui components from the /components/ui directory - But not for the landing page!
- **Icons**: Use 'lucide-react' for icons.
