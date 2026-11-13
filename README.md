# Trove

Interactive DC restaurant prototype: a browser-local demo plus optional private Supabase libraries.

## Prototype setup

Use Node 22 (`nvm use`), then `npm ci` and `npm run dev`. No credentials are needed for the public demo.

Check changes with `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e` (install Chromium first). Database tests require Docker and local Supabase.

See [DEPLOYMENT.md](DEPLOYMENT.md) for CircleCI, database migrations, invites, Vercel, Cloudflare DNS, rollback, and self-hosting. See [DECISIONS.md](DECISIONS.md) for scope and seed provenance. Target source: `fredmottey/trove`; target URL: `https://trove.fredmottey.dev`. These are deployment targets, not a claim that the services are live.

## Repository and stack

Source: [fredmottey/trove](https://github.com/fredmottey/trove). Built with Vite, React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase. CircleCI verifies changes and deploys through Vercel.

## Native wrapper

Capacitor uses app ID `dev.fredmottey.trove` and loads the bundled `dist/` directory. Build the frontend before generating or syncing native projects. Native platform directories are not checked in.
