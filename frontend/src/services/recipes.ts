import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// CREATE
export async function createRecipe(data: any) {
  const ref = await addDoc(collection(db, "recipes"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// SUBSCRIBE (this is what map.tsx needs)
export function subscribeToRecipes(
  cb: (recipes: any[]) => void
) {
  const q = query(
    collection(db, "recipes"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    cb(rows);
  });
}