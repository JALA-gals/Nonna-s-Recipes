import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Recipe {
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
}

export function MyRecipieCard({
  recipe,
  onToggleLike,
}: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={[styles.overlay, { backgroundColor: recipe.overlayColor }]} />

        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onToggleLike(recipe.id)}
        >
          <Ionicons
            name={recipe.liked ? "heart" : "heart-outline"}
            size={16}
            color={recipe.liked ? "#FF2056" : "#973C00"}
          />
          <Text style={styles.likeText}>{recipe.likes}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.family}>{recipe.family}</Text>

        <Text style={styles.meta}>{recipe.location}</Text>

        <View style={styles.storyBox}>
          <Text style={styles.story}>
            {expanded
              ? recipe.story
              : `"${recipe.story.slice(0, 120)}..."`}
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMore}>
              {expanded ? "Show less" : "Read more"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fffdf9",
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
  },
  imageContainer: { height: 200 },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject },
  likeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: { marginLeft: 4, fontSize: 12 },
  content: { padding: 16 },
  title: { fontSize: 20, color: "#7b3306", fontWeight: "600" },
  family: { fontSize: 13, color: "rgba(236,0,63,0.8)" },
  meta: { fontSize: 12, color: "rgba(151,60,0,0.7)" },
  storyBox: {
    marginTop: 10,
    backgroundColor: "#fff0a0",
    padding: 10,
    borderRadius: 16,
  },
  story: {
    fontSize: 12,
    fontStyle: "italic",
    color: "rgba(151,60,0,0.7)",
  },
  readMore: {
    marginTop: 4,
    fontSize: 12,
    color: "#7b3306",
    textDecorationLine: "underline",
  },
});