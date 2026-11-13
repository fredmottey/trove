# Prototype decisions

- Product is Trove. This iteration is a personal library and public browser-only demo, not the full PRD MVP. Native Instagram capture/recognition, social features, uploads, interactive maps, and moderation are deferred.
- Public demo is the default. Its changes are browser-local, resettable, and isolated from authenticated data; it needs no hosted credentials. Private libraries are invite-only through `trove_members`, without changing shared project-wide auth settings. No automatic demo-to-account import.
- Existing Supabase project: `abkfayyocpyzhbdsvlbv`. Inspect its schema and migration history before applying the additive migration; never reset it or repair unrelated migration history automatically.
- Backend is PostgreSQL + Supabase Auth/Data API/RPC. `Library` isolates the frontend persistence contract; SQL stays versioned. Hosted Supabase can later be replaced with self-hosted Supabase and static frontend hosting. Replacing Supabase Auth/Data API with a custom server would require a new adapter.
- Keep the four existing rating dimensions, each optional 1–5; require at least one to publish. Publishing is atomic with marking Been. Deleting a review preserves the place and Been state.
- Source of DC starter facts: individual MICHELIN pages linked from `src/trove/seeds.ts`, verified 2026-11-13. No copied reviews or photography, fabricated visits, or implied affiliation. Recognition is historical source metadata, not a Trove score or promise of current award status.
- Source repository and `origin` are `fredmottey/trove`. Access was verified through Git and the connector. The two upstream authentication commits are merged. Preserve the original profile migration unchanged; the current public/private UI replaces the former login wall, `/auth` redirects to `/profile`, and compatibility auth imports share the environment-configured client.
- Vercel + CircleCI + Cloudflare subdomain `trove.fredmottey.dev`. Root domain is untouched. CircleCI is the production deployment gate. Remote deployment and provider provisioning must be verified independently of local build success.

- Tooling: explicit Capacitor peer dependency restores standard npm installs. Vite and the new test/deployment tooling were updated together; the old scaffold component tagger was removed because it pins the older Vite peer range. Capacitor uses the Trove app ID `dev.fredmottey.trove` and bundled assets instead of an external preview server.

- Removed the obsolete Bun lockfile because npm is the supported package manager and the binary lock still recorded removed scaffold dependencies.
