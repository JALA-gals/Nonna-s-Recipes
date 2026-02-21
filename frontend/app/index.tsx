import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/lib/firebase";
import { Colors } from "@/constants/theme";
import { useGoogleAuth } from "../src/hooks/useGoogleAuth";

const light = Colors.light;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithGoogle, isAuthenticating, errorMessage } = useGoogleAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user ? user.uid : "signed out");

      if (user) {
        router.replace("/(tabs)");
      } else {
        setCheckingAuth(false);
      }
    });

    return unsub;
  }, [router]);

  useEffect(() => {
    if (errorMessage) Alert.alert("Google sign-in failed", errorMessage);
  }, [errorMessage]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.log("Google prompt error:", e);
    }
  };

  // ✅ prevents flicker / weird “back to login” feel
  if (checkingAuth) return null;

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