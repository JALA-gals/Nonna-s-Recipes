import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBarComponent } from '../components/SearchBar';
import { recipeData, regions } from '../data/recipeData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 375;
const SCALE = SCREEN_WIDTH / DESIGN_WIDTH;
const scale = (size: number) => size * SCALE;

export default function ExploreScreen() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredRecipes = selectedRegion 
    ? recipeData.filter(recipe => recipe.region === selectedRegion)
    : recipeData;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentPadding}>
            {/* Page Title */}
            <View style={styles.headerSection}>
              <Text style={styles.pageTitleLarge}>Explore</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.sectionSpacing}>
              <SearchBarComponent placeholder="Search recipes, places, family..." />
            </View>

            {/* Explore by Region Card */}
            <View style={[styles.sectionSpacing, styles.regionCard]}>
              <Text style={styles.regionCardTitle}>Explore by Region</Text>
              <View style={styles.regionButtonsContainer}>
                {regions.map((region) => (
                  <TouchableOpacity
                    key={region.name}
                    style={[
                      styles.regionButton,
                      { backgroundColor: region.color },
                      selectedRegion === region.name && styles.regionButtonSelected
                    ]}
                    onPress={() => setSelectedRegion(
                      selectedRegion === region.name ? null : region.name
                    )}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.regionEmoji}>{region.emoji}</Text>
                    <Text style={styles.regionText}>{region.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Family Stories Section */}
            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitleLarge}>Family Stories</Text>
              
              <View style={styles.storiesGrid}>
                {filteredRecipes.map((recipe) => (
                  <View key={recipe.id} style={styles.storyCard}>
                    {/* Image Section */}
                    <View style={styles.storyImageContainer}>
                      <Image 
                        source={recipe.image} 
                        style={styles.storyImage}
                        resizeMode="cover"
                      />
                      <View style={[styles.imageOverlay, { backgroundColor: recipe.bgColor }]} />
                      
                      {/* Like count */}
                      <View style={styles.likesContainer}>
                        <Text style={styles.likesText}>❤️ {recipe.likes}</Text>
                      </View>
                    </View>
                    
                    {/* Info Section */}
                    <View style={styles.storyInfo}>
                      <Text style={styles.storyTitle} numberOfLines={2}>
                        {recipe.title}
                      </Text>
                      <Text style={styles.storyFamily}>{recipe.family}</Text>
                      <Text style={styles.storyLocation} numberOfLines={1}>
                        📍 {recipe.location}
                      </Text>
                      <View style={styles.generationsBadge}>
                        <Text style={styles.generationsText}>{recipe.generations}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Add Recipe Button */}
              <View style={styles.addRecipeSection}>
                <Text style={styles.addRecipeTitle}>Share Your Story</Text>
                <Text style={styles.addRecipeSubtitle}>
                  Help us grow our families' collection of recipes and traditions
                </Text>
                <TouchableOpacity style={styles.addRecipeButton} activeOpacity={0.8}>
                  <Text style={styles.addRecipeButtonText}>Add Your Recipe</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#859f80',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(110),
  },
  contentPadding: {
    paddingHorizontal: scale(20),
  },
  headerSection: {
    marginTop: scale(16),
    marginBottom: scale(8),
  },
  pageTitleLarge: {
    fontSize: scale(32),
    color: '#7b3306',
    fontWeight: '400',
  },
  sectionSpacing: {
    marginBottom: scale(24),
  },
  regionCard: {
    backgroundColor: '#fffdf9',
    borderRadius: scale(24),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  regionCardTitle: {
    fontSize: scale(18),
    color: '#7b3306',
    marginBottom: scale(16),
    fontWeight: '400',
  },
  regionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    borderRadius: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  regionButtonSelected: {
    borderWidth: 2,
    borderColor: '#7b3306',
    transform: [{ scale: 1.05 }],
  },
  regionEmoji: {
    fontSize: scale(18),
    marginRight: scale(8),
  },
  regionText: {
    fontSize: scale(14),
    color: '#7b3306',
    fontWeight: '400',
  },
  sectionTitleLarge: {
    fontSize: scale(28),
    color: '#7b3306',
    marginBottom: scale(16),
    fontWeight: '400',
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: scale(8),
  },
  storyCard: {
    width: (SCREEN_WIDTH - scale(56)) / 2,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: scale(20),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: scale(16),
  },
  storyImageContainer: {
    height: scale(140),
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  likesContainer: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  likesText: {
    fontSize: scale(11),
    color: '#101828',
    fontWeight: '500',
  },
  storyInfo: {
    padding: scale(12),
  },
  storyTitle: {
    fontSize: scale(13),
    color: '#7b3306',
    marginBottom: scale(6),
    lineHeight: scale(18),
    fontWeight: '400',
  },
  storyFamily: {
    fontSize: scale(11),
    color: 'rgba(236,0,63,0.8)',
    marginBottom: scale(6),
  },
  storyLocation: {
    fontSize: scale(9),
    color: 'rgba(151,60,0,0.7)',
    marginBottom: scale(8),
  },
  generationsBadge: {
    backgroundColor: '#ffcc7f',
    borderRadius: scale(20),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    alignSelf: 'flex-start',
  },
  generationsText: {
    fontSize: scale(9),
    color: '#7b3306',
  },
  addRecipeSection: {
    backgroundColor: '#ffcc7f',
    borderRadius: scale(20),
    padding: scale(24),
    marginTop: scale(24),
    alignItems: 'center',
  },
  addRecipeTitle: {
    fontSize: scale(20),
    color: '#7b3306',
    marginBottom: scale(12),
    fontWeight: '400',
  },
  addRecipeSubtitle: {
    fontSize: scale(13),
    color: '#7b3306',
    textAlign: 'center',
    lineHeight: scale(18),
    marginBottom: scale(16),
    paddingHorizontal: scale(16),
  },
  addRecipeButton: {
    backgroundColor: '#fffdf9',
    paddingHorizontal: scale(24),
    paddingVertical: scale(12),
    borderRadius: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  addRecipeButtonText: {
    fontSize: scale(14),
    color: '#7b3306',
  },
});