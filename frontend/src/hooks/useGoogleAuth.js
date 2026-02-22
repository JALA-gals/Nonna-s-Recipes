// src/hooks/useGoogleAuth.js
import { useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

import { auth } from "../lib/firebase";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithCredential,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const inFlightRef = useRef(false);

  const isWeb = typeof window !== "undefined" && Platform.OS === "web";

  // Provider reused on web
  const webProvider = useMemo(() => {
    const p = new GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });
    return p;
  }, []);

  // Native-only request (Expo Go)
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  // WEB: finish redirect sign-in if we used signInWithRedirect
  useEffect(() => {
    if (!isWeb) return;
    (async () => {
      try {
        const res = await getRedirectResult(auth);
        if (res?.user) {
          console.log("WEB redirect result UID:", res.user.uid);
        }
      } catch (e) {
        // If no redirect happened, this can be null; that's fine.
        console.log("getRedirectResult error:", e);
      }
    })();
  }, [isWeb]);

  // NATIVE: when expo-auth-session succeeds, sign into Firebase with credential
  useEffect(() => {
    if (isWeb) return;
    if (!response) return;
    if (response.type !== "success") return;

    (async () => {
      try {
        setErrorMessage(null);
        setIsAuthenticating(true);

        const idToken = response.authentication?.idToken;
        const accessToken = response.authentication?.accessToken;

        if (!idToken) throw new Error("No idToken returned from Google.");

        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        const cred = await signInWithCredential(auth, credential);
        console.log("NATIVE Firebase UID:", cred.user.uid);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("NATIVE Google sign-in error:", msg);
        setErrorMessage(msg);
      } finally {
        setIsAuthenticating(false);
        inFlightRef.current = false;
      }
    })();
  }, [response, isWeb]);

  const signInWithGoogleWeb = async () => {
    try {
      setErrorMessage(null);
      setIsAuthenticating(true);

      // Try popup first (best UX)
      const cred = await signInWithPopup(auth, webProvider);
      console.log("WEB popup UID:", cred.user.uid);
      return cred;
    } catch (e) {
      // Popup blocked -> redirect fallback
      console.log("Popup failed, falling back to redirect:", e);
      await signInWithRedirect(auth, webProvider);
    } finally {
      setIsAuthenticating(false);
      inFlightRef.current = false;
    }
  };

  const signInWithGoogle = async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    if (isWeb) return signInWithGoogleWeb();

    try {
      setErrorMessage(null);
      setIsAuthenticating(true);

      if (!request) throw new Error("Google auth request not ready yet.");
      return await promptAsync({ useProxy: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("promptAsync error:", msg);
      setErrorMessage(msg);
      setIsAuthenticating(false);
      inFlightRef.current = false;
    }
  };

  return { signInWithGoogle, isAuthenticating, errorMessage };
}