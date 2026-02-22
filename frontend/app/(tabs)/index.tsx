import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import SettingsModal from "@/components/settings-modal";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  async function handleChangePhoto() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) setProfilePhotoUrl(result.assets[0].uri);
}

  const handleRecipeClick = (recipeName: string) => {
    console.log("Navigate to recipe:", recipeName);
  };

  const handleMapClick = () => {
    router.push("/(tabs)/map");
  };

  return (
    <LinearGradient colors={["#a1c5a8", "#fbf2cc"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* WHITE HEADER BLOCK */}
        <View style={styles.headerBlock}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back Lilly!</Text>

            <TouchableOpacity onPress={() => setShowSettings(true)}>
              {profilePhotoUrl ? (
                <Image
                  source={{ uri: profilePhotoUrl }}
                  style={styles.profileCircleImage}
                />
              ) : (
                <View style={styles.profileCircle}>
                  <Text style={styles.profileText}>User</Text>
                </View>
              )}
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
          <Text style={[styles.sectionTitle, styles.recipeSectionTitle]}>
            Your Recipes
          </Text>

          <View style={styles.recipeWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { name: "Baba's Baozi", location: "Beijing, China" },
                { name: "Mama's Noodles", location: "Guandong, China" },
                { name: "Sample Recipe", location: "Location, Country" },
              ].map((recipe) => (
                <TouchableOpacity
                  key={recipe.name}
                  style={styles.recipeCard}
                  onPress={() => handleRecipeClick(recipe.name)}
                >
                  <Text style={styles.recipeTitle}>{recipe.name}</Text>
                  <Text style={styles.recipeLocation}>{recipe.location}</Text>

                  <View style={styles.recipeImage}>
                    <Text style={styles.placeholderText}>Recipe Image</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

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
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 90,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    color: "#7b3306",
    fontWeight: "600",
    flex: 1,
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#d9d9d9",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    fontSize: 10,
    color: "#666",
  },

  sectionTitle: {
    fontSize: 22,
    color: "#7b3306",
    fontWeight: "600",
    marginTop: 40,
    marginBottom: 10,
  },

  recipeSectionTitle: {
    marginTop: 30,
  },

  worldWrapper: {
    backgroundColor: "#e6d3c3",
    padding: 16,
    borderRadius: 16,
  },

  worldCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  mapPlaceholder: {
    height: 170,
    width: "100%",
    borderRadius: 12,
  },

  recipeWrapper: {
    backgroundColor: "#FFBD9C",
    borderRadius: 20,
    padding: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  recipeCard: {
    width: width * 0.5,
    marginRight: 15,
  },

  recipeTitle: {
    fontSize: 14,
    color: "#7b3306",
    marginTop: 10,
  },

  recipeLocation: {
    fontSize: 12,
    color: "#7b3306",
    opacity: 0.7,
  },

  recipeImage: {
    height: 112,
    backgroundColor: "#fff2eb",
    borderRadius: 6,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 12,
    color: "#cfb29c",
  },
});