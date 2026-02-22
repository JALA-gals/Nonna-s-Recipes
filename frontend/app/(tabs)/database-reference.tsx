import React, { useState } from "react";
import { View, Button, Alert, TextInput, StyleSheet, Text } from "react-native";

// IMPORTANT: use relative imports to avoid alias issues
import { createRecipe } from "../../src/services/recipes";
import { auth } from "../../src/lib/firebase";
import { geocodePlace } from "../../src/services/geocode";
console.log("RUNNING FILE: frontend/app/(tabs)/index.tsx — HOME V999");
export default function Home() {
  const [title, setTitle] = useState("Monster Energy Drink");
  const [place, setPlace] = useState("Kingston");
  const [countryCode, setCountryCode] = useState("JM");

  const addTestRecipe = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Not logged in", "Log in first, then try again.");
      return;
    }

    const cleanTitle = title.trim();
    const cleanPlace = place.trim();
    const cc = countryCode.trim().toUpperCase();

    let coords: { lat: number; lng: number } | null = null;
    try {
      coords = await geocodePlace(cleanPlace, cc);
    } catch (e) {
      console.log("GEOCODE ERROR:", e);
    }

    // ✅ Schema write test (no helper)
    const payload = {
      title: cleanTitle || "Untitled Recipe",
      createdBy: uid,
      visibility: "public" as const,
      origin: {
        name: cleanPlace,
        countryCode: cc,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      },

      // New schema fields
      description: "A refreshing and energizing family drink.",
      region: "Americas" as const,
      tags: ["Caribbean", "family favorite"],
      ingredients: [
        { item: "Energy drink", amount: "1 can", preparation: "", note: "" },
        { item: "Ice cubes", amount: "1 cup", preparation: "", note: "" },
      ],
      steps: [
        { step: 1, instruction: "Pour drink over ice.", tip: "", note: "" },
        { step: 2, instruction: "Serve immediately.", tip: "", note: "" },
      ],
      story: "We used to drink this during hot summer afternoons.",
      storyteller: "Dad",
      languageDetected: "English",
    };

    try {
      const id = await createRecipe(payload);
      console.log("WRITE SUCCESS. DOC ID:", id);

      Alert.alert(
        coords ? "Created recipe + pinned!" : "Created recipe (no pin)",
        coords
          ? `Pinned at ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
          : "Couldn’t find coordinates."
      );
    } catch (e) {
      console.log("WRITE FAILED ERROR:", e);
      Alert.alert("Save failed", "Check logs for details.");
    }
  };

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text style={styles.label}>Recipe title</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Place (city/region)</Text>
      <TextInput value={place} onChangeText={setPlace} style={styles.input} />

      <Text style={styles.label}>Country code (2 letters)</Text>
      <TextInput
        value={countryCode}
        onChangeText={setCountryCode}
        style={styles.input}
        autoCapitalize="characters"
      />

      <Button title="Add Test Recipe" onPress={addTestRecipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
});