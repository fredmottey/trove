# Working in Trove

Trove is a mobile-first restaurant discovery and review app. Read `README.md` and `CLAUDE.md` for additional project context; verify their descriptions against the code.

For product implementation, also read `PRD.md`: it describes the intended MVP, not current functionality. Preserve its Confirmed/Prior proposal/Default/Open distinctions, keep deferred features out of scope, and record departures from its defaults in `DECISIONS.md`. Its neutral naming and five-dimension defaults differ from the current Trove name and four-rating UI; do not silently undo existing decisions.

## Workflow and commands

- Inspect `git status` and the existing diff before editing. Preserve unrelated work, including untracked files. Check upstream before integrating changes and do not blindly pull into a dirty worktree.
- Use npm and `package-lock.json` as the single dependency lockfile. Avoid incidental lockfile changes.
- Install: `npm ci` (Capacitor peer dependency is now explicit). Develop: `npm run dev` (port 8080). Preview a build: `npm run preview`.
- Validate code changes with `npm run build`, `npm run lint`, and `npx --no-install tsc --noEmit -p tsconfig.app.json`. For Vite config changes, also run `npx --no-install tsc --noEmit -p tsconfig.node.json`.
- Keep tests focused: `npm test`, `npm run test:e2e`, and `npm run test:db`. Report checks that cannot run and their concrete prerequisites.

## Current prototype architecture

- Read `DECISIONS.md` and `DEPLOYMENT.md` before changes. Runtime is `src/trove/`, mounted by `src/App.tsx`; old `src/pages/` and app-specific components are retained legacy scaffold, not the active routes.
- Public demo uses browser storage; invited private libraries use Supabase through the same `Library` interface. Keep those caches/data separate and clear cached private data on authentication transitions.
- DC seeds are sourced, verified restaurant facts, with no invented scores/reviews. Preserve source links and verification dates. Seed imports must not overwrite existing personal records.
- Four optional rating dimensions: food, ambiance, service, vibe. At least one is required for publishing. Database constraints and RLS are part of the feature, not optional UI validation.
- Preserve mobile navigation below 768px and desktop sidebar/grid behavior. UI styling is scoped to `src/trove/trove.css`.
- Hosted database already contains other data. Migrations are additive and namespaced `trove_*`; inspect remote state before applying. Never reset a hosted database or change shared Auth settings incidentally.
- Repository and `origin`: `https://github.com/fredmottey/trove.git`. Preserve upstream history when integrating local changes.
- Use Node 22 and standard `npm ci`. Run lint, typecheck, unit/integration tests and build. Run the two-width Playwright smoke for user-flow changes and local database tests for SQL/policy changes. See deployment guide for Docker requirements.
