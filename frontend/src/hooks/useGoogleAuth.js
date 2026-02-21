import { useEffect, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../lib/firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (response?.type === "success") {
      setIsAuthenticating(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .catch(err => console.error("Firebase sign-in error:", err))
        .finally(() => setIsAuthenticating(false));
    }
  }, [response]);

  return { promptAsync, isAuthenticating };
}