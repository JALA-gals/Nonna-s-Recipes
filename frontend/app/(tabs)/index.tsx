import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/src/lib/firebase";
import SettingsModal from "@/components/settings-modal";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type Recipe = {
  id: string;
  title: string;
  origin?: { name?: string; countryCode?: string };
  photoUrl?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Back");

  useEffect(() => {
    // Listen for auth state, then fetch that user's recipes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Use display name if available
      if (user.displayName) setUserName(user.displayName);

      try {
        const q = query(
          collection(db, "recipes"),
          where("createdBy", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const fetched: Recipe[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.recipeName ?? data.title ?? data.name ?? "Untitled Recipe",
            origin: data.origin,
            photoUrl: data.photoUrl,
          };
        });
        setRecipes(fetched);
      } catch (e) {
        console.log("Error fetching recipes:", e);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const handleMapClick = () => {
    router.push("/(tabs)/map");
  };

  const handleRecipeClick = (id: string) => {
    router.push(`/(tabs)/${id}`);
  };

  return (
    <LinearGradient colors={["#a1c5a8", "#fbf2cc"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* WHITE HEADER BLOCK */}
        <View style={styles.headerBlock}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back Lilly!</Text>

           <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Image
              source={require("../../assets/images/profile.png")}
              style={styles.profileCircleImage}
            />
          </TouchableOpacity>
          </View>
        </View>

        {/* REST OF CONTENT */}
        <View style={styles.contentContainer}>

          {/* CULINARY WORLD */}
          <Text style={styles.sectionTitle}>Your Culinary World</Text>
          <View style={styles.worldWrapper}>
            <TouchableOpacity style={styles.worldCard} onPress={handleMapClick}>
              <Image
                source={require("../../assets/images/map-preview.png")}
                style={styles.mapPlaceholder}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* RECIPES */}
          <TouchableOpacity onPress={() => router.push("/(tabs)/UserRecipes")}>
            <Text style={[styles.sectionTitle, styles.recipeSectionTitle]}>
              Your Recipes ›
            </Text>
          </TouchableOpacity>
          <View style={styles.recipeWrapper}>
            {loading ? (
              <ActivityIndicator color="#7b3306" />
            ) : recipes.length === 0 ? (
              <Text style={styles.emptyText}>No recipes yet. Add one!</Text>
            ) : (
              <View style={styles.recipeSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recipes.map((recipe) => {
                    const location = recipe.origin?.name
                      ? `${recipe.origin.name}${recipe.origin.countryCode ? `, ${recipe.origin.countryCode}` : ""}`
                      : "Unknown origin";

                    return (
                      <View
                        key={recipe.id}
                        style={styles.recipeCard}
                      >
                        <Text style={styles.recipeTitle}>{recipe.title}</Text>
                        <Text style={styles.recipeLocation}>{location}</Text>
                        {recipe.photoUrl ? (
                          <Image
                            source={{ uri: recipe.photoUrl }}
                            style={styles.recipeImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.recipeImage}>
                            <Text style={styles.placeholderText}>No Image</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>

        </View>
      </ScrollView>
    </View>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        profilePhotoUrl={profilePhotoUrl}
        onPressChangePhoto={handleChangePhoto}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#a0c5aa",
  },
  profileCircleImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  headerBlock: {
    backgroundColor: "#FFFEFA",
    opacity: 0.70,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 90,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  contentContainer: { flex: 1, paddingHorizontal: 20 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  title: { fontSize: 28, color: "#7b3306", fontWeight: "600", flex: 1 },

  profileCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#d9d9d9", justifyContent: "center", alignItems: "center",
  },

  profileText: { fontSize: 10, color: "#666" },

  sectionTitle: { fontSize: 22, color: "#7b3306", fontWeight: "600", marginTop: 40, marginBottom: 10 },

  recipeSectionTitle: { marginTop: 30 },

  worldWrapper: {
    backgroundColor: "#e6d3c3",
    padding: 16,
    borderRadius: 16,
       shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  worldCard: {
    borderRadius: 12, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },

  mapPlaceholder: { height: 170, width: "100%", borderRadius: 12 },

  recipeWrapper: {
    backgroundColor: "#FFBD9C",
    borderRadius: 20,
    padding: 16,
    marginBottom: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  recipeSection: {},

  recipeCard: { width: width * 0.5, marginRight: 15 },

  recipeTitle: { fontSize: 14, color: "#7b3306", marginTop: 10 },

  recipeLocation: { fontSize: 12, color: "#7b3306", opacity: 0.7 },

  recipeImage: {
    height: 160,
    backgroundColor: "#fff2eb",
    borderRadius: 6,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: { fontSize: 12, color: "#cfb29c" },

  emptyText: { fontSize: 14, color: "#7b3306", opacity: 0.6, textAlign: "center", paddingVertical: 10 },
});