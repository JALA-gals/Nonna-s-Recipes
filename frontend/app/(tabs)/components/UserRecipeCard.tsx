import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Heart, Pencil, Clock, ChefHat, Users } from "lucide-react-native";

export type Recipe = {
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

type Props = {
  recipe: Recipe;
  onToggleLike: () => void;
  onEdit: () => void;
};

export default function UserRecipeCard({ recipe, onToggleLike, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {/* Image */}
      {recipe.image !== "" && (
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Region Tag */}
      <View style={[styles.regionTag, { backgroundColor: recipe.tagColor }]}>
        <Text style={styles.regionTagText}>
          {recipe.regionEmoji} {recipe.region}
        </Text>
      </View>

      {/* Title Row */}
      <View style={styles.titleRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.family}>{recipe.family} · {recipe.date}</Text>
        </View>

        {/* Edit Button */}
        <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
          <Pencil size={16} color="#7b3306" />
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity onPress={onToggleLike} style={styles.iconButton}>
          <Heart
            size={16}
            color={recipe.liked ? "#FF2056" : "#7b3306"}
            fill={recipe.liked ? "#FF2056" : "transparent"}
          />
          <Text style={styles.likesText}>{recipe.likes}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <ChefHat size={13} color="#973C00" />
          <Text style={styles.statText}>{recipe.ingredients} ingredients</Text>
        </View>
        <View style={styles.stat}>
          <Clock size={13} color="#973C00" />
          <Text style={styles.statText}>{recipe.cookTime}</Text>
        </View>
        <View style={styles.stat}>
          <Users size={13} color="#973C00" />
          <Text style={styles.statText}>{recipe.generations} generations</Text>
        </View>
      </View>

      {/* Story */}
      <Text style={styles.story} numberOfLines={expanded ? undefined : 3}>
        {recipe.story}
      </Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.readMore}>{expanded ? "Show less" : "Read more"}</Text>
      </TouchableOpacity>

      {/* Origin */}
      <Text style={styles.origin}>📍 {recipe.origin} · {recipe.location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
  },
  regionTag: {
    alignSelf: "flex-start",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 10,
  },
  regionTagText: {
    fontSize: 11,
    color: "#7b3306",
    fontWeight: "600",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    color: "#7b3306",
    fontWeight: "700",
  },
  family: {
    fontSize: 11,
    color: "rgba(151,60,0,0.6)",
    marginTop: 2,
  },
  iconButton: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.6)",
    marginLeft: 6,
  },
  likesText: {
    fontSize: 10,
    color: "#7b3306",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: "#973C00",
  },
  story: {
    fontSize: 12,
    color: "rgba(151,60,0,0.75)",
    lineHeight: 18,
  },
  readMore: {
    fontSize: 12,
    color: "#7b3306",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 10,
  },
  origin: {
    fontSize: 11,
    color: "rgba(151,60,0,0.5)",
    marginTop: 4,
  },
});