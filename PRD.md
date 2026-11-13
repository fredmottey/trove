# Restaurant Discovery & Social Reviews — PRD

Version: 0.1 | Prepared: November 12, 2026 | Owner: Fred Mottey

Status: Implementation-ready draft reconstructed from available Founder Mentor discussion context. Product name is undecided.

## 1. Instructions for Codex / Claude Code

Build the MVP described here in vertical slices. Preserve the Instagram capture workflow, useful personal organization, and friend-powered discovery as the product's core. Do not implement deferred features merely because they appear in the long-term vision.

Evidence labels used throughout:

- **Confirmed (C):** Requirements expressed by the founder in recovered discussions.
- **Prior proposal (P):** Details suggested in the Founder Mentor discussion; explicit founder acceptance was not recovered.
- **Implementation default (D):** Concrete choices introduced in this PRD so implementation can proceed. These are provisional, not historical founder decisions.
- **Open (O):** Decisions or dependencies requiring resolution before the affected release work can be considered complete.

If working in an existing repository, inspect its instructions and architecture first. Reuse compatible conventions. Record departures from defaults in `DECISIONS.md`. Build with fixtures before paid integrations are configured, but clearly distinguish simulated behavior from live functionality. Never mark a production integration complete based only on mocks.

The retrieved material is a summary of earlier conversations, not a complete project export. This document captures all requirements recovered for this task; it cannot certify that every Founder Mentor message has been retrieved. Unverified ideas are not represented as approved requirements.

## 2. Product purpose

Help diners turn restaurant inspiration into places they actually visit, and help them choose using people and review details they trust.

**Problem (C):** Restaurant discoveries on Instagram are difficult to retrieve and organize when deciding where to eat. A single aggregate rating lacks the detail and reviewer context needed to judge whether a restaurant fits a particular diner or occasion. Useful recommendations from friends should be easier to discover.

**Audience (C):** Urban college students through adults in their 30s, approximately ages 18–35, especially diners in metropolitan and food-focused cities.

**Magic moment (C):** Quickly find a saved place that fits today's plans, or discover a surprising restaurant through a friend and make a confident decision faster.

### Core jobs

1. “I found a restaurant on Instagram; save it somewhere I can find it later.”
2. “Show me my places in this city, neighborhood, or cuisine.”
3. “Tell me where my friends have been and what they actually liked.”
4. “Help me judge food, ambience, and service separately, including practical tips.”
5. “Let me remember what I thought after visiting.”

## 3. Source and decision register

Source descriptions below identify recovered conversation timestamps. Original message links were not returned; none are fabricated.

| ID | Source | Recovered requirement or decision | Status |
| --- | --- | --- | --- |
| S1 | Founder Mentor, founder message, June 14, 2025, 04:45:53 UTC | Save Instagram-found restaurants; organize using maps/lists and city/region/cuisine; social recommendations; practical tips such as best time and seating; separate food/ambience/service ratings; credential-weighted review vision; urban young-adult audience | C |
| S2 | Founder Mentor, founder message, June 14, 2025, 20:56:07 UTC | Include Instagram sharing/saving in V1; save shared restaurant posts; prioritize V1 and sketch UI | C |
| S3 | Founder Mentor, assistant proposal, June 14, 2025, 20:56:11 UTC | Share extension with automatic location/cuisine recognition and note; map/list city/cuisine/date filters; Food/Ambience/Service/Value/Vibe dimensions; text/images/tips; Been/Want states; friend feed; tags/filters | P |
| S4 | Same proposed roadmap | Later phases: taste-profile weighting, credibility badges, booking, video/Stories, offline/trip planning | P, treated as deferred |
| S5 | Founder Mentor, assistant discussion, June 14, 2025 | Possible monetization: paid power-user features, affiliate partnerships, premium business listings, anonymous B2B insights | P, not MVP commitments |

**Scope interpretation:** Implement S1–S2 as the core. Use S3 as the provisional MVP specification, with its status visible. Credential/context weighting belongs to the vision; no formula, validation system, or approved MVP mechanism was recovered, so it must not silently become a ranking algorithm. A separately retrieved “James Beard–powered Yelp” / dish-intelligence concept is not merged into this MVP without an explicit decision linking it to this project.

## 4. Scope

### MVP

| ID | Capability | Basis | Priority |
| --- | --- | --- | --- |
| F01 | Account, profile, session and ownership controls | D: enables personal/social records | Must |
| F02 | Capture Instagram URL/shared text; attempt restaurant recognition; confirm and save | C S1–S2; P S3 | Must |
| F03 | Restaurant identity, search, detail, source attribution | D: supports capture/discovery | Must |
| F04 | Saved places in map/list views; city, region, cuisine organization | C S1; P S3 | Must |
| F05 | Want to go / Been states, optional personal note, collections | P S3; D collections behavior | Must |
| F06 | Multidimensional personal reviews and practical tips | C S1; P S3 | Must |
| F07 | Friend relationships, friend activity feed, save from friend activity | C S1; P S3; D relationship mechanics | Must |
| F08 | Tags and filters, including date saved | P S3 | Must |
| F09 | Review image attachments | P S3 | Provisional MVP |
| F10 | Privacy, blocking/reporting, essential moderation and account deletion | D: necessary for a social beta | Must before external beta |

### Deferred

- Taste calibration, personalized taste weighting, credibility badges and credential verification.
- Reservations/booking, video uploads, Stories, offline access, trip itineraries.
- Monetization implementation, sponsored rankings, business portals, analytics sales.
- Additional defaults excluded from this MVP: DMs, comments, likes, contact-book imports, push notifications, influencer payouts, automated crawling of Instagram saved collections, and AI concierge/chat.
- Dish-level intelligence and award-based discovery are not part of this project's verified scope.

## 5. Core user journeys

### A. Capture inspiration

1. User shares an Instagram post/link to the application, or pastes a link in Add Place.
2. Preserve the URL and optional shared text immediately as an import draft.
3. Attempt to extract restaurant name and location, and cuisine when supported by evidence.
4. Show candidate branches with address/city. User confirms or corrects the match.
5. User optionally adds a note, tags, or collection; save with Want to go as the default.
6. Restaurant appears in the user's list and, when coordinates exist, on the map.

**Acceptance:** A supported live share reaches the app; a recognized location can be confirmed and saved; an ambiguous/missing result offers manual lookup; interruption or a provider error does not lose the captured URL. Repeating the operation does not duplicate the user's saved restaurant.

### B. Choose a place

1. Open Saved or Discover; choose city/region or optional current location.
2. Filter by cuisine, tags, status and date saved; switch between list and map.
3. Open a restaurant to see personal notes, visible friend reviews, dimension scores and practical tips.
4. Open directions or the restaurant's external website.

**Acceptance:** Map and list use the same filter predicate. Denied geolocation still allows city/manual location selection. Restaurants without coordinates remain available in the list with an explicit location state.

### C. Record a visit

1. Open a restaurant and choose Review.
2. Rate applicable dimensions; add optional text, best-time/seating tips and images.
3. Select Private or Friends visibility, then publish.
4. On successful publication mark the place Been; a friends-visible review appears in authorized friends' feeds.

**Acceptance:** Unrated dimensions remain null, never zero. Editing a review updates its visible content and aggregates. Private reviews never appear in friends' feeds or scores.

### D. Discover through friends

1. Find a person by username or use a profile invite link.
2. Send/accept a friend request.
3. Browse friends' recent visible reviews and explicitly shared saves.
4. Open a restaurant and save it to one's own collection.

**Acceptance:** Pending requests confer no content access. Unfriending, blocking, deletion and visibility changes immediately revoke applicable read access, including direct links and cached feed responses.

## 6. Detailed functional rules

All exact mechanics below are D unless marked otherwise.

### F01 — Identity

- Use managed authentication; email sign-in is the baseline. Do not implement custom password cryptography.
- Profile: stable user ID, unique case-insensitive username, display name, optional avatar and optional home city.
- Do not expose email addresses in profiles/search. Rate-limit username search and friend requests.
- Unauthenticated users may see the landing/sign-in interface; personalized APIs require a valid session.

### F02 — Instagram capture and matching

- Accept URL and text shares; provide paste-link fallback. Native share reception is a release dependency, not satisfied merely by a paste box.
- Treat “save Instagram posts” as user-initiated capture, not automatic access to all Instagram bookmarks. No permission/API access for bookmark synchronization has been established.
- Store source URL, source type, capture time, processing state and confirmed restaurant association. Keep source payloads private to their owner.
- Attempt name/location recognition automatically from legitimately available shared or provider metadata. Do not invent a restaurant, cuisine or address when content is unavailable.
- Always request confirmation before committing a candidate. Multi-restaurant posts support selecting one restaurant per capture in MVP; the same URL may later be associated with another selected restaurant.
- States: `received -> processing -> needs_confirmation -> saved`; alternate states `needs_input`, `failed`, `cancelled`. A retry reuses the import identity.
- Normalize supported URLs, but preserve meaningful post identifiers. Deduplicate transport retries by owner + idempotency key, and saved places by owner + restaurant.
- Separate restaurant identity from post identity: many sources may refer to one restaurant; different branches are separate restaurants.
- If the user is signed out, securely retain the local pending capture through sign-in and attach it only to the authenticated account after confirmation.
- Manual fallback is required for resilience. It does not waive the automatic-recognition requirement; a release without a working live recognition path must be labeled a limited prototype.

### F03–F05 — Restaurant records and organization

- Restaurant fields: name, branch/address, city/region/country, optional coordinates, cuisine labels, optional external website, external provider identity and provenance.
- Canonical uniqueness uses provider + provider place ID when present. Never merge two records based only on name.
- If no provider match exists, allow an explicitly unverified manual record with name and city/address; no invented map pin.
- Each user has at most one saved-place record per restaurant, with state `want_to_go` or `been`, private note, timestamps, and visibility.
- Save visibility defaults to Private. Users must explicitly choose Friends to generate save activity. Notes are always private, even when a save is shared.
- Collections are named, owner-only groups of saved places; many-to-many membership. “List view” works without requiring a collection.
- Removing a save removes its collection memberships and save activity, but not an independent review. Explain this in the removal UI.
- Marking Been does not require a review. A later edit to a review does not silently reset a manually changed state.

### F06 / F09 — Reviews

- Confirmed dimensions: Food, Ambience, Service. Prior proposed additional dimensions: Value and Vibe.
- Provisional scale: optional integer scores 1–5, with at least one dimension required to publish. Show labels for 1 (poor), 3 (good), 5 (excellent).
- Working distinction: Ambience rates physical comfort/environment; Vibe rates enjoyment of the atmosphere. Keep both configurable; validate whether this distinction is useful before locking the form.
- One current review per user + restaurant in MVP. Editing updates it; repeat-visit history is deferred. Optional visit date may not be in the future.
- Optional fields: review text (maximum 3,000 characters), best time to visit, seating advice, other tip (each maximum 500 characters), up to five images (10 MB each before processing).
- Images are user-supplied review photos, not copies of Instagram media. Validate actual file type, strip location metadata and use authorization-aware delivery.
- Review visibility defaults to Private; user may choose Friends. Publishing never silently shares a personal saved-place note.
- Display each rating dimension separately with its contributing count. No composite “overall” score in MVP. Friends averages use only visible reviews from accepted, unblocked friends; show the user's own ratings separately. Round display means to one decimal.
- Zero eligible reviews means “No friend ratings yet,” not a zero score. Do not mix external-provider scores with internal friend scores.
- Credentials/context weighting remains deferred. Tips and dimensional detail preserve context without inventing trust scores.

### F07 — Social graph and feed

- Use reciprocal accepted friendship as the provisional model, not unilateral follows.
- Request states: pending, accepted, rejected, cancelled. Prevent self-requests and duplicate/reverse duplicate pending requests.
- Feed includes review publications and explicitly friends-visible saves, reverse chronological with cursor pagination. No algorithmic personalization.
- Activity references the underlying object. Render current authorized content; never preserve leaked snapshots after visibility changes.
- Edits do not create new feed events. An initially private item changed to Friends creates at most one publication event for that item.
- A block overrides friendship and requests in both directions, removes feed exposure and prevents new requests until unblocked. Unblocking does not restore friendship automatically.

### F08 — Search, tags and filters

- Search restaurant names and locations; social username search is a separate operation.
- Saved filters: city, region, cuisine, date-saved range, Want/Been, personal tags and collection.
- Personal tags are owner-scoped, case-insensitive for uniqueness, maximum 30 characters, at most 20 per saved place.
- AND across filter categories; OR within a category. Date ranges use the user's local timezone at the UI boundary and UTC storage.
- Default Saved sort: most recently saved. Discover supports nearby search when a center is supplied; never silently infer exact location.
- Cursor pagination: default 20, maximum 100 items. Map queries use a viewport/bounds limit and clustering, rather than fetching every place.

### F10 — Safety and privacy

- Authorization belongs on the server/database, never solely in UI filters. User A cannot read or modify User B's private notes, imports, collections, images or reviews.
- Provide report-review/report-user flows and a minimal administrator queue with hide/restore actions and audit records.
- Hidden/deleted reviews contribute to neither feeds nor aggregates. Admin privileges are assigned server-side and audited.
- Account deletion revokes sessions and removes personal content, social edges and associated media; shared canonical restaurant records remain. Define backup-retention handling before launch.

## 7. Screens and interaction requirements

| Screen | Essential content and actions |
| --- | --- |
| Welcome / Sign in | Value proposition, authentication, pending capture recovery |
| Saved | List/map toggle, filters, Want/Been, collections, Add Place |
| Add / Import | URL/text entry, processing feedback, candidate confirmation, manual lookup, optional note/tags |
| Restaurant detail | Identity/address, save/state, private personal note, visible friend reviews, dimension counts, tips, source links |
| Review editor | Dimension controls, text/tips, images, explicit visibility, publish/edit/delete |
| Friends feed | Recent authorized activity, author, restaurant, review excerpt, save action |
| Friends / Profile | Username search, requests, friendship/block controls, visible profile content |
| Settings | Profile, sign out, deletion, privacy explanation |
| Moderation | Authorized reports queue and audited actions |

Use a mobile-first layout with Saved, Discover, Friends, and Profile as the main destinations and a persistent Add action. This navigation is a D, not a recovered UI approval. Provide loading, empty, retry, permission-denied and offline-error states for every remote operation. Preserve unsent form content across transient failures. Keyboard access, labeled controls, visible focus, sufficient contrast and non-map list alternatives are required. Offline data synchronization is deferred.

## 8. Architecture and integrations

**No final technology stack was recovered.** Follow an existing repository if available. For a greenfield implementation, this PRD proposes a TypeScript application with a relational PostgreSQL data store, managed authentication, private object storage and an asynchronous import worker. Keep provider adapters separate from product logic. These are implementation defaults, not verified compatibility claims or a mandate to use particular library versions.

### Platform decision gate

The V1 Instagram share requirement makes platform selection consequential. Before committing to a shell, perform a small working spike on the selected launch OS that receives an Instagram URL/text share and persists it through app launch/sign-in. Choose a mobile shell with an actual share-receiver implementation for that OS. A responsive web companion may be useful but does not alone prove native share support. Launch OS (iOS, Android, or both) remains O; a local web prototype can proceed while that decision is pending.

### Interfaces

- `PlaceProvider.search(query, locationHint)` and `getDetails(providerPlaceId)` return candidates with provenance and optional fields.
- `ImportResolver.resolve(url, sharedText)` returns extracted evidence, candidate places, confidence/explanation and unavailable/ambiguous outcomes.
- `MapAdapter` renders permitted location data and attribution without owning domain records.
- `MediaStore` supports validated upload, scoped delivery and deletion.
- All integrations use bounded timeouts, classified errors, capped retries and structured logs without private review text or notes.

Provider selection, API credentials, permitted metadata access, attribution, retention and cost limits remain O. Check current official provider documentation during implementation. Do not assume an Instagram URL grants access to captions, video, location or private posts; do not build around bypassing login or access controls. If permitted metadata cannot support automatic recognition, explicitly record the limitation and resolve it before calling the complete MVP ready.

### Security properties

- Validate all inputs and enforce ownership on reads and writes; use parameterized database access.
- Store provider credentials only server-side. Sanitize rendered user content.
- URL resolution must prevent SSRF: allow supported HTTPS hosts, reject private/link-local addresses, validate redirect targets and bound response size/time.
- Treat imported captions/text as untrusted data. If an LLM is used, request schema-validated extraction only; it receives no privileged tools or secrets and cannot approve a match.
- Rate-limit imports, auth, friend requests and media uploads; configure provider spend limits.

## 9. Logical data model

All primary keys are opaque IDs; timestamps are UTC. Exact table naming may follow repository conventions.

| Entity | Key fields and constraints |
| --- | --- |
| User/Profile | auth user ID, unique normalized username, display name, avatar, optional city |
| Restaurant | ID, name, address fields, nullable coordinates, verification state, timestamps |
| RestaurantExternalRef | restaurant ID, provider, provider ID; unique(provider, provider ID) |
| RestaurantCuisine | restaurant ID, normalized cuisine; source/provenance |
| SavedPlace | ID, owner ID, restaurant ID, Want/Been, private note, visibility, saved_at, visited_at; unique(owner, restaurant) |
| Import | ID, owner ID, URL, shared text, state, candidates, selected restaurant ID, idempotency key, error code; unique(owner, key) |
| SavedPlaceSource | saved-place ID, import/source URL, created_at; supports multiple inspirations |
| Collection / CollectionItem | owner ID and name; membership links only to the owner's saved places |
| Tag / SavedPlaceTag | owner-scoped normalized tag; unique memberships |
| Review | ID, owner ID, restaurant ID, nullable five dimension scores, text, tips, visit date, visibility, moderation state; unique(owner, restaurant) |
| ReviewImage | review ID, storage key, MIME/size, order, processing state |
| Friendship | canonical ordered user pair, requester ID, status, timestamps; unique pair |
| Block | blocker ID, blocked ID; unique pair |
| Activity | actor ID, object type/ID, publication timestamp; one publication per object |
| Report / ModerationAction | reporter, target, reason/status; admin action and audit timestamp |

Enforce rating ranges, latitude/longitude ranges, ownership-consistent collection/tag membership, and foreign keys in the database. Index user saved-place timestamps, restaurant review ownership/visibility, friendship endpoints, activities by actor/time and geospatial restaurant search as needed. Feed and aggregate queries must apply current authorization before returning results.

## 10. API contract outline

REST notation is illustrative; equivalent typed RPC is acceptable. All mutations authenticate and validate server-side. Return structured errors `{code, message, fieldErrors?, retryable?}` and opaque pagination cursors.

| Operation | Contract |
| --- | --- |
| `POST /imports` | URL/shared text + idempotency key -> import ID/state |
| `GET /imports/:id` | Owner-only status/candidates/errors |
| `POST /imports/:id/confirm` | Chosen restaurant/manual fields + optional note/tags -> transactional saved place/source link |
| `GET /restaurants` | Query/location/filters/cursor -> candidates/results |
| `GET /restaurants/:id` | Restaurant + viewer-scoped review summary; never return another user's notes |
| `PUT /saved-places/:restaurantId` | Idempotent save/update state, note and visibility |
| `GET /saved-places` | Owner-scoped filters/sort/cursor |
| `DELETE /saved-places/:restaurantId` | Remove save/memberships/save activity; retain review |
| `POST/PATCH/DELETE /collections` | Owner-scoped collection and membership management |
| `PUT /restaurants/:id/my-review` | Validate scores/content/visibility; upsert current review |
| `DELETE /restaurants/:id/my-review` | Delete review/media and invalidate related activity/aggregates |
| `POST /reviews/:id/images` | Owner-only scoped upload; finalize only after validation |
| `POST /friend-requests` | Username/user ID -> pending request |
| `POST /friend-requests/:id/respond` | Recipient-only accept/reject |
| `DELETE /friendships/:id` | Participant-only removal |
| `GET /feed` | Current authorized friend activity + cursor |
| `POST/DELETE /blocks/:userId` | Owner's block management |
| `POST /reports` | Authenticated report creation |
| `DELETE /account` | Reauthentication + deletion workflow |

Use transactions for import confirmation, review publication and friendship transitions. Retries must not multiply saves, activities or uploads. Return explicit conflict/validation outcomes, not silent data loss.

## 11. Measurement and quality targets

These are proposed validation measures, not previously agreed business targets.

- **Activation:** user confirms a first restaurant save; measure within 24 hours of registration.
- **Capture utility:** recognized candidate confirmed / completed import attempts; track ambiguous and inaccessible-source rates separately.
- **Capture reliability:** retained drafts / accepted captures; no acknowledged capture should disappear.
- **Organization utility:** weekly savers returning to filter/open a saved restaurant.
- **Social utility:** users who save a restaurant from a friend's activity / users viewing friend activity.
- **Retention:** week-one and week-four return rates among activated users; set numeric launch targets after pilot baseline.
- **Decision speed:** moderated pilot time from opening Saved to choosing a place; compare to participants' current process.

Events: `capture_received`, `import_resolved`, `import_needs_input`, `import_confirmed`, `place_saved`, `filters_applied`, `restaurant_opened`, `review_published`, `friend_accepted`, `feed_place_saved`, `directions_opened`. Record IDs, source category and durations, not private notes, raw captions or precise location histories. An opened directions link is a proxy, not proof of a visit.

Provisional engineering targets: cached list/detail reads p95 under 1 second in the chosen test environment; return import acknowledgment within 2 seconds and process asynchronously; show a recoverable status/manual option if resolution exceeds 15 seconds. Instrument these before making public performance claims.

## 12. Implementation milestones and acceptance tests

### M0 — Resolve dependencies and establish foundation

- Inspect repository; record stack, launch OS, providers and open decisions.
- Prove native share reception and permitted automatic metadata extraction with real inputs.
- Create migrations, fixture provider, local auth setup and environment example.
- Exit: application starts locally; share/extraction feasibility is documented; limitations are explicit.

### M1 — Capture and personal library (F01–F05, F08)

- Build sign-in, restaurant search/detail, import state machine, matching confirmation, saved records, collections, tags, list/map views.
- Tests: correct branch selection; unavailable/private post; multiple matches; duplicate share; signed-out capture; denied location; missing coordinates; combined filters; cross-user ownership denial.
- Exit: a real supported share can be confirmed and found using city/cuisine filters after restart.

### M2 — Reviews (F06, F09)

- Build review form, private/friends visibility, dimension aggregates, tips, image processing and deletion.
- Tests: null versus zero; 1/5 boundary validation; review editing; private reviews excluded from friend scores; one-review constraint; unauthorized image access; metadata removal; media deletion.
- Exit: user can record and edit a visit, and visible per-dimension results are correct.

### M3 — Social discovery (F07)

- Build username discovery, requests, friend feed, save-from-feed, unfriend and block behavior.
- Tests: pending request cannot read content; reciprocal request race; private save note never leaks; duplicate feed publication prevention; pagination; revoke access via direct URL and cache after block/unfriend.
- Exit: two real test accounts complete the full capture -> review -> friend discovery -> save loop.

### M4 — External beta readiness (F10 and all integration checks)

- Complete moderation, account deletion, rate limits, integration error states, accessibility and analytics checks.
- Run database-backed integration tests and end-to-end tests for the four core journeys. Use deterministic provider fixtures in CI plus separate credentialed smoke tests for live providers.
- Validate actual share flow on each supported OS, including cancelled share, cold launch, sign-in, retries and inaccessible content.
- Exit: all Must acceptance criteria pass; provisional choices are documented; no unresolved dependency is concealed behind fixtures.

## 13. Open decisions and provisional defaults

| Decision | Working default | When it must be settled |
| --- | --- | --- |
| Product name / branding | Neutral working title | Before public launch |
| Launch OS and shell | No final selection; mobile share spike required | Before production capture implementation |
| Launch geography | City-selectable data model; pilot city not assumed | Before recruiting pilot users |
| Restaurant/map/import providers | Adapter interfaces + fixtures | Before live import/search acceptance |
| Meaning of Instagram “saved” | User-initiated share/paste; no bookmark synchronization claim | Before public onboarding copy |
| Rating scale and Value/Vibe dimensions | 1–5 integers; five configurable dimensions | Before schema/UI freeze |
| Friend versus follow model | Reciprocal accepted friendship | Before social beta |
| Privacy | Private by default; explicit Friends sharing | Before social beta |
| Photo attachments | Provisional MVP from prior proposal | Before beta scope freeze |
| Credential/context weighting | Vision preserved; no MVP scoring algorithm | Before any weighted-ranking work |
| Numeric business success goals | Instrument first, establish pilot baseline | Before judging product-market fit |
| Monetization | None in MVP | After validation |

## 14. Definition of done and agent handoff

The MVP is done when a user can capture an Instagram discovery, confirm the correct restaurant, organize/find it on a map or list, record a dimensional review, and discover/save an authorized friend's recommendation with durable data and working privacy controls.

Repository deliverables:

- Application source, schema/migrations and deterministic seed fixtures.
- `.env.example` with variable names only; no secrets committed.
- `README.md` with setup, provider configuration, local run, tests and deployment instructions.
- `DECISIONS.md` distinguishing resolved choices from this document's defaults.
- Test coverage mapped to requirement IDs and milestone acceptance criteria.
- Clear status of live integrations, mocks, unresolved limitations and deferred features.

Suggested starting instruction:

> Read PRD.md and repository instructions. Implement M0, then proceed through M1–M4 in working vertical slices. Preserve C requirements, use explicitly labeled D choices where necessary, and record deviations. Treat P details as provisional scope rather than historical founder approval. Do not add deferred features. Verify the real Instagram share and recognition path before declaring the complete MVP ready. Report each completed requirement, checks run, and unresolved dependency truthfully.
