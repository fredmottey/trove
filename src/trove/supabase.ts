import { createClient } from "@supabase/supabase-js";
import {
  placeSchema,
  reviewSchema,
  type Library,
  type Place,
  type Review,
} from "./model";
import { starterPlaces } from "./seeds";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;
type PlaceRow = Omit<Place, "review"> & {
  trove_reviews: Review | Review[] | null;
};
// PostgREST embeds this primary-key relation as a one-to-one object.
export function mapPrivatePlace(row: PlaceRow): Place {
  const { trove_reviews, ...place } = row;
  return {
    ...place,
    review: Array.isArray(trove_reviews)
      ? (trove_reviews[0] ?? null)
      : trove_reviews,
  };
}

export function privateLibrary(owner: string): Library {
  const client = supabase!;
  const check = (error: { message: string } | null) => {
    if (error) throw Error(error.message);
  };
  return {
    async list() {
      const { data: member, error: me } = await client
        .from("trove_members")
        .select("user_id")
        .eq("user_id", owner)
        .maybeSingle();
      check(me);
      if (!member) throw Error("This account has not been invited to Trove.");
      const { data, error } = await client
        .from("trove_places")
        .select("*,trove_reviews(*)")
        .order("created_at", { ascending: false });
      check(error);
      return data.map(mapPrivatePlace);
    },
    async save(input, id) {
      const data = placeSchema.parse(input);
      const result = id
        ? await client
            .from("trove_places")
            .update(data)
            .eq("id", id)
            .eq("owner_id", owner)
            .select("id")
            .single()
        : await client
            .from("trove_places")
            .insert({ ...data, owner_id: owner });
      check(result.error);
    },
    async remove(id) {
      const { error } = await client
        .from("trove_places")
        .delete()
        .eq("id", id)
        .eq("owner_id", owner)
        .select("id")
        .single();
      check(error);
    },
    async review(id, input) {
      if (input) {
        const review = reviewSchema.parse(input);
        const { error } = await client.rpc("trove_publish_review", {
          p_place_id: id,
          p_text: review.text,
          p_food: review.food,
          p_ambiance: review.ambiance,
          p_service: review.service,
          p_vibe: review.vibe,
        });
        check(error);
      } else {
        const { error } = await client
          .from("trove_reviews")
          .delete()
          .eq("place_id", id)
          .eq("owner_id", owner);
        check(error);
      }
    },
    async seed() {
      const rows = starterPlaces().map(({ id, review, ...p }) => ({
        ...p,
        owner_id: owner,
      }));
      const { error } = await client.from("trove_places").upsert(rows, {
        onConflict: "owner_id,seed_key",
        ignoreDuplicates: true,
      });
      check(error);
    },
  };
}
