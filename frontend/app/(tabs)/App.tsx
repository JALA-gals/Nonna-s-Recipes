import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { subscribeToRecipes } from "../../src/services/recipes";
import type { RecipeDoc } from "../../src/services/recipes";

import { FamilyStoryCard, type FamilyStory } from "../../components/family-stories";

import RecipeDetail from "@/components/RecipeDetailRN";
import type { RecipeData, InstructionStep } from "@/components/RecipeDetailRN";

import RegionButton from "./components/RegionButton";

export default function App() {
  // --- STATE ---
  // Keep raw Firestore docs here
  const [recipes, setRecipes] = useState<(RecipeDoc & { id: string })[]>([]);

  // Modal state + selected recipe in the exact type RecipeDetail expects
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | undefined>(undefined);

  // --- LAYOUT ---
  const { width } = useWindowDimensions();
  const padding = 16;
  const gap = 16;
  const numColumns = 2;
  const cardWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

  // --- MAPPERS ---
  // RecipeDoc -> FamilyStory (for cards)
  const toFamilyStory = (r: RecipeDoc & { id: string }): FamilyStory => {
    const imageUrl = r.photoUrl || "https://placehold.co/600x400";

    const recipeName =
      (r as any).recipeName ??
      (r as any).title ??
      (r as any).name ??
      "Untitled Recipe";

    const familyName =
      (r as any).familyName ??
      (r as any).family ??
      (r as any).originalRecipeFrom ??
      "Unknown Family";

    const locationText = r.origin
      ? `${r.origin.name}, ${r.origin.countryCode}`
      : undefined;

    return {
      id: r.id,
      title: recipeName, // your FamilyStoryCard displays story.title
      familyName,
      recipeName,
      imageUrl,
      locationText,
      likeCount: (r as any).likeCount,
      generations: (r as any).generations,
    };
  };
  // Converts Firestore ingredients into string[] for RecipeDetailRN
const ingredientsToStrings = (raw: any): string[] => {
  if (!Array.isArray(raw)) return [];

  // Already string[]
  if (raw.length === 0 || typeof raw[0] === "string") {
    return raw.filter((x: any) => typeof x === "string");
  }

  // Otherwise assume objects like { amount, item, preparation, note }
  return raw.map((ing: any) => {
    if (!ing || typeof ing !== "object") return String(ing);

    const amount = ing.amount ? String(ing.amount).trim() : "";
    const item = ing.item ? String(ing.item).trim() : "";
    const prep = ing.preparation ? String(ing.preparation).trim() : "";
    const note = ing.note ? String(ing.note).trim() : "";

    const main = [amount, item].filter(Boolean).join(" ").trim();
    const extras = [prep, note].filter(Boolean).join(", ").trim();

    return extras ? `${main} (${extras})` : main || "Ingredient";
  });
};
// Converts Firestore instructions into InstructionStep[]
const instructionsToSteps = (raw: any): InstructionStep[] | undefined => {
  if (!raw) return undefined;

  // Case 1: string[]
  if (Array.isArray(raw) && (raw.length === 0 || typeof raw[0] === "string")) {
    const arr = raw.filter((x: any) => typeof x === "string" && x.trim().length > 0);
    return arr.length
      ? arr.map((desc: string, i: number) => ({ stepNumber: i + 1, description: desc }))
      : undefined;
  }

  // Case 2: already [{stepNumber, description}]
  if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
    // Try a few common key names
    const mapped = raw
      .map((s: any, i: number) => {
        const stepNumber = Number(s.stepNumber ?? s.step ?? i + 1);
        const description =
          String(s.description ?? s.text ?? s.instruction ?? s.instructions ?? "").trim();
        if (!description) return null;
        return { stepNumber, description };
      })
      .filter(Boolean) as InstructionStep[];

    return mapped.length ? mapped : undefined;
  }

  // Case 3: single string (maybe multi-line)
  if (typeof raw === "string") {
    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    return lines.length
      ? lines.map((desc, i) => ({ stepNumber: i + 1, description: desc }))
      : undefined;
  }

  return undefined;
};
  // RecipeDoc -> RecipeData (for RecipeDetail modal)
  const toRecipeData = (r: RecipeDoc & { id: string }): RecipeData => {
    const recipeName =
      (r as any).recipeName ??
      (r as any).title ??
      (r as any).name ??
      "Untitled Recipe";

    const imageUrl = r.photoUrl || "https://placehold.co/600x400";

    const originLocation = r.origin
      ? `${r.origin.name}, ${r.origin.countryCode}`
      : undefined;

    // If instructions come as string[], convert to InstructionStep[]
    const instructionsFromStrings = (arr?: string[]): InstructionStep[] | undefined =>
      Array.isArray(arr)
        ? arr.map((desc, i) => ({ stepNumber: i + 1, description: desc }))
        : undefined;

    const instructions = instructionsToSteps(
  (r as any).instructions ?? (r as any).steps ?? (r as any).directions
);
    return {
      id: r.id,
      recipeName,
      imageUrl,

      originalRecipeFrom: (r as any).originalRecipeFrom ?? (r as any).familyName,
      originLocation,
      estimatedCreationDate: (r as any).estimatedCreationDate,

      ingredients: ingredientsToStrings((r as any).ingredients),
      instructions,
      familyStory: (r as any).familyStory ?? (r as any).story,
    };
  };

  // --- FIRESTORE SUBSCRIPTION ---
  useEffect(() => {
    const unsub = subscribeToRecipes((rows) => {
      setRecipes(rows);
    });

    return () => unsub();
  }, []);

  // Derived UI stories from raw recipes
  const stories: FamilyStory[] = useMemo(() => recipes.map(toFamilyStory), [recipes]);

  const regions = [
    { emoji: "🍜", label: "Asia", bgColor: "rgba(255,161,173,0.7)" },
    { emoji: "🥐", label: "Europe", bgColor: "rgba(142,197,255,0.7)" },
    { emoji: "🌮", label: "Americas", bgColor: "rgba(123,241,168,0.7)" },
    { emoji: "🍲", label: "Africa", bgColor: "rgba(255,223,32,0.7)" },
    { emoji: "🧆", label: "Middle East", bgColor: "rgba(205,174,255,0.7)" },
  ];

  return (
    <LinearGradient colors={["#a1c5a8", "#fbf2cc"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover family stories</Text>
        </View>

        {/* Region Section */}
        <View style={styles.regionCard}>
          <Text style={styles.regionTitle}>Explore by Region</Text>
          <View style={styles.regionContainer}>
            {regions.map((region, index) => (
              <RegionButton key={index} {...region} />
            ))}
          </View>
        </View>

        {/* Family Stories */}
        <Text style={styles.sectionTitle}>Family Stories</Text>

        <FlatList
          data={stories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: cardWidth,
                transform: [{ rotate: index % 2 === 0 ? "-1deg" : "1deg" }],
                marginBottom: 16,
              }}
            >
              <FamilyStoryCard
                story={item}
                onPress={(id) => {
                  const raw = recipes.find((r) => r.id === id);
                  if (!raw) return;

                  setSelectedRecipe(toRecipeData(raw));
                  setShowDetail(true);
                }}
              />
            </View>
          )}
        />

        {/* Detail Modal */}
        <RecipeDetail
          visible={showDetail}
          onClose={() => setShowDetail(false)}
          recipe={selectedRecipe}
        />

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Share Your Story</Text>
          <Text style={styles.ctaSubtitle}>Every recipe has a history. Add yours!</Text>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Add Your Recipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    color: "#7b3306",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(151,60,0,0.8)",
  },
  regionCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  regionTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: "#a95725",
  },
  regionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 30,
    marginBottom: 20,
    color: "#7b3306",
  },
  cta: {
    backgroundColor: "#ffcc7f",
    borderRadius: 40,
    padding: 36,
    alignItems: "center",
    marginTop: 40,
  },
  ctaTitle: {
    fontSize: 24,
    color: "#7b3306",
  },
  ctaSubtitle: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: "center",
    color: "#7b3306",
  },
  ctaButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 10,
  },
  ctaButtonText: {
    fontSize: 16,
    color: "#7b3306",
  },
});