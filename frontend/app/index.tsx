import { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { router } from "expo-router";
import { 
  loginWithEmail} from "../src/lib/auth";
import {useGoogleAuth} from "../src/hooks/useGoogleAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { promptAsync } = useGoogleAuth();

  // Handle Google redirect result

  async function handleEmailLogin() {
    try {
      await loginWithEmail(email, password);
      router.replace("/");
    } catch (err) {
      console.log("Email login error:", (err as Error).message);
    }
  }

  async function handleGoogleLogin() {
    try {
      await promptAsync();
      router.replace("/");
    } catch (err) {
      console.log("Google login error:", (err as Error).message);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginTop: 20, padding: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginTop: 10, padding: 10 }}
      />

      <Button title="Login with Email" onPress={handleEmailLogin} />

      <View style={{ height: 20 }} />

      <Button title="Login with Google" onPress={handleGoogleLogin} />
    </View>
  );
}