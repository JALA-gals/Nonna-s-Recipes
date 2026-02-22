import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MyRecipieCard, Recipe } from "./components/MyRecipeCard";

const recipes: Recipe[] = [/* your recipes array */];

const filterOptions = ["All", "Asia", "Europe", "Americas", "Africa", "Middle East"];

export default function MyRecipes() {
  const [recipeData, setRecipeData] = useState(recipes);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);

  const filteredRecipes = recipeData.filter((r) => {
    const matchesFilter = activeFilter === "All" || r.region === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleToggleLike = (id: string) => {
    setRecipeData((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  };

  const handleSaveRecipe = (updatedRecipe: Recipe) => {
    setRecipeData((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
    setEditingRecipe(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Recipes</Text>
          <Text style={styles.subtitle}>
            {recipeData.length} family treasures
          </Text>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#828282" />
          <TextInput
            placeholder="Search your recipes..."
            placeholderTextColor="#828282"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterTag,
                activeFilter === filter && styles.activeFilter,
              ]}
            >
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <MyRecipieCard
              recipe={item}
              onToggleLike={handleToggleLike}
              onSave={handleSaveRecipe}
              isEditing={editingRecipe === item.id}
              onEdit={() => setEditingRecipe(item.id)}
              onCancel={() => setEditingRecipe(null)}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9D5" },
  header: { padding: 20 },
  title: { fontSize: 28, color: "#7b3306", fontWeight: "600" },
  subtitle: { fontSize: 14, color: "rgba(151,60,0,0.6)" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 20,
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#7b3306" },
  filterRow: { paddingHorizontal: 20, marginTop: 10 },
  filterTag: {
    backgroundColor: "rgba(255,204,127,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: { transform: [{ scale: 1.05 }] },
  filterText: { color: "#7b3306", fontSize: 13 },
});