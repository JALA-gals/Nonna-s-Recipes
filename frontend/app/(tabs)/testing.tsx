import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import RecipeDetail from "../../components/RecipeDetailRN";
export default function TestRecipeScreen() {
  const [showDetail, setShowDetail] = useState(false);

  // Fake recipe data
  const fakeRecipe = {
    id: "1",
    recipeName: "Nonna’s Sunday Lasagna",
    imageUrl:
      "https://images.unsplash.com/photo-1604908177522-0404d8f0b5c5?auto=format&fit=crop&w=800&q=80",
    originalRecipeFrom: "Maria Rossi",
    originLocation: "Sicily, Italy",
    estimatedCreationDate: "1952",
    prepTime: "30 min",
    cookTime: "1 hr",
    servings: "6",
    difficulty: "Medium",
    ingredients: [
      "1 lb ground beef",
      "1 lb Italian sausage",
      "Lasagna noodles",
      "Ricotta cheese",
      "Mozzarella cheese",
      "Tomato sauce",
      "Fresh basil",
    ],
    instructions: [
      { stepNumber: 1, description: "Boil noodles until al dente." },
      { stepNumber: 2, description: "Cook beef and sausage together." },
      { stepNumber: 3, description: "Layer noodles, sauce, and cheese." },
      { stepNumber: 4, description: "Bake at 375°F for 45 minutes." },
    ],
    familyStory:
      "This recipe has been passed down through generations. Nonna made it every Sunday after church, filling the house with warmth and the smell of tomatoes and basil.",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Recipe Page</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => setShowDetail(true)}
      >
        <Image
          source={{ uri: fakeRecipe.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.cardTitle}>{fakeRecipe.recipeName}</Text>
      </TouchableOpacity>

      {/* Full-screen popup */}
      <RecipeDetail
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        recipe={fakeRecipe}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "600",
  },
  card: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
});