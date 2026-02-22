import React from "react";
import { View, Text, FlatList, StyleSheet, useWindowDimensions, Alert } from "react-native";
import { FamilyStoryCard, type FamilyStory } from "../../components/family-stories";

const mockStories: FamilyStory[] = [
  {
    id: "1",
    title: "Abuela's Street Tacos",
    familyName: "Rodriguez Family",
    locationText: "Mexico City, Mexico",
    imageUrl: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=60",
    likeCount: 234,
    generations: 5,
  },
  {
    id: "2",
    title: "Nonna's Pizza Margherita",
    familyName: "Ricci Family",
    locationText: "Naples, Italy",
    imageUrl: "https://images.unsplash.com/photo-1548365328-8b849e6f0b1a?auto=format&fit=crop&w=1200&q=60",
    likeCount: 567,
    generations: 4,
  },
];

export default function TestingFamilyStories() {
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 3 : 2;

  const gap = 14;
  const padding = 16;
  const cardWidth = (width - padding * 2 - gap * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.page}>
      <Text style={styles.header}>Family Stories (Test)</Text>

      <FlatList
        data={mockStories}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: padding, paddingBottom: 24 }}
        columnWrapperStyle={numColumns > 1 ? { gap } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: gap }} />}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <FamilyStoryCard
              story={item}
              onPress={(id) => Alert.alert("Pressed", id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#eef4ea", paddingTop: 16 },
  header: { fontSize: 22, fontWeight: "600", color: "#7b3306", paddingHorizontal: 16, marginBottom: 12 },
});