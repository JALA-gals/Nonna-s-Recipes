import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
export interface FamilyStory {
  id: string;
  title: string;
  familyName: string;
  locationText?: string;
  imageUrl?: string;
  likeCount?: number;
  generations?: number;
}

// Simple icon components using Unicode emojis
const HeartIcon = ({ filled, size = 12 }: { filled?: boolean; size?: number }) => (
  <Text style={{ fontSize: size }}>
    {filled ? '❤️' : '🤍'}
  </Text>
);

const MapPinIcon = () => (
  <Text style={{ fontSize: 10, marginRight: 2 }}>📍</Text>
);

interface FamilyStoryCardProps {
  story: FamilyStory;
  onPress: (id: string) => void;
}

export function FamilyStoryCard({ story, onPress }: FamilyStoryCardProps) {
  return (
    <Pressable
      onPress={() => onPress(story.id)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Image area with like badge */}
      <View style={styles.imageContainer}>
        {story.imageUrl ? (
          <Image
            source={{ uri: story.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <HeartIcon size={48} />
          </View>
        )}
        
        {/* Like badge overlay */}
        {story.likeCount !== undefined && (
          <View style={styles.likeBadge}>
            <HeartIcon filled size={12} />
            <Text style={styles.likeCount}>{story.likeCount}</Text>
          </View>
        )}
      </View>

      {/* Text area */}
      <View style={styles.textContainer}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
        </View>

        {/* Family name */}
        <Text style={styles.familyName}>{story.familyName}</Text>

        {/* Location */}
        {story.locationText && (
          <View style={styles.locationRow}>
            <MapPinIcon />
            <Text style={styles.locationText}>{story.locationText}</Text>
          </View>
        )}

        {/* Generations pill */}
        {story.generations && (
          <View style={styles.generationsPillContainer}>
            <View style={styles.generationsPill}>
              <Text style={styles.generationsText}>
                {story.generations} {story.generations === 1 ? 'generation' : 'generations'}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  likeCount: {
    fontSize: 12,
    lineHeight: 16,
   
    color: '#101828',
  },
  textContainer: {
    padding: 16,
    gap: 8,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 22.5,
 
    color: '#7b3306',
    minHeight: 45,
  },
  familyName: {
    fontSize: 12,
    lineHeight: 16,
  
    color: 'rgba(236, 0, 63, 0.8)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 10,
    lineHeight: 16,
  
    color: 'rgba(151, 60, 0, 0.7)',
  },
  generationsPillContainer: {
    paddingTop: 4,
  },
  generationsPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffcc7f',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  generationsText: {
    fontSize: 10,
    lineHeight: 16,
   
    color: '#7b3306',
  },
});