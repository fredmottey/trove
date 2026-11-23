# Deploy Trove

## Provider setup (one time)

1. Use `origin` at `https://github.com/fredmottey/trove.git`. Fetch and inspect upstream history before integrating this checkout; preserve uncommitted work and do not force-push.
2. Connect Vercel to that repository, framework Vite, Node 22. Git automatic deployments are disabled by `vercel.json`; GitHub Actions (`.github/workflows/ci.yml`) handles production after checks.
3. In GitHub, environment `production` is restricted to the `main` branch. Set `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, and `SUPABASE_DB_PASSWORD` as environment secrets with `gh secret set <NAME> --env production` (it prompts for the value). Only the `deploy` job uses that environment; pull-request and fork runs never receive the secrets. Secrets belong in provider secret stores, never this repo or chat. `.circleci/config.yml` is inactive and kept for reference; do not connect CircleCI while `ci.yml` is active, or both would deploy.
   A ruleset on `main` requires a pull request and the `static`, `unit`, `supabase-db`, and `playwright` checks, and blocks force-pushes and deletion. Repository admins can bypass it for emergencies.
4. Supabase project `pmydadqtvfmgnbjklwam` (Postgres 17) is dedicated to Trove and was created empty in November 2026. The first `deploy` run applies every file in `supabase/migrations/` in order, starting with the original `20250622135249` profile/auth migration (retained unchanged). Later migrations stay additive. Never reset the database or repair migration history automatically. The former project `abkfayyocpyzhbdsvlbv` was paused past its restore window; its June 2025 backup contained no users or app data and is not used.
5. Configure Vercel production variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` using the project's URL/public key. Never put secret/service-role keys in `VITE_*` variables. Without these variables the public demo still works and sign-in is disabled.
6. Supabase Auth: set the site URL to `https://trove.fredmottey.dev`, add `https://trove.fredmottey.dev/profile` to allowed redirects, and turn off "Allow new users to sign up". Configure a verified email sender if reset/invite email delivery requires it.
7. Invite the initial user in Supabase Auth. Insert its user UUID into `public.trove_members` as an administrator. Membership is not self-service, and with signup disabled only invited users have accounts; nonmembers have no Trove access.
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

Open a pull request against `main` in `fredmottey/trove`. GitHub Actions runs `static` (lint, types) first, then `unit`, `supabase-db` (disposable Supabase, database policies), and `playwright` (Chromium at two sizes) in parallel. On pull requests, `supabase-db` runs only when `supabase/**`, the lockfile, or the workflow changes, and `playwright` is skipped when only docs or non-browser tests change. Job summaries show test results, flaky tests (Playwright retries once in CI), and the slowest tests. After merge, every job runs on `main`, then the serialized `deploy` job applies migrations and uses the pinned Vercel CLI to build and deploy the verified commit.

After deploying, verify `/`, `/map`, `/profile`, direct review-route refresh, sign-in, save/review/reload, logout/cache clearing, reset, and a second account's isolation. The Vercel deployment URL and domain TLS status must be verified before calling deployment complete.

Rollback frontend using Vercel's previous deployment promotion. Database changes here are additive; do not drop hosted tables to roll back the frontend. Take a database backup/export before future destructive migrations. Keep old/new schema compatibility when deploying later migrations.

## Later self-hosting

Build static `dist/` and serve through any HTTPS static host with SPA fallback. Run self-hosted Supabase with its official Docker setup, migrate the versioned SQL, export/import application data and separately migrate Auth/users using the documented Supabase migration workflow, then change the frontend URL/public key and auth redirects. Back up PostgreSQL and manage SMTP, TLS, updates, and monitoring. This repository does not provision that infrastructure yet.
