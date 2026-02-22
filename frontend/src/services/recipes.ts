import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

/** ---- Schema Types (Firestore document shape) ---- */

export type Region = "Asia" | "Europe" | "Africa" | "Americas" | "Middle East" | "Other";
export type Visibility = "public" | "private";

export type Origin = {
  name: string;
  countryCode: string;
  lat: number | null;
  lng: number | null;
};

export type Ingredient = {
  item: string;
  amount?: string;
  preparation?: string;
  note?: string;
};

export type Step = {
  step: number;
  instruction: string;
  tip?: string;
  note?: string;
};

export type RecipeDoc = {
  // KEEP (existing)
  title: string;
  createdBy: string;
  visibility: Visibility;
  origin: Origin;

  // ADD (new)
  description: string;
  region: Region; //hi
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  story: string;

  // Optional future fields
  storyteller?: string;
  languageDetected?: string;
  photoUrl?: string;

  // server timestamps (Firestore)
  createdAt?: any;
  updatedAt?: any;
};

export type CreateRecipeInput = Omit<RecipeDoc, "createdAt" | "updatedAt">;

/** ---- Normalization (prevents missing fields / inconsistent shapes) ---- */
function normalizeRecipeInput(input: Partial<CreateRecipeInput>): CreateRecipeInput {
  const origin = input.origin ?? { name: "", countryCode: "", lat: null, lng: null };

  return {
    // required existing fields
    title: String(input.title ?? "").trim(),
    createdBy: String(input.createdBy ?? "").trim(),
    visibility: (input.visibility === "private" ? "private" : "public"),
    origin: {
      name: String(origin.name ?? "").trim(),
      countryCode: String(origin.countryCode ?? "").trim(),
      lat: typeof origin.lat === "number" ? origin.lat : null,
      lng: typeof origin.lng === "number" ? origin.lng : null,
    },

    // new fields with safe defaults
    description: String(input.description ?? "").trim(),
    region: (input.region ?? "Other") as Region,
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    ingredients: Array.isArray(input.ingredients)
      ? input.ingredients.map((ing: any) => ({
          item: String(ing?.item ?? "").trim(),
          amount: ing?.amount ? String(ing.amount) : "",
          preparation: ing?.preparation ? String(ing.preparation) : "",
          note: ing?.note ? String(ing.note) : "",
        }))
      : [],
    steps: Array.isArray(input.steps)
      ? input.steps.map((s: any, idx: number) => ({
          step: Number.isFinite(Number(s?.step)) ? Number(s.step) : idx + 1,
          instruction: String(s?.instruction ?? "").trim(),
          tip: s?.tip ? String(s.tip) : "",
          note: s?.note ? String(s.note) : "",
        }))
      : [],
    story: String(input.story ?? "").trim(),

    // optional
    storyteller: input.storyteller ? String(input.storyteller).trim() : undefined,
    languageDetected: input.languageDetected ? String(input.languageDetected).trim() : undefined,
    photoUrl: input.photoUrl ? String(input.photoUrl).trim() : undefined,
  };
}

/** ---- Public API ---- */

export async function createRecipe(data: Partial<CreateRecipeInput>) {
  const normalized = normalizeRecipeInput(data);

  // Guardrails (fail fast instead of writing junk)
  if (!normalized.title) throw new Error("createRecipe: title is required");
  if (!normalized.createdBy) throw new Error("createRecipe: createdBy is required");
  if (!normalized.origin?.name) throw new Error("createRecipe: origin.name is required");
  if (!normalized.origin?.countryCode) throw new Error("createRecipe: origin.countryCode is required");

  const ref = await addDoc(collection(db, "recipes"), {
    ...normalized,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

export function subscribeToRecipes(cb: (recipes: (RecipeDoc & { id: string })[]) => void) {
  const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    cb(rows);
  });
}

// IMPORTANT: map.tsx calls this. Keep unchanged.
export async function updateRecipeOriginCoords(recipeId: string, lat: number, lng: number) {
  const ref = doc(db, "recipes", recipeId);
  await updateDoc(ref, {
    "origin.lat": lat,
    "origin.lng": lng,
    updatedAt: serverTimestamp(),
  });
}