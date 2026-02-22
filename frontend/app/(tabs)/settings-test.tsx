import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { seedDummyRecipes } from "../../src/services/seedRecipes";

export default function SettingsTest() {
  const [loading, setLoading] = useState(false);

  const runSeed = async () => {
    try {
      setLoading(true);
      const res = await seedDummyRecipes(20); // change to 30, 50, etc.
      Alert.alert("Seed complete", `Seeded ${res.seeded} recipes`);
    } catch (e: any) {
      console.log("Seed error:", e);
      Alert.alert("Seed failed", e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Dev Tools</Text>
      <Button
        title={loading ? "Seeding..." : "Seed Dummy Recipes"}
        onPress={runSeed}
        disabled={loading}
      />
    </View>
  );
}