// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoLibrary } from "../src/trove/demo";
import { filterPlaces, reviewSchema } from "../src/trove/model";
import { starterPlaces } from "../src/trove/seeds";
beforeEach(() => localStorage.clear());
describe("library rules", () => {
  it("combines filters and keeps Michelin recognition separate from ratings", () => {
    const seeds = starterPlaces();
    expect(seeds).toHaveLength(12);
    expect(
      seeds.every(
        (p) =>
          p.review === null &&
          p.status === "want" &&
          p.source_url.startsWith("https://guide.michelin.com/"),
      ),
    ).toBe(true);
    expect(
      filterPlaces(seeds, {
        search: "dc",
        cuisine: "Japanese",
        status: "want",
        tag: "starter",
      }),
    ).toHaveLength(2);
  });
  it("requires at least one valid review dimension", () => {
    const empty = {
      text: "",
      food: null,
      ambiance: null,
      service: null,
      vibe: null,
    };
    expect(reviewSchema.safeParse(empty).success).toBe(false);
    expect(reviewSchema.safeParse({ ...empty, food: 6 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...empty, food: 5 }).success).toBe(true);
  });
  it("persists writes, imports seeds idempotently, and resets", async () => {
    const lib = demoLibrary(localStorage);
    await lib.save({
      name: "My spot",
      location: "DC",
      cuisine: "Italian",
      tags: [],
      note: "Try it",
      source_url: "",
      status: "want",
    });
    const places = await demoLibrary(localStorage).list();
    expect(places).toHaveLength(13);
    const mine = places.find((p) => p.name === "My spot")!;
    await lib.review(mine.id, {
      text: "Nice",
      food: 4,
      ambiance: null,
      service: null,
      vibe: null,
    });
    expect((await lib.list()).find((p) => p.id === mine.id).status).toBe(
      "been",
    );
    await lib.review(mine.id, null);
    expect((await lib.list()).find((p) => p.id === mine.id).review).toBeNull();
    await lib.seed();
    await lib.seed();
    expect(await lib.list()).toHaveLength(13);
    await lib.reset!();
    expect(await lib.list()).toHaveLength(12);
  });
});

it("keeps form input when persistence fails", async () => {
  const { createElement } = await import("react");
  const { render, screen, fireEvent, waitFor, cleanup } =
    await import("@testing-library/react");
  const { MemoryRouter } = await import("react-router-dom");
  const { QueryClient, QueryClientProvider } =
    await import("@tanstack/react-query");
  const { default: Trove } = await import("../src/trove/Trove");
  const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("Storage full");
  });
  try {
    render(
      createElement(
        QueryClientProvider,
        {
          client: new QueryClient({
            defaultOptions: { queries: { retry: false } },
          }),
        },
        createElement(
          MemoryRouter,
          { initialEntries: ["/add-review"] },
          createElement(Trove),
        ),
      ),
    );
    const name = await screen.findByLabelText("Restaurant name");
    fireEvent.change(name, { target: { value: "Keep my discovery" } });
    fireEvent.click(
      screen.getByRole("button", { name: "Save place", exact: true }),
    );
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("alert")
          .some((e) => e.textContent.includes("Storage full")),
      ).toBe(true),
    );
    expect((name as HTMLInputElement).value).toBe("Keep my discovery");
  } finally {
    cleanup();
    spy.mockRestore();
  }
});

it("maps the API one-to-one review relation", async () => {
  const { mapPrivatePlace } = await import("../src/trove/supabase");
  const review = {
    text: "Good",
    food: 5,
    ambiance: null,
    service: null,
    vibe: null,
  };
  const { review: unused, ...row } = starterPlaces()[0];
  expect(mapPrivatePlace({ ...row, trove_reviews: review }).review).toEqual(
    review,
  );
  expect(mapPrivatePlace({ ...row, trove_reviews: null }).review).toBeNull();
});
