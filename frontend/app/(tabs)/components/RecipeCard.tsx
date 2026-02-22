import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";

interface Props {
  title: string;
  familyName: string;
  location: string;
  generations: number;
  likes: number;
  image: any;
  overlayColor: string;
  titleFont?: "josefin" | "caveat";
}

export default function RecipeCard({
  title,
  familyName,
  location,
  generations,
  likes,
  image,
  overlayColor,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        <View
          style={[styles.overlay, { backgroundColor: overlayColor }]}
        />
        <View style={styles.likes}>
          <Text style={{ fontSize: 12 }}>❤️ {likes}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.family}>{familyName}</Text>
        <Text style={styles.location}>{location}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {generations} generations
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 24,
    width: 160,
    marginBottom: 14,
    overflow: "hidden",
  },
  imageContainer: {
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  likes: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    color: "#7b3306",
  },
  family: {
    fontSize: 12,
    color: "rgba(236,0,63,0.8)",
  },
  location: {
    fontSize: 10,
    color: "rgba(151,60,0,0.7)",
  },
  badge: {
    backgroundColor: "#ffcc7f",
    borderRadius: 20,
    marginTop: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "#7b3306",
  },
});