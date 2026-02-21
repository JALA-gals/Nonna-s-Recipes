import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,sendEmailVerification
} from "firebase/auth";
import { auth } from "../lib/firebase";

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

