import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../../src/lib/firebase"; // adjust path
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
function fallbackLocation(d: any) {
  const loc = d.originLocation ?? d.location ?? d.origin;

  // if it's already a string, use it
  if (typeof loc === "string") return loc;

  // if it's an object like { name, lat, lng, countryCode }
  if (loc && typeof loc === "object") {
    if (typeof loc.name === "string" && loc.name.trim().length > 0) return loc.name;
  }

  return "Location, Country";
}

function fallbackStory(d: any) {
  // Use Firestore story if it exists
  if (typeof d.familyStory === "string" && d.familyStory.trim().length > 0) return d.familyStory;

  // Otherwise generate a “fake-data-style” story from what we know
  const name = d.recipeName ?? "this recipe";
  const person = d.originalRecipeFrom ?? d.family ?? "my family";
  const location = fallbackLocation(d);

  return `This dish has been passed down in our family for generations. Every time we make ${name}, it brings us back to ${location} and the people who taught us to cook it — especially ${person}.`;
}

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
const [recipes, setRecipes] = useState<Recipe[]>([]);
const [loading, setLoading] = useState(true);
const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    setRecipes([]);
    setLoading(false);
    return;
  }

  // If your recipes are stored under /recipes and have ownerId
  const q = query(
  collection(db, "recipes"),
  where("createdBy", "==", uid)
);

  const unsub = onSnapshot(
    q,
    (snap) => {
      const data: Recipe[] = snap.docs.map((docSnap) => {
        const d: any = docSnap.data();

        // Map Firestore fields -> your UI Recipe shape
const name = d.recipeName ?? d.name ?? d.title ?? "Untitled";        const location = fallbackLocation(d);
        const family = d.originalRecipeFrom ?? d.family ?? "";
        const date = d.estimatedCreationDate ?? "";
        const story = fallbackStory(d);
        const image = d.imageUrl ?? "";

        // region: if you store it, use it; otherwise default
        const region = d.region ?? "All";

        return {
          id: docSnap.id,
          name,
          image,
          origin: d.originalRecipeFrom ?? "",
          location,
          family,
          date,
          story,
          ingredients: Array.isArray(d.ingredients) ? d.ingredients.length : 0,
          cookTime: d.cookTime ?? "",
          generations: d.generations ?? 0,
          likes: d.likes ?? 0,
          liked: false, // you can wire this later per user
          overlayColor: "rgba(255,214,168,0.3)",
          tagColor: "rgba(255,161,173,0.7)",
          region,
          regionEmoji: "🍽️",
        };
      });

      setRecipes(data);
      setLoading(false);
    },
    (err) => {
      console.log("Firestore error:", err);
      setLoading(false);
    }
  );

  return () => unsub();
}, []);
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
       <SafeAreaView style={{ flex: 1 }}>
  <FlatList
    data={filteredRecipes}
    keyExtractor={(item) => item.id}
    contentContainerStyle={{ paddingBottom: 50 }}
    ListHeaderComponent={
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Your Recipes</Text>
          <Text style={styles.subTitle}>{filteredRecipes.length} family treasures</Text>
        </View>

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
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && (
          <Text style={{ paddingHorizontal: 16, color: "#7b3306" }}>Loading...</Text>
        )}
      </View>
    }
    renderItem={({ item }) => (
      <View style={{ paddingHorizontal: 16 }}>
        <UserRecipeCard
          recipe={item}
          onToggleLike={() => toggleLike(item.id)}
          onEdit={() => handleEdit(item.id)}
        />
      </View>
    )}
    ListEmptyComponent={
      !loading ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <BookOpen size={28} color="#7b3306" />
          </View>
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptySubTitle}>Try a different search or filter</Text>
        </View>
      ) : null
    }
  />
  </SafeAreaView>
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