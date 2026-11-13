import type { Place } from "./model";

// Presentation-only metadata: existing browser saves and private rows need no migration.
const photos: Record<string, { src: string; sourceUrl: string }> = {
  daru: {
    src: "/images/restaurants/daru.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/daru",
  },
  lapis: {
    src: "/images/restaurants/lapis.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/lapis",
  },
  "the-red-hen": {
    src: "/images/restaurants/the-red-hen.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/the-red-hen",
  },
  "toki-underground": {
    src: "/images/restaurants/toki-underground.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/toki-underground",
  },
  maketto: {
    src: "/images/restaurants/maketto.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/maketto",
  },
  sababa: {
    src: "/images/restaurants/sababa.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/sababa",
  },
  "queen%E2%80%99s-english": {
    src: "/images/restaurants/queens-english.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/queen%E2%80%99s-english",
  },
  "dauphine-s": {
    src: "/images/restaurants/dauphine-s.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/dauphine-s",
  },
  elle: {
    src: "/images/restaurants/elle.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/elle",
  },
  "la-tejana": {
    src: "/images/restaurants/la-tejana.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/la-tejana",
  },
  "menya-hosaki": {
    src: "/images/restaurants/menya-hosaki.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/menya-hosaki",
  },
  zaytinya: {
    src: "/images/restaurants/zaytinya.jpg",
    sourceUrl:
      "https://guide.michelin.com/en/district-of-columbia/washington-dc/restaurant/zaytinya",
  },
};

export function photoForPlace(place: Pick<Place, "seed_key">) {
  return place.seed_key ? photos[place.seed_key] : undefined;
}
