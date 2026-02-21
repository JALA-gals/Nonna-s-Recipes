import { useEffect } from "react";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../lib/firebase";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "<your-client-id>",
    iosClientId: "<your-client-id>",
    androidClientId: "<your-client-id>",
    webClientId: "<your-client-id>",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return { promptAsync };
}