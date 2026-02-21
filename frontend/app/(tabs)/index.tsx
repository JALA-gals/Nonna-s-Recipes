import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";

// Use RELATIVE imports to avoid alias issues
import { createRecipe } from "../../src/services/recipes";
import { auth } from "../../src/lib/firebase";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
  console.log("CLICKED create recipe");
  const uid = auth.currentUser?.uid;
  console.log("UID:", uid);

  const cleanTitle = title.trim();
  console.log("TITLE:", cleanTitle);

  try {
    console.log("ABOUT TO WRITE TO FIRESTORE...");
    const id = await createRecipe({
      title: cleanTitle || "Untitled Test",
      createdBy: uid || "NO_UID",
      visibility: "public",
      origin: {
        name: placeName.trim() || "Unknown",
        countryCode: countryCode.trim().toUpperCase() || "XX",
        lat: null,
        lng: null,
      },
    });

    console.log("WRITE SUCCESS. DOC ID:", id);
  } catch (e: any) {
    console.log("WRITE FAILED FULL ERROR:", e);
    console.log("WRITE FAILED message:", e?.message);
    console.log("WRITE FAILED code:", e?.code);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a Recipe</Text>

      <TextInput
        placeholder="Recipe Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        autoCapitalize="words"
      />

      <TextInput
        placeholder="Place of Origin (e.g., Palermo)"
        value={placeName}
        onChangeText={setPlaceName}
        style={styles.input}
      />

      <TextInput
        placeholder="Country Code (e.g., IT)"
        value={countryCode}
        onChangeText={setCountryCode}
        style={styles.input}
        autoCapitalize="characters"
      />

      <Button
        title={isSaving ? "Saving..." : "Create Recipe"}
        onPress={handleCreate}
        disabled={isSaving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  header: { fontSize: 20, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
});