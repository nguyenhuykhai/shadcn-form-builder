# Shadcn Form Builder (React + Vite)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Optional: copy env example and set Vite env vars (e.g. PostHog):

   ```bash
   cp .env.example .env
   ```

3. Start dev server:

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`. Root `/` redirects to `/playground`.

## Scripts

- `npm run dev` – Vite dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint
- `npm run test` – Run Vitest

## Env vars (Vite)

Use the `VITE_` prefix for client-side env. Set them in `.env` (gitignored). Supported variables:

- `VITE_POSTHOG_KEY` – PostHog project API key
- `VITE_POSTHOG_HOST` – PostHog host (e.g. `https://app.posthog.com`)
- `VITE_APP_URL` – App URL (optional, defaults to current origin)