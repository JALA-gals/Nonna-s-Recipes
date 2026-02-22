
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { SearchBarComponent } from '../components/SearchBar';
import { recipeData } from '../data/recipeData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 375;
const SCALE = SCREEN_WIDTH / DESIGN_WIDTH;
const scale = (size: number) => size * SCALE;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentPadding}>
            <View style={styles.headerSection}>
              <Text style={styles.pageTitle}>Welcome Back Lilly!</Text>
            </View>

            <View style={styles.sectionSpacing}>
              <SearchBarComponent />
            </View>

            <TouchableOpacity 
              style={styles.sectionSpacing}
              onPress={() => router.push('/map')}
              activeOpacity={0.8}
            >
              <Text style={styles.sectionTitle}>Your Culinary World</Text>
              <View style={styles.mapContainer}>
                <Svg width="100%" height={scale(170)} viewBox="0 0 318 170">
                  <Defs>
                    <LinearGradient id="mapGrad" x1="159" y1="0" x2="159" y2="170">
                      <Stop offset="0" stopColor="#99E4E5" />
                      <Stop offset="1" stopColor="#CEFFEF" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="318" height="170" fill="url(#mapGrad)" rx="12" />
                  <Path d="M40 60 L120 55 L150 95 L100 140 L60 125 Z" fill="#87B053" />
                  <Path d="M180 110 L250 100 L280 150 L240 180 L190 170 Z" fill="#87B053" />
                </Svg>
              </View>
            </TouchableOpacity>

            <View style={styles.sectionSpacing}>
              <Text style={styles.sectionTitle}>Your Recipes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recipeData?.slice(0, 2).map((recipe) => (
                  <View key={recipe.id} style={styles.recipeCard}>
                    <Text style={styles.recipeName}>{recipe.title}</Text>
                    <Text style={styles.recipeLocation}>{recipe.location}</Text>
                    <Image 
                      source={recipe.image} 
                      style={styles.recipeImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
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
  pageTitle: {
    fontSize: scale(32),
    color: '#7b3306',
    fontWeight: '400',
  },
  sectionSpacing: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: scale(24),
    color: '#7b3306',
    marginBottom: scale(12),
    fontWeight: '400',
  },
  mapContainer: {
    backgroundColor: '#F9E9DC',
    borderRadius: scale(12),
    padding: scale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  recipeCard: {
    marginRight: scale(16),
    width: scale(138),
  },
  recipeName: {
    fontSize: scale(13),
    color: '#7b3306',
    marginBottom: scale(4),
  },
  recipeLocation: {
    fontSize: scale(10),
    color: '#7b3306',
    marginBottom: scale(8),
  },
  recipeImage: {
    width: scale(138),
    height: scale(112),
    borderRadius: scale(8),
  },
});