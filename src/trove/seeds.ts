import type { Place } from "./model";
const root =
  "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/";
// Facts verified against the individual MICHELIN listings on 2026-11-13.
// Selection: https://guide.michelin.com/en/us/district-of-columbia/restaurants/bib-gourmand
const entries = [
  ["daru", "Daru", "Indian", "1451 Maryland Ave. NE"],
  ["lapis", "Lapis", "Afghan", "1847 Columbia Rd. NW"],
  ["the-red-hen", "The Red Hen", "Italian", "1822 1st St. NW"],
  ["toki-underground", "Toki Underground", "Japanese", "1234 H St. NE"],
  ["maketto", "Maketto", "Asian", "1351 H St. NE"],
  ["sababa", "Sababa", "Mediterranean", "3311 Connecticut Ave. NW"],
  ["queen%E2%80%99s-english", "Queen’s English", "Chinese", "3410 11th St. NW"],
  ["dauphine-s", "Dauphine’s", "Creole", "1100 15th St. NW"],
  ["elle", "Ellē", "Contemporary", "3221 Mt. Pleasant St. NW"],
  ["la-tejana", "La Tejana", "Mexican", "3211 Mt. Pleasant St. NW"],
  ["menya-hosaki", "Menya Hosaki", "Japanese", "845 Upshur St. NW"],
  ["zaytinya", "Zaytinya", "Mediterranean", "701 9th St. NW"],
];
export function starterPlaces(): Place[] {
  return entries.map(([slug, name, cuisine, address], i) => ({
    id: `dc-${i}`,
    seed_key: slug,
    name,
    cuisine,
    location: `${address}, Washington, DC`,
    tags: ["DC starter list"],
    note: "",
    source_url: root + slug,
    status: "want",
    created_at: new Date(2026, 10, 13, 12, 0, i).toISOString(),
    review: null,
    recognition: "MICHELIN Bib Gourmand selection",
    verified_on: "2026-11-13",
  }));
}
