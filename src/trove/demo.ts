import { placeSchema, reviewSchema, type Library, type Place } from "./model";
import { starterPlaces } from "./seeds";
export const DEMO_KEY = "trove-demo-v1";
export function demoLibrary(storage: Storage): Library {
  const read = (): Place[] => {
    const raw = storage.getItem(DEMO_KEY);
    if (!raw) return starterPlaces();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw Error();
      return parsed;
    } catch {
      throw new Error(
        "Demo data could not be read. Reset the demo to restore the starter list.",
      );
    }
  };
  const write = (rows: Place[]) =>
    storage.setItem(DEMO_KEY, JSON.stringify(rows));
  return {
    async list() {
      return read();
    },
    async save(input, id) {
      const data = placeSchema.parse(input);
      const rows = read();
      if (id) {
        if (!rows.some((p) => p.id === id))
          throw Error("Place no longer exists.");
        write(rows.map((p) => (p.id === id ? { ...p, ...data } : p)));
      } else
        write([
          {
            ...data,
            id: crypto.randomUUID(),
            seed_key: null,
            created_at: new Date().toISOString(),
            review: null,
            recognition: null,
            verified_on: null,
          },
          ...rows,
        ]);
    },
    async remove(id) {
      write(read().filter((p) => p.id !== id));
    },
    async review(id, input) {
      const review = input ? reviewSchema.parse(input) : null;
      write(
        read().map((p) =>
          p.id === id
            ? { ...p, review, status: review ? "been" : p.status }
            : p,
        ),
      );
    },
    async seed() {
      const rows = read();
      const keys = new Set(rows.map((p) => p.seed_key));
      write([...rows, ...starterPlaces().filter((p) => !keys.has(p.seed_key))]);
    },
    async reset() {
      write(starterPlaces());
    },
  };
}
