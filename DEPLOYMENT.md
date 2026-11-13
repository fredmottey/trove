# Deploy Trove

## Provider setup (one time)

1. Use `origin` at `https://github.com/fredmottey/trove.git`. Fetch and inspect upstream history before integrating this checkout; preserve uncommitted work and do not force-push.
2. Connect Vercel to that repository, framework Vite, Node 22. Git automatic deployments are disabled by `vercel.json`; CircleCI handles production after checks.
3. Connect CircleCI to the repo. Create context `trove-production`, restrict it to the project and trusted `main` deployment jobs using CircleCI expression/security restrictions. Never pass it to fork/PR verification jobs. Configure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, and `SUPABASE_DB_PASSWORD` there. Secrets belong in provider secret stores, never this repo or chat.
4. In Supabase `abkfayyocpyzhbdsvlbv`, inspect existing tables, policies, migration history, and auth configuration. Review `supabase/migrations/20261113000100_trove.sql`. Verify `trove_*` names are unused and reconcile migration history deliberately if this is an existing managed database. Apply the additive migration only after that inspection. No reset or automatic history repair.
5. Configure Vercel production variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` using the project's URL/public key. Never put secret/service-role keys in `VITE_*` variables. Without these variables the public demo still works and sign-in is disabled.
6. Supabase Auth: add `https://trove.fredmottey.dev/profile` to allowed redirects. Preserve existing site URL and other apps' settings in this shared project. Configure a verified email sender if reset/invite email delivery requires it.
7. Invite the initial user in Supabase Auth (or reuse their existing account). Insert its user UUID into `public.trove_members` as an administrator. Membership is not self-service. Leave public project signup settings unchanged; nonmembers have no Trove access.
8. Add `trove.fredmottey.dev` to the Vercel project. Use exactly the DNS target Vercel returns in Cloudflare; start DNS-only and leave root-domain records unchanged. Verify TLS/domain status.

## Local development and checks

Use Node 22 (`nvm use`), then `npm ci` and `npm run dev` (port 8080). The browser-only demo needs no `.env`. To use a configured private project, copy `.env.example` to `.env.local` and set its public key.

- `npm run lint`
- `npm run typecheck`
- `npm test` — small unit, browser-storage, and embedded PostgreSQL integration suite
- `npm run build`
- `npx playwright install chromium` then `npm run test:e2e` — public demo smoke at desktop/mobile sizes; private smoke runs when disposable local credentials are provided

`npm test` also applies the actual migration in embedded PostgreSQL and checks ownership, membership, rating constraints, and transaction rollback without Docker. It stubs only Supabase Auth identity helpers.

For the full Supabase database/private smoke, install Docker and run `npx supabase start`, `npm run test:db`, and `node scripts/test-local-env.mjs`. That helper creates a disposable local user and exports local test settings to `/tmp/trove-test-env`. Source that file before `npm run test:e2e`. Never run the helper against a hosted database. `npx supabase stop --no-backup` stops local containers. The local fixture creator expects a freshly initialized local stack.

## Deployment and rollback

Push trusted changes to `main` in `fredmottey/trove`. CircleCI checks lint/types/unit tests, starts disposable Supabase, checks database policies, and exercises Chromium at two sizes. Its serialized deploy job applies migrations and uses the pinned Vercel CLI to build and deploy the verified commit.

After deploying, verify `/`, `/map`, `/profile`, direct review-route refresh, sign-in, save/review/reload, logout/cache clearing, reset, and a second account's isolation. The Vercel deployment URL and domain TLS status must be verified before calling deployment complete.

Rollback frontend using Vercel's previous deployment promotion. Database changes here are additive; do not drop hosted tables to roll back the frontend. Take a database backup/export before future destructive migrations. Keep old/new schema compatibility when deploying later migrations.

## Later self-hosting

Build static `dist/` and serve through any HTTPS static host with SPA fallback. Run self-hosted Supabase with its official Docker setup, migrate the versioned SQL, export/import application data and separately migrate Auth/users using the documented Supabase migration workflow, then change the frontend URL/public key and auth redirects. Back up PostgreSQL and manage SMTP, TLS, updates, and monitoring. This repository does not provision that infrastructure yet.
