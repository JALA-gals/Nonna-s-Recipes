import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Search, BookOpen } from "lucide-react-native";
import UserRecipeCard from "./components/UserRecipeCard";
import { LinearGradient } from "expo-linear-gradient";

type Recipe = {
  id: string;
  name: string;
  image: string;
  origin: string;
  location: string;
  family: string;
  date: string;
  story: string;
  ingredients: number;
  cookTime: string;
  generations: number;
  likes: number;
  liked: boolean;
  overlayColor: string;
  tagColor: string;
  region: string;
  regionEmoji: string;
};

const recipesData: Recipe[] = [
  {
    id: "1",
    name: "Baba's Baozi",
    image: "",
    origin: "Grandmother Wei",
    location: "Beijing, China",
    family: "Wei Family",
    date: "~1965",
    story:
      "These steamed buns were Baba's pride and joy. Every Chinese New Year, the whole family would gather in the kitchen, flour dusted on every surface, as she showed us the secret fold that made her baozi stand apart from any restaurant. She learned from her mother during the Cultural Revolution, when simple ingredients had to be transformed into something magical.",
    ingredients: 12,
    cookTime: "2 hours",
    generations: 4,
    likes: 189,
    liked: true,
    overlayColor: "rgba(255,214,168,0.3)",
    tagColor: "rgba(255,161,173,0.7)",
    region: "Asia",
    regionEmoji: "🥟",
  },
  {
  id: "3",
  name: "Stir-fried Tomatoes and Scrambled Eggs",
  image: "", // add a URL or local image path if available
  origin: "Family Kitchen",
  location: "China",
  family: "Zhang Family",
  date: "~1975",
  story:
    "This simple yet beloved dish has been passed down in the Zhang family for generations. Juicy tomatoes and fluffy scrambled eggs create a comforting and flavorful meal, perfect for a quick dinner with steamed rice. Every bite reminds us of home and family warmth.",
  ingredients: 5,
  cookTime: "15 minutes",
  generations: 3,
  likes: 145,
  liked: false,
  overlayColor: "rgba(255,214,168,0.3)",
  tagColor: "rgba(255,161,173,0.7)",
  region: "Asia",
  regionEmoji: "🍅",
}
  // ...add remaining recipes here
];

const filterOptions = ["All", "Asia", "Europe", "Americas", "Africa", "Middle East"];
const filterColors: Record<string, string> = {
  All: "rgba(255,204,127,0.8)",
  Asia: "rgba(255,161,173,0.7)",
  Europe: "rgba(142,197,255,0.7)",
  Americas: "rgba(123,241,168,0.7)",
  Africa: "rgba(255,223,32,0.7)",
  "Middle East": "rgba(205,174,255,0.7)",
};

export default function UserRecipesScreen() {
  const [recipes, setRecipes] = useState(recipesData);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = recipes.filter((r) => {
    const matchesFilter = activeFilter === "All" || r.region === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleLike = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
          : r
      )
    );
  };

  const handleEdit = (id: string) => {
    const recipe = recipes.find((r) => r.id === id);
    alert(`Edit recipe "${recipe?.name}" — connect this to your edit screen.`);
  };

  return (
    <LinearGradient colors={["#a1c5a8", "#fbf2cc"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Recipes</Text>
          <Text style={styles.subTitle}>{filteredRecipes.length} family treasures</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#828282" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your recipes..."
            placeholderTextColor="#828282"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 10, paddingLeft: 16 }}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterTag,
                {
                  backgroundColor: filterColors[filter],
                  opacity: activeFilter === filter ? 1 : 0.7,
                },
              ]}
            >
              <Text style={styles.filterText}>
                {filter === "Asia" && "🍜 "}
                {filter === "Europe" && "🥐 "}
                {filter === "Americas" && "🌮 "}
                {filter === "Africa" && "🍲 "}
                {filter === "Middle East" && "🧆 "}
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recipe Cards */}
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 50 }}
          renderItem={({ item }) => (
            <UserRecipeCard
              recipe={item}
              onToggleLike={() => toggleLike(item.id)}
              onEdit={() => handleEdit(item.id)}
            />
          )}
        />

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <BookOpen size={28} color="#7b3306" />
            </View>
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptySubTitle}>Try a different search or filter</Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: { paddingHorizontal: 16, paddingBottom: 10 },
  title: { fontSize: 28, color: "#7b3306", fontWeight: "700" },
  subTitle: { fontSize: 13, color: "rgba(151,60,0,0.6)" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: "#7b3306" },
  filterTag: {
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterText: { fontSize: 13, color: "#7b3306" },
  emptyState: { alignItems: "center", paddingTop: 50 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,204,127,0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 16, color: "#7b3306", marginBottom: 4 },
  emptySubTitle: { fontSize: 13, color: "rgba(151,60,0,0.5)", textAlign: "center" },
});