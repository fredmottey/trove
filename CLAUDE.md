# Working in Trove

Read `AGENTS.md` for repository conventions, `DECISIONS.md` for implementation scope, and `DEPLOYMENT.md` for provider setup and deployment. Use the product name **Trove**.

## Commands

```sh
npm ci
npm run dev          # port 8080
npm run build
npm run typecheck
npm run lint
npm test             # focused unit and embedded PostgreSQL integration tests
npm run test:e2e     # Chromium mobile/desktop smoke tests
npm run test:db      # full local Supabase tests; requires Docker
```

## Architecture

- Active UI: `src/trove/`, mounted by `src/App.tsx`. Older `src/pages/` components are retained scaffold, not active routes.
- Public demo persists in browser storage; invited private libraries use Supabase. Keep their data and query caches separate.
- Shared data interfaces and validation live in `src/trove/model.ts`; sourced DC starter restaurants live in `src/trove/seeds.ts`.
- Four optional 1–5 rating dimensions: food, ambiance, service, vibe. At least one is required to publish.
- SQL migrations are additive and namespaced `trove_*`. Inspect the existing hosted project before applying migrations; preserve unrelated data and authentication settings.
- Capacitor uses `dev.fredmottey.trove` and bundled `dist/` assets. Native platform directories are not checked in.
- Repository: `fredmottey/trove`. Preserve uncommitted changes and upstream history.
