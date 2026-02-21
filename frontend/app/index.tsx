import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/lib/firebase";
import { Colors } from "@/constants/theme";
import { useGoogleAuth } from "../src/hooks/useGoogleAuth"; // adjust path if needed

const light = Colors.light;

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithGoogle, isAuthenticating, errorMessage } = useGoogleAuth();

  // Route to tabs whenever user becomes signed in (email OR Google)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/(tabs)");
    });
    return unsub;
  }, [router]);

  // Show Google errors
  useEffect(() => {
    if (errorMessage) Alert.alert("Google sign-in failed", errorMessage);
  }, [errorMessage]);

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // 🔥 FIX #1 — Proper email verification check
      if (!cred.user.emailVerified) {
        Alert.alert(
          "Email not verified",
          "Please check your inbox and verify your email before logging in."
        );
        return; // stop here
      }

      console.log("Firebase user:", cred.user.uid);

      // 🔥 FIX #2 — Only navigate after verification
      router.replace("/(tabs)");

    } catch (error: any) {
      console.log(error);
      Alert.alert("Login failed", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Google button pressed");
      await signInWithGoogle();
      // routing happens via onAuthStateChanged
    } catch (e) {
      console.log("Google prompt error:", e);
      Alert.alert("Google sign-in cancelled", "Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={light.icon}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={light.icon}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />

      <View style={{ height: 8 }} />

      <Button
        title={isAuthenticating ? "Signing in..." : "Continue with Google"}
        onPress={handleGoogleLogin}
        disabled={isAuthenticating}
      />

      <Pressable style={styles.link} onPress={() => router.push("/register")}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: light.background,
    color: light.text,
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: light.tint,
    fontSize: 14,
  },
});