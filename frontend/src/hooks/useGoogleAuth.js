import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { auth } from "../lib/firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export function useGoogleAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // web login => NO proxy. Expo Go => proxy.
  const useProxy = Platform.OS !== "web";

  const redirectUri = AuthSession.makeRedirectUri({ useProxy });

  console.log("PLATFORM:", Platform.OS);
  console.log("REDIRECT URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    redirectUri,
    extraParams: { prompt: "select_account" },
  });

  useEffect(() => {
    if (response?.type !== "success") return;

    (async () => {
      try {
        setIsAuthenticating(true);
        setErrorMessage(null);

        const { id_token } = response.params ?? {};
        if (!id_token) throw new Error("No id_token returned from Google");

        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Google sign-in error:", msg);
        setErrorMessage(msg);
      } finally {
        setIsAuthenticating(false);
      }
    })();
  }, [response]);

  const signInWithGoogle = () => {
    setErrorMessage(null);
    return promptAsync({ useProxy });
  };

  return { signInWithGoogle, isAuthenticating, errorMessage };
}