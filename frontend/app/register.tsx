import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signUpWithEmail } from "../src/lib/auth"; 
import { Colors } from "@/constants/theme";

const light = Colors.light;

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const cred = await signUpWithEmail(email, password);
    
      router.replace("/"); // go back to login
    } catch (error) {
      console.log(error);
      Alert.alert("Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

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

      <Button title="Sign Up" onPress={handleRegister} />

      <Pressable style={styles.link} onPress={() => router.push("/")}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
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