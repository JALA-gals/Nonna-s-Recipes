import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "recipes", String(id)));
        if (snap.exists()) setRecipe(snap.data());
      } catch (e) {
        console.log("Load recipe error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading recipe…</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  const originLabel = recipe?.origin?.name
    ? `${recipe.origin.name}${recipe.origin.countryCode ? `, ${recipe.origin.countryCode}` : ""}`
    : "Unknown origin";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title ?? "Recipe"}</Text>
      <Text style={styles.sub}>{originLabel}</Text>

      {!!recipe.description && (
        <>
          <Text style={styles.h}>Description</Text>
          <Text style={styles.p}>{recipe.description}</Text>
        </>
      )}

      {!!recipe.story && (
        <>
          <Text style={styles.h}>Story</Text>
          <Text style={styles.p}>{recipe.story}</Text>
        </>
      )}

      <Text style={styles.h}>Ingredients</Text>
      {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
        recipe.ingredients.map((i: any, idx: number) => (
          <Text key={idx} style={styles.li}>
            • {i.amount ? `${i.amount} ` : ""}{i.item}
            {i.preparation ? ` (${i.preparation})` : ""}
          </Text>
        ))
      ) : (
        <Text style={styles.p}>No ingredients listed.</Text>
      )}

      <Text style={styles.h}>Steps</Text>
      {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
        recipe.steps
          .slice()
          .sort((a: any, b: any) => (a.step ?? 0) - (b.step ?? 0))
          .map((s: any, idx: number) => (
            <Text key={idx} style={styles.li}>
              {idx + 1}. {s.instruction}
            </Text>
          ))
      ) : (
        <Text style={styles.p}>No steps listed.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  sub: { opacity: 0.7, marginBottom: 14 },
  h: { marginTop: 16, marginBottom: 6, fontSize: 16, fontWeight: "700" },
  p: { fontSize: 14, lineHeight: 20 },
  li: { fontSize: 14, lineHeight: 20, marginBottom: 6 },
});