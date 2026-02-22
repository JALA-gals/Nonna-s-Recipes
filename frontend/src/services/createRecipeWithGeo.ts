// src/services/createTestRecipe.ts
import { createRecipe } from "./recipes";
import { auth } from "../lib/firebase";
import { geocodePlace } from "./geocode";

export async function createTestRecipe({
  title,
  place,
  countryCode,
  photoUrl,
  ingredients,
  steps,
  story,
  storyteller,
  creationDate,
}: {
  title: string;
  place: string;
  countryCode: string;
  photoUrl?: string | null;
  ingredients: any[];
  steps: any[];
  story: string;
  storyteller: string;
  creationDate: string;
}) {

  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not logged in");

  const cleanTitle = title.trim();
  const cleanPlace = place.trim();
  const cc = countryCode.trim().toUpperCase();

  let coords: { lat: number; lng: number } | null = null;
  try {
    coords = await geocodePlace(cleanPlace, cc);
  } catch (e) {
    console.log("GEOCODE ERROR:", e);
  }

  const payload = {
  title: cleanTitle || "Untitled Recipe",
  createdBy: uid,
  visibility: "public" as const,
  origin: {
    name: cleanPlace,
    countryCode: cc,
    lat: coords?.lat ?? null,
    lng: coords?.lng ?? null,
  },

  photoUrl: photoUrl ?? undefined, // ← FIXED

  ingredients,
  steps,
  story,
  storyteller,
  estimatedCreationDate: creationDate,
};

  const id = await createRecipe(payload);
  return { id, coords };
}