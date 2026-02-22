import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {subscribeToRecipes} from "../../src/services/recipes";
import {useWindowDimensions, Alert } from "react-native";
import { FamilyStoryCard, type FamilyStory } from "../../components/family-stories";
import type { RecipeDoc } from "../../src/services/recipes";
import RecipeDetail from "@/components/RecipeDetailRN";
import { LinearGradient } from "expo-linear-gradient";
import RecipeCard from "./components/RecipeCard";
import RegionButton from "./components/RegionButton";

export default function App() {
  const [stories, setStories] = useState<FamilyStory[]>([]);
    const [showDetail, setShowDetail] = useState(false);
    const { width } = useWindowDimensions();
    const padding = 16;
    const gap = 16;
    const numColumns = 2;
    const cardWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;
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
  const recipes = [
    {
      title: "Abuela's Street Tacos",
      familyName: "Rodriguez Family",
      location: "Mexico City, Mexico",
      generations: 5,
      likes: 234,
     // image: require("./assets/tacos.png"),
      overlayColor: "rgba(255,214,168,0.6)"//,
     // titleFont: "josefin",
    },
    {
      title: "Nonna's Pizza Margherita",
      familyName: "Ricci Family",
      location: "Naples, Italy",
      generations: 4,
      likes: 567,
   //   image: require("./assets/pizza.png"),
      overlayColor: "rgba(255,204,211,0.6)"//,
     // titleFont: "josefin",
    },
    // add others the same way
  ];

  const regions = [
    { emoji: "🍜", label: "Asia", bgColor: "rgba(255,161,173,0.7)" },
    { emoji: "🥐", label: "Europe", bgColor: "rgba(142,197,255,0.7)" },
    { emoji: "🌮", label: "Americas", bgColor: "rgba(123,241,168,0.7)" },
    { emoji: "🍲", label: "Africa", bgColor: "rgba(255,223,32,0.7)" },
    { emoji: "🧆", label: "Middle East", bgColor: "rgba(205,174,255,0.7)" },
  ];

  return (
    <LinearGradient
      colors={["#a1c5a8", "#fbf2cc"]}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>
            Discover family stories
          </Text>
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
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: cardWidth,
                transform: [
                  { rotate: index % 2 === 0 ? "-1deg" : "1deg" }],
                  marginBottom:16,
              }}
            >
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
        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Share Your Story</Text>
          <Text style={styles.ctaSubtitle}>
            Every recipe has a history. Add yours!
          </Text>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              Add Your Recipe
            </Text>
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