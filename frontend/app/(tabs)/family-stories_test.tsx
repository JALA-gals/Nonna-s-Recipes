import React from "react";
import {useEffect, useState} from "react";
import {subscribeToRecipes} from "../../src/services/recipes";
import { View, Text, FlatList, StyleSheet, useWindowDimensions, Alert } from "react-native";
import { FamilyStoryCard, type FamilyStory } from "../../components/family-stories";
import type { RecipeDoc } from "../../src/services/recipes";
import RecipeDetail from "@/components/RecipeDetailRN";

export default function TestingFamilyStories() {
  const [stories, setStories] = useState<FamilyStory[]>([]);
  const [showDetail, setShowDetail] = useState(false);
const [selectedRecipe, setSelectedRecipe] = useState<FamilyStory | null>(null);  useEffect(() => {
  const unsub = subscribeToRecipes((rows) => {
    const mapped: FamilyStory[] = rows.map((recipe: RecipeDoc & { id: string }) => ({
      id: recipe.id,
      title: recipe.title,
      recipeName: recipe.title,
      familyName: recipe.storyteller || "Unknown Family",
      locationText: `${recipe.origin.name}, ${recipe.origin.countryCode}`,
      imageUrl: recipe.photoUrl || "https://placehold.co/600x400",
      likeCount: 0,
      generations: 1,
    }));

    setStories(mapped);
  });

  return () => unsub();
}, []);


  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 3 : 2;

  const gap = 14;
  const padding = 16;
  const cardWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.page}>
      <Text style={styles.header}>Family Stories (Test)</Text>

      <FlatList
        data={stories}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 24 }}
        columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <FamilyStoryCard
              story={item}
              onPress={(id) => {
                setSelectedRecipe(stories.find(s => s.id === id) || null);
                setShowDetail(true);
              }}
            />
          </View>
        )}
      />
      {selectedRecipe && (
        <RecipeDetail
          visible={showDetail}                  
          onClose={() => setShowDetail(false)}
          recipe={selectedRecipe}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#eef4ea", paddingTop: 16 },
  header: { fontSize: 22, fontWeight: "600", color: "#7b3306", paddingHorizontal: 16, marginBottom: 12 },
});