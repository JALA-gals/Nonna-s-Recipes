/**
 * RecipeDetailRN Component (Modal)
 *
 * Shows:
 * - Image (editable locally via ImagePicker)
 * - Recipe Name
 * - Recipe Ancestry (storyteller + origin)
 * - Ingredients (from Firestore schema objects)
 * - Instructions (from Firestore schema steps)
 *
 * Removed:
 * - Family Story section
 * - Start Cooking button
 * - Share with Family button
 */

import React, { useEffect, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Responsive sizing
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;

// ===== Firestore-ish Types (matches your schema) =====
type Origin = {
  name?: string;
  countryCode?: string;
  lat?: number | null;
  lng?: number | null;
};

type Ingredient = {
  item: string;
  amount?: string;
  preparation?: string;
  note?: string;
};

type Step = {
  step: number;
  instruction: string;
  tip?: string;
  note?: string;
};

export type RecipeDetailData = {
  id: string;
  title: string;
  photoUrl?: string;
  storyteller?: string;
  origin?: Origin;
  ingredients?: Ingredient[];
  steps?: Step[];
};

export interface RecipeDetailProps {
  visible: boolean;
  onClose: () => void;
  recipe?: RecipeDetailData;
  onEdit?: () => void;
}

// ===== ICON COMPONENTS =====
const ArrowLeftIcon = () => <Text style={styles.iconText}>←</Text>;
const EditIcon = () => <Text style={[styles.iconText, { fontSize: scale(20) }]}>✎</Text>;
const UserIcon = () => <Text style={[styles.iconText, { color: "#ff3636" }]}>👤</Text>;
const MapPinIcon = () => <Text style={[styles.iconText, { color: "#1447E6" }]}>📍</Text>;

// ===== MAIN COMPONENT =====
export default function RecipeDetailRN({
  recipe,
  visible,
  onClose,
  onEdit,
}: RecipeDetailProps) {
  const backgroundImage = require("../assets/images/tree-background.jpg");

  const [localImage, setLocalImage] = useState<string | null>(null);

  // When recipe changes, use its photoUrl unless user picked a local one
  useEffect(() => {
    setLocalImage(recipe?.photoUrl ?? null);
  }, [recipe?.id]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setLocalImage(uri);
    }
  };

  const originText = useMemo(() => {
    const name = recipe?.origin?.name?.trim();
    const cc = recipe?.origin?.countryCode?.trim();
    if (name && cc) return `${name}, ${cc}`;
    if (name) return name;
    return "Unknown";
  }, [recipe?.origin?.name, recipe?.origin?.countryCode]);

  const sortedSteps = useMemo(() => {
    const steps = Array.isArray(recipe?.steps) ? recipe!.steps! : [];
    return steps.slice().sort((a, b) => (a.step ?? 0) - (b.step ?? 0));
  }, [recipe?.steps]);

  if (!recipe) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* Background Layer */}
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
          resizeMode="cover"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.7}>
              <ArrowLeftIcon />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
              {recipe.title}
            </Text>

            <TouchableOpacity onPress={onEdit} style={styles.editButton} activeOpacity={0.7}>
              <EditIcon />
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Recipe Image */}
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer} activeOpacity={0.9}>
              {localImage ? (
                <Image source={{ uri: localImage }} style={styles.recipeImage} resizeMode="cover" />
              ) : (
                <View style={styles.placeholderBox}>
                  <Text style={styles.placeholderText}>Add an Image</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Recipe Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recipe Name</Text>
              <View style={styles.card}>
                <Text style={styles.cardText}>{recipe.title}</Text>
              </View>
            </View>

            {/* Recipe Ancestry */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recipe Ancestry</Text>

              {/* storyteller -> "Original Recipe From" */}
              <View style={[styles.card, styles.ancestryCard]}>
                <Text style={[styles.cardLabel, { color: "#ff3636" }]}>Original Recipe From</Text>
                <View style={styles.cardRow}>
                  <UserIcon />
                  <Text style={styles.cardSubtext}>
                    {recipe.storyteller?.trim() ? recipe.storyteller : "Unknown"}
                  </Text>
                </View>
              </View>

              {/* origin -> "Origin Location" */}
              <View style={[styles.card, styles.ancestryCard]}>
                <Text style={[styles.cardLabel, { color: "#193cb8" }]}>Origin Location</Text>
                <View style={styles.cardRow}>
                  <MapPinIcon />
                  <Text style={styles.cardSubtext}>{originText}</Text>
                </View>
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.contentCard}>
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, index) => {
                    const amount = ing.amount?.trim();
                    const prep = ing.preparation?.trim();
                    const note = ing.note?.trim();

                    return (
                      <Text key={index} style={styles.listItem}>
                        • {amount ? `${amount} ` : ""}
                        {ing.item}
                        {prep ? ` (${prep})` : ""}
                        {note ? ` — ${note}` : ""}
                      </Text>
                    );
                  })
                ) : (
                  <Text style={styles.placeholderText}>No ingredients available</Text>
                )}
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.contentCard}>
                {sortedSteps.length > 0 ? (
                  sortedSteps.map((s, idx) => {
                    const tip = s.tip?.trim();
                    const note = s.note?.trim();

                    return (
                      <View key={`${s.step}-${idx}`} style={styles.stepContainer}>
                        <Text style={styles.stepTitle}>Step {idx + 1}:</Text>
                        <Text style={styles.stepDescription}>{s.instruction}</Text>
                        {!!tip && <Text style={styles.stepMeta}>Tip: {tip}</Text>}
                        {!!note && <Text style={styles.stepMeta}>Note: {note}</Text>}
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.placeholderText}>No instructions available</Text>
                )}
              </View>
            </View>

            {/* ✅ Removed: Family Story section */}
            {/* ✅ Removed: Start Cooking + Share buttons */}
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    </Modal>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#a5caaf",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fffad5",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: scale(18),
    color: "#7b3306",
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: "#fffad5",
  },
  backgroundImageStyle: {
    opacity: 0.2,
  },

  placeholderBox: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  placeholderText: {
    color: "#777",
    fontSize: 16,
    fontWeight: "500",
  },

  // ===== HEADER =====
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    backgroundColor: "#fffdf9",
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: scale(24),
    color: "#7b3306",
    textAlign: "center",
    marginHorizontal: scale(12),
  },
  editButton: {
    width: scale(28),
    height: scale(28),
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: scale(20),
    color: "#7b3306",
  },

  // ===== SCROLL CONTENT =====
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
  },

  // ===== IMAGE =====
  imageContainer: {
    width: "100%",
    height: verticalScale(256),
    borderRadius: scale(25),
    overflow: "hidden",
    marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  recipeImage: { width: "100%", height: "100%" },

  // ===== SECTIONS =====
  section: { marginBottom: verticalScale(24) },
  sectionTitle: {
    fontSize: scale(24),
    fontWeight: "500",
    color: "#7b3306",
    marginBottom: verticalScale(12),
  },

  // ===== CARDS =====
  card: {
    backgroundColor: "#fffdf9",
    borderRadius: scale(14),
    padding: scale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: verticalScale(12),
  },
  cardText: {
    fontSize: scale(16),
    color: "#0a0a0a",
  },

  // ===== ANCESTRY CARDS =====
  ancestryCard: {
    borderRadius: scale(25),
    padding: scale(16),
  },
  cardLabel: {
    fontSize: scale(14),
    marginBottom: verticalScale(8),
  },
  cardRow: { flexDirection: "row", alignItems: "center" },
  cardSubtext: {
    fontSize: scale(16),
    color: "#7e807d",
    marginLeft: scale(12),
  },

  // ===== CONTENT CARDS =====
  contentCard: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: scale(25),
    padding: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  listItem: {
    fontSize: scale(16),
    color: "#0a0a0a",
    lineHeight: scale(24),
    marginBottom: verticalScale(8),
  },

  // ===== INSTRUCTIONS =====
  stepContainer: { marginBottom: verticalScale(12) },
  stepTitle: {
    fontSize: scale(16),
    fontWeight: "500",
    color: "#0a0a0a",
    marginBottom: verticalScale(4),
  },
  stepDescription: {
    fontSize: scale(16),
    color: "#0a0a0a",
    lineHeight: scale(24),
  },
  stepMeta: {
    marginTop: verticalScale(4),
    fontSize: scale(14),
    color: "rgba(10,10,10,0.65)",
    lineHeight: scale(20),
  },
});