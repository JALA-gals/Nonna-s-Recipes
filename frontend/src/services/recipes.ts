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

export async function createRecipe(data: any) {
  const ref = await addDoc(collection(db, "recipes"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToRecipes(cb: (recipes: any[]) => void) {
  const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cb(rows);
  });
}

// IMPORTANT: this is what map.tsx is calling
export async function updateRecipeOriginCoords(
  recipeId: string,
  lat: number,
  lng: number
) {
  const ref = doc(db, "recipes", recipeId);
  await updateDoc(ref, {
    "origin.lat": lat,
    "origin.lng": lng,
    updatedAt: serverTimestamp(),
  });
}