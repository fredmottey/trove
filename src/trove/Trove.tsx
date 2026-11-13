import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowUpRight,
  Bookmark,
  Compass,
  MapPin,
  Plus,
  Settings,
  Utensils,
} from "lucide-react";
import { demoLibrary } from "./demo";
import { privateLibrary, supabase } from "./supabase";
import {
  dimensions,
  filterPlaces,
  placeSchema,
  reviewSchema,
  type Library,
  type Place,
  type PlaceInput,
  type Review,
} from "./model";
import "./trove.css";

const blank: PlaceInput = {
  name: "",
  location: "Washington, DC",
  cuisine: "",
  tags: [],
  note: "",
  source_url: "",
  status: "want",
};
const blankReview: Review = {
  text: "",
  food: null,
  ambiance: null,
  service: null,
  vibe: null,
};
const message = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
export default function Trove() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!supabase);
  const [recovery, setRecovery] = useState(false);
  const [authError, setAuthError] = useState("");
  const cache = useQueryClient();
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (alive) {
        setSession(data.session);
        setAuthReady(true);
        if (error) setAuthError(error.message);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      cache.clear();
      setSession(next);
      setAuthReady(true);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [cache]);
  const owner = session?.user.id;
  const library = useMemo(
    () => (owner ? privateLibrary(owner) : demoLibrary(window.localStorage)),
    [owner],
  );
  const query = useQuery({
    queryKey: ["places", owner ?? "demo"],
    queryFn: () => library.list(),
    enabled: authReady,
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: (run: (lib: Library) => Promise<void>) => run(library),
    onSuccess: () =>
      cache.invalidateQueries({ queryKey: ["places", owner ?? "demo"] }),
  });
  const run = async (fn: (lib: Library) => Promise<void>) => {
    await mutation.mutateAsync(fn);
  };
  const places = query.data ?? [];
  const nav = [
    ["/", "Explore", Compass],
    ["/map", "My places", Bookmark],
    ["/add-review", "Add a place", Plus],
    ["/profile", "Your space", Settings],
  ] as const;
  return (
    <div className="trove-app">
      <aside className="trove-sidebar">
        <Link to="/" className="trove-logo">
          <Utensils size={23} /> trove<span>·</span>
        </Link>
        <p className="side-caption">Good places. Worth keeping.</p>
        <nav aria-label="Main navigation">
          {nav.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <MapPin size={18} />
          <div>
            Made for your next meal<small>Starting in Washington, DC</small>
          </div>
        </div>
      </aside>
      <div className="trove-body">
        <header className="trove-top">
          <Link className="mobile-logo" to="/">
            trove<span>·</span>
          </Link>
          <span className="location-label">
            <MapPin size={15} /> Washington, DC
          </span>
          <Link to="/profile" className="mode-pill">
            {owner ? "Private library" : "Interactive demo"}{" "}
            <ArrowUpRight size={14} />
          </Link>
        </header>
        <main>
          <div className="demo-notice">
            {owner
              ? "Your private library · Only you can see your places and reviews."
              : "Make yourself at home. Try the demo — changes stay in this browser."}
            {!owner && <Link to="/profile">Private library →</Link>}
          </div>
          {authError && (
            <p role="alert" className="error">
              {authError}
            </p>
          )}
          {!authReady || query.isPending ? (
            <p role="status">Opening your library…</p>
          ) : query.error ? (
            <div className="empty">
              <h1>Couldn’t open your library</h1>
              <p role="alert">{message(query.error)}</p>
              <button onClick={() => query.refetch()}>Try again</button>
              {!owner && (
                <button onClick={() => run((l) => l.reset!())}>
                  Reset demo
                </button>
              )}
              {owner && (
                <button onClick={() => supabase!.auth.signOut()}>
                  Return to demo
                </button>
              )}
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <LibraryPage
                    places={places}
                    explore
                    run={run}
                    busy={mutation.isPending}
                  />
                }
              />
              <Route
                path="/map"
                element={
                  <LibraryPage
                    places={places}
                    run={run}
                    busy={mutation.isPending}
                  />
                }
              />
              <Route
                path="/add-review"
                element={<PlaceForm key={`new-${owner}`} run={run} />}
              />
              <Route
                path="/places/:id/edit"
                element={<EditPlace places={places} run={run} />}
              />
              <Route
                path="/places/:id/review"
                element={<ReviewForm places={places} run={run} />}
              />
              <Route
                path="/profile"
                element={
                  <Account
                    owner={owner}
                    places={places}
                    run={run}
                    recovery={recovery}
                    recovered={() => setRecovery(false)}
                  />
                }
              />
              <Route
                path="*"
                element={
                  <div className="empty">
                    <h1>That place isn’t here.</h1>
                    <Link to="/">Back to your library</Link>
                  </div>
                }
              />
            </Routes>
          )}
          {mutation.error && (
            <p role="alert" className="error">
              {message(mutation.error)}
            </p>
          )}
          <footer>
            Curated starting points, your own discoveries.{" "}
            <a
              href="https://guide.michelin.com/en/us/district-of-columbia/restaurants/bib-gourmand"
              target="_blank"
              rel="noreferrer"
            >
              DC selection ↗
            </a>
            <span>Independent prototype · Not affiliated with MICHELIN</span>
          </footer>
        </main>
      </div>
      <nav className="trove-mobile-nav" aria-label="Mobile navigation">
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end>
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
type Run = (fn: (lib: Library) => Promise<void>) => Promise<void>;
function LibraryPage({
  places,
  explore = false,
  run,
  busy,
}: {
  places: Place[];
  explore?: boolean;
  run: Run;
  busy: boolean;
}) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const filtered = filterPlaces(places, { search, cuisine, status, tag });
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">
            {explore ? "THE DISTRICT, ON YOUR LIST" : "YOUR LITTLE BLACK BOOK"}
          </p>
          <h1>
            {explore ? (
              <>
                Your next <em>great bite.</em>
              </>
            ) : (
              "Places worth keeping."
            )}
          </h1>
          <p>
            {explore
              ? "A dozen DC discoveries to get you started. Find a favorite, make a note, and start your own collection."
              : "All your discoveries in one place. A little less scrolling, a little more going."}
          </p>
          <Link to="/add-review" className="primary-link">
            <Plus size={17} /> Save a new place
          </Link>
        </div>
        <div className="hero-stamp">
          <Utensils size={36} />
          <strong>DC</strong>
          <span>A GOOD PLACE TO START</span>
        </div>
      </section>
      <div className="collection-bar">
        <div>
          <span className="eyebrow">
            {explore ? "THE STARTER COLLECTION" : "YOUR COLLECTION"}
          </span>
          <h2>
            {explore ? "Washington, well discovered" : "My places"}{" "}
            <span>{places.length}</span>
          </h2>
        </div>
        <div className="collection-stats">
          <strong>
            {places.filter((p) => p.status === "been").length}
            <small>been there</small>
          </strong>
          <strong>
            {places.filter((p) => p.status === "want").length}
            <small>on the list</small>
          </strong>
        </div>
      </div>
      <section className="filter-bar" aria-label="Filter places">
        <label className="search-field">
          Search places
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Restaurant or location"
          />
        </label>
        <label>
          Cuisine
          <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
            <option value="">All cuisines</option>
            {[...new Set(places.map((p) => p.cuisine))]
              .filter(Boolean)
              .sort()
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All places</option>
            <option value="want">Want to go</option>
            <option value="been">Been there</option>
          </select>
        </label>
        <label>
          Tag
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Any tag"
          />
        </label>
        <button
          className="quiet"
          onClick={() => {
            setSearch("");
            setCuisine("");
            setStatus("");
            setTag("");
          }}
        >
          Clear filters
        </button>
      </section>
      <p className="result-count" aria-live="polite">
        {filtered.length} places to explore
      </p>
      <div className="place-grid">
        {filtered.map((p, i) => (
          <article className="place-card" key={p.id} aria-label={p.name}>
            <div className={`card-art art-${i % 4}`} aria-hidden="true">
              <span>{p.cuisine || "Your discovery"}</span>
              <Utensils size={52} />
              <span className="art-number">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="card-content">
              <div className="card-meta">
                <span>{p.cuisine || "Restaurant"}</span>
                <span
                  className={p.status === "been" ? "status been" : "status"}
                >
                  {p.status === "been" ? "Been there" : "Want to go"}
                </span>
              </div>
              <h3>{p.name}</h3>
              <p className="card-location">
                <MapPin size={14} />
                {p.location}
              </p>
              {p.recognition && (
                <a
                  className="recognition"
                  href={p.source_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.recognition} ↗<small>Verified {p.verified_on}</small>
                </a>
              )}
              {p.note && <p className="personal-note">{p.note}</p>}
              {p.tags.length > 0 && (
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}
              {p.review && (
                <div className="review-preview">
                  <strong>Your review</strong>
                  <p>{p.review.text}</p>
                  <div>
                    {dimensions
                      .filter((d) => p.review[d] !== null)
                      .map((d) => (
                        <span key={d}>
                          {d} {p.review[d]}/5{" "}
                        </span>
                      ))}
                  </div>
                  <button
                    className="quiet"
                    disabled={busy}
                    onClick={() =>
                      run((l) => l.review(p.id, null)).catch(() => {})
                    }
                  >
                    Delete review
                  </button>
                </div>
              )}
              <div className="card-actions">
                <Link to={`/places/${p.id}/review`}>
                  {p.review ? "Edit review" : "Write a review"}{" "}
                  <ArrowUpRight size={14} />
                </Link>
                <Link to={`/places/${p.id}/edit`}>Edit place</Link>
              </div>
              <div className="card-tools">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.location}`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Directions ↗
                </a>
                {p.source_url && !p.recognition && (
                  <a href={p.source_url} target="_blank" rel="noreferrer">
                    Source ↗
                  </a>
                )}
                <button
                  className="quiet"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm(`Delete ${p.name} and its review?`))
                      run((l) => l.remove(p.id)).catch(() => {});
                  }}
                >
                  Delete place
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty">
          <h3>No places here yet.</h3>
          <p>Try clearing your filters or save a new discovery.</p>
          <Link to="/add-review">Add a place →</Link>
        </div>
      )}
    </>
  );
}
function EditPlace({ places, run }: { places: Place[]; run: Run }) {
  const { id } = useParams();
  const place = places.find((p) => p.id === id);
  return place ? (
    <PlaceForm key={place.id} place={place} run={run} />
  ) : (
    <p>
      Place not found. <Link to="/">Back to library</Link>
    </p>
  );
}
function PlaceForm({ place, run }: { place?: Place; run: Run }) {
  const [value, setValue] = useState<PlaceInput>(place ?? blank);
  const [tags, setTags] = useState(place?.tags.join(", ") ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const update = (key: keyof PlaceInput, val: string) =>
    setValue((v) => ({ ...v, [key]: val }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const input = placeSchema.parse({
        ...value,
        tags: [
          ...new Set(
            tags
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          ),
        ],
      });
      await run((l) => l.save(input, place?.id));
      navigate("/map");
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="editor">
      <p className="eyebrow">A FUTURE FAVORITE</p>
      <h1>{place ? "Edit your place" : "Save a discovery."}</h1>
      <p>Found it on Instagram? Keep the link and add the details here.</p>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            Restaurant name
            <input
              required
              maxLength={150}
              value={value.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label>
            Location
            <input
              required
              maxLength={300}
              value={value.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </label>
          <label>
            Cuisine
            <input
              maxLength={80}
              value={value.cuisine}
              onChange={(e) => update("cuisine", e.target.value)}
            />
          </label>
          <label>
            Status
            <select
              value={value.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="want">Want to go</option>
              <option value="been">Been there</option>
            </select>
          </label>
        </div>
        <label>
          Source link (optional)
          <input
            type="url"
            placeholder="https://www.instagram.com/…"
            value={value.source_url}
            onChange={(e) => update("source_url", e.target.value)}
          />
        </label>
        <label>
          Tags, separated by commas
          <input value={tags} onChange={(e) => setTags(e.target.value)} />
        </label>
        <label>
          Private note
          <textarea
            maxLength={3000}
            value={value.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="The dish you want to try, who to bring…"
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button className="primary" disabled={busy}>
            {busy ? "Saving…" : "Save place"}
          </button>
          <Link to="/map">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
function ReviewForm({ places, run }: { places: Place[]; run: Run }) {
  const { id } = useParams();
  const place = places.find((p) => p.id === id);
  const [value, setValue] = useState<Review>(place?.review ?? blankReview);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (!place)
    return (
      <p>
        Place not found. <Link to="/">Back to library</Link>
      </p>
    );
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await run((l) => l.review(id!, reviewSchema.parse(value)));
      navigate("/map");
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="editor">
      <p className="eyebrow">FOR YOUR NEXT VISIT</p>
      <h1>Review {place.name}</h1>
      <p>
        Your own experience, dimension by dimension. Leave anything you didn’t
        rate blank.
      </p>
      <form onSubmit={submit}>
        <div className="form-grid">
          {dimensions.map((d) => (
            <label className="capitalize" key={d}>
              {d}
              <select
                aria-label={d}
                value={value[d] ?? ""}
                onChange={(e) =>
                  setValue((v) => ({
                    ...v,
                    [d]: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              >
                <option value="">Not rated</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option value={n} key={n}>
                    {n} —{" "}
                    {["Poor", "Fair", "Good", "Great", "Excellent"][n - 1]}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <label>
          Your review
          <textarea
            maxLength={3000}
            value={value.text}
            onChange={(e) => setValue((v) => ({ ...v, text: e.target.value }))}
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button className="primary" disabled={busy}>
            {busy ? "Saving…" : "Save review"}
          </button>
          <Link to="/map">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
function Account({
  owner,
  places,
  run,
  recovery,
  recovered,
}: {
  owner?: string;
  places: Place[];
  run: Run;
  recovery: boolean;
  recovered: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function auth(action: "login" | "reset" | "password" | "logout") {
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (!supabase)
        throw Error(
          "Private libraries are not configured on this deployment yet. The public demo is ready to use.",
        );
      const result =
        action === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : action === "reset"
            ? await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/profile`,
              })
            : action === "password"
              ? await supabase.auth.updateUser({ password })
              : await supabase.auth.signOut();
      if (result.error) throw result.error;
      if (action === "reset")
        setInfo(
          "If this address has an account, a password reset link will be sent.",
        );
      if (action === "password") {
        setInfo("Password updated.");
        setPassword("");
        recovered();
      }
    } catch (err) {
      setError(message(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="editor">
      <p className="eyebrow">YOUR SPACE</p>
      <h1>{owner ? "A library of your own." : "Try it. Make it yours."}</h1>
      <div className="account-stats">
        <strong>
          {places.length}
          <small>places</small>
        </strong>
        <strong>
          {places.filter((p) => p.review).length}
          <small>reviews</small>
        </strong>
      </div>
      {owner ? (
        <>
          <p>Signed in · Your library is private.</p>
          <button
            onClick={() =>
              run((l) => l.seed())
                .then(() =>
                  setInfo("Starter places added. Existing entries were kept."),
                )
                .catch((e) => setError(message(e)))
            }
          >
            Add starter places
          </button>
          <button disabled={busy} onClick={() => auth("logout")}>
            Sign out to demo
          </button>
        </>
      ) : (
        <>
          <div className="demo-panel">
            <h2>Your demo, your discoveries.</h2>
            <p>
              Changes stay in this browser. Reset any time to return to the DC
              starter collection.
            </p>
            <button
              onClick={() => {
                if (window.confirm("Reset demo and remove your changes?"))
                  run((l) => l.reset!()).catch((e) => setError(message(e)));
              }}
            >
              Reset demo
            </button>
          </div>
          <h2>Private library</h2>
          <p>
            Have an invitation? Sign in to keep your places across devices. Demo
            changes stay separate.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              auth("login");
            }}
          >
            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            <button className="primary" disabled={busy || !supabase}>
              Sign in
            </button>
            <button
              type="button"
              disabled={busy || !email || !supabase}
              onClick={() => auth("reset")}
            >
              Send password reset
            </button>
            {!supabase && (
              <p className="muted">
                Private sign-in is awaiting deployment configuration. No login
                is needed for the demo.
              </p>
            )}
          </form>
        </>
      )}
      {recovery && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            auth("password");
          }}
        >
          <label>
            New password
            <input
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </label>
          <button disabled={busy}>Update password</button>
        </form>
      )}
      {info && <p role="status">{info}</p>}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
