import { z } from "zod";
export const dimensions = ["food", "ambiance", "service", "vibe"] as const;
const score = z.number().int().min(1).max(5).nullable();
export const reviewSchema = z
  .object({
    text: z.string().max(3000),
    food: score,
    ambiance: score,
    service: score,
    vibe: score,
  })
  .refine(
    (r) => dimensions.some((d) => r[d] !== null),
    "Choose at least one rating.",
  );
const url = z
  .string()
  .max(2048)
  .refine((v) => !v || /^https:\/\//i.test(v), "Use an HTTPS link.");
export const placeSchema = z.object({
  name: z.string().trim().min(1).max(150),
  location: z.string().trim().min(1).max(300),
  cuisine: z.string().trim().max(80),
  tags: z.array(z.string().trim().min(1).max(30)).max(20),
  note: z.string().max(3000),
  source_url: url,
  status: z.enum(["want", "been"]),
});
export type Review = z.infer<typeof reviewSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
export type Place = PlaceInput & {
  id: string;
  seed_key: string | null;
  created_at: string;
  review: Review | null;
  recognition: string | null;
  verified_on: string | null;
};
export type Filters = {
  search: string;
  cuisine: string;
  status: string;
  tag: string;
};
export function filterPlaces(places: Place[], f: Filters) {
  return places.filter(
    (p) =>
      `${p.name} ${p.location}`
        .toLowerCase()
        .includes(f.search.toLowerCase()) &&
      (!f.cuisine || p.cuisine === f.cuisine) &&
      (!f.status || p.status === f.status) &&
      (!f.tag ||
        p.tags.some((t) => t.toLowerCase().includes(f.tag.toLowerCase()))),
  );
}
export interface Library {
  list(): Promise<Place[]>;
  save(input: PlaceInput, id?: string): Promise<void>;
  remove(id: string): Promise<void>;
  review(id: string, input: Review | null): Promise<void>;
  seed(): Promise<void>;
  reset?(): Promise<void>;
}
