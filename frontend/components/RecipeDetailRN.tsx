/**
 * RecipeDetail Component for React Native Expo
 * 
 * A dynamic recipe detail page that fetches data from Firestore.
 * Fully responsive and adapts to all screen sizes.
 * 
 * USAGE:
 * <RecipeDetail
 *   recipe={recipeFromFirestore}
 *   onBack={() => navigation.goBack()}
 *   onEdit={() => navigation.navigate('EditRecipe')}
 *   onStartCooking={() => navigation.navigate('CookingMode')}
 *   onShare={() => shareRecipe()}
 * />
 */

import React from 'react';
import {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Modal
} from 'react-native';


const { width, height } = Dimensions.get('window');

// Responsive sizing
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;

// ===== TYPE DEFINITIONS =====
export interface RecipeData {
  id: string;
  recipeName: string;
  imageUrl: string;
  
  // Recipe Ancestry
  originalRecipeFrom?: string;
  originLocation?: string;
  estimatedCreationDate?: string;
  
  // Recipe Info
  /** 
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  */
  // Content
  ingredients?: string[];
  instructions?: InstructionStep[];
  familyStory?: string;
}

export interface InstructionStep {
  stepNumber: number;
  description: string;
}

export interface RecipeDetailProps {
  visible: boolean;
    onClose: () => void;
    recipe?: RecipeData;
  onEdit?: () => void;
  onStartCooking?: () => void;
  onShare?: () => void;
}

// ===== ICON COMPONENTS =====
const ArrowLeftIcon = () => (
  <Text style={styles.iconText}>←</Text>
);

const EditIcon = () => (
  <Text style={[styles.iconText, { fontSize: scale(20) }]}>✎</Text>
);

const UserIcon = () => (
  <Text style={[styles.iconText, { color: '#ff3636' }]}>👤</Text>
);

const MapPinIcon = () => (
  <Text style={[styles.iconText, { color: '#1447E6' }]}>📍</Text>
);

const CalendarIcon = () => (
  <Text style={[styles.iconText, { color: '#008236' }]}>📅</Text>
);

// ===== MAIN COMPONENT =====
export default function RecipeDetail({
  recipe,
  visible,
  onClose,
  onEdit,
  onStartCooking,
  onShare,
}: RecipeDetailProps) {
  // UPDATE THIS PATH to your background image
  const backgroundImage = require('../assets/images/tree-background.jpg');
  const [localImage, setLocalImage] = useState(recipe?.imageUrl || null);
  const pickImage = async () => {
    // Ask for permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
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
  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
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
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeftIcon />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {recipe.recipeName}
          </Text>

          <TouchableOpacity
            onPress={onEdit}
            style={styles.editButton}
            activeOpacity={0.7}
          >
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
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {localImage ? (
            <Image
              source={{ uri: localImage }}
              style={styles.recipeImage}
              resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderBox}>
                <Text style={styles.placeholderText}>Add an Image</Text>
              </View>
            )}
          </TouchableOpacity>



          {/* Recipe Name Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe Name</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>{recipe.recipeName}</Text>
            </View>
          </View>

          {/* Recipe Ancestry Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe Ancestry</Text>

            {recipe.originalRecipeFrom && (
              <View style={[styles.card, styles.ancestryCard]}>
                <Text style={[styles.cardLabel, { color: '#ff3636' }]}>
                  Original Recipe From
                </Text>
                <View style={styles.cardRow}>
                  <UserIcon />
                  <Text style={styles.cardSubtext}>
                    {recipe.originalRecipeFrom}
                  </Text>
                </View>
              </View>
            )}

            {recipe.originLocation && (
              <View style={[styles.card, styles.ancestryCard]}>
                <Text style={[styles.cardLabel, { color: '#193cb8' }]}>
                  Origin Location
                </Text>
                <View style={styles.cardRow}>
                  <MapPinIcon />
                  <Text style={styles.cardSubtext}>
                    {recipe.originLocation}
                  </Text>
                </View>
              </View>
            )}

            {recipe.estimatedCreationDate && (
              <View style={[styles.card, styles.ancestryCard, { backgroundColor: '#f7f9f2' }]}>
                <Text style={[styles.cardLabel, { color: '#016630' }]}>
                  Estimated Creation Date
                </Text>
                <View style={styles.cardRow}>
                  <CalendarIcon />
                  <Text style={styles.cardSubtext}>
                    {recipe.estimatedCreationDate}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.contentCard}>
              {recipe.ingredients?.length ? (
              recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.listItem}>
                • {ingredient}
              </Text>
              ))
            ) : (
              <Text style={styles.placeholderText}>No ingredients available</Text>
        )}
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.contentCard}>
            {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
              recipe.instructions.map((step) => (
                <View key={step.stepNumber} style={styles.stepContainer}>
                   <Text style={styles.stepTitle}>Step {step.stepNumber}:</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
        ))
      ) : (
        <Text style={styles.placeholderText}>No instructions available</Text>
      )}
    </View>
  </View>

          {/* Family Story Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Story</Text>
            <View style={styles.storyCard}>
             <Text style={styles.storyText}>
                {recipe.familyStory || "No family story available"}
              </Text>

            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              onPress={onStartCooking}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start Cooking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onShare}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Share with Family</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#a5caaf',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fffad5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: scale(18),
    color: '#7b3306',
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: '#fffad5',
  },
  backgroundImageStyle: {
    opacity: 0.2,
  },
  placeholderBox: {
  width: '100%',
  height: '100%',
  borderRadius: 12,
  borderWidth: 2,
  borderColor: '#ccc',
  borderStyle: 'dashed',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
},

placeholderText: {
  color: '#777',
  fontSize: 16,
  fontWeight: '500',
},

  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    backgroundColor: '#fffdf9',
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: scale(24),
    color: '#7b3306',
    textAlign: 'center',
    marginHorizontal: scale(12),
  },
  editButton: {
    width: scale(28),
    height: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: scale(20),
    color: '#7b3306',
  },

  // ===== SCROLL CONTENT =====
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
  },

  // ===== IMAGE =====
  imageContainer: {
    width: '100%',
    height: verticalScale(256),
    borderRadius: scale(25),
    overflow: 'hidden',
    marginBottom: verticalScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },

  // ===== SECTIONS =====
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: scale(24),
    fontWeight: '500',
    color: '#7b3306',
    marginBottom: verticalScale(12),
  },

  // ===== CARDS =====
  card: {
    backgroundColor: '#fffdf9',
    borderRadius: scale(14),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: verticalScale(12),
  },
  cardText: {
    fontSize: scale(16),
    color: '#0a0a0a',
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardSubtext: {
    fontSize: scale(16),
    color: '#7e807d',
    marginLeft: scale(12),
  },

  // ===== CONTENT CARDS =====
  contentCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: scale(25),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  listItem: {
    fontSize: scale(16),
    color: '#0a0a0a',
    lineHeight: scale(24),
    marginBottom: verticalScale(8),
  },

  // ===== INSTRUCTIONS =====
  stepContainer: {
    marginBottom: verticalScale(12),
  },
  stepTitle: {
    fontSize: scale(16),
    fontWeight: '500',
    color: '#0a0a0a',
    marginBottom: verticalScale(4),
  },
  stepDescription: {
    fontSize: scale(16),
    color: '#0a0a0a',
    lineHeight: scale(24),
  },

  // ===== FAMILY STORY =====
  storyCard: {
    backgroundColor: '#fff085',
    borderRadius: scale(25),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  storyText: {
    fontSize: scale(16),
    color: 'rgba(151, 60, 0, 0.9)',
    lineHeight: scale(26),
  },

  // ===== BUTTONS =====
  buttonSection: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(20),
  },
  primaryButton: {
    backgroundColor: '#ffcc7f',
    borderRadius: scale(100),
    paddingVertical: verticalScale(20),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: scale(20),
    fontWeight: '500',
    color: '#7b3306',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: scale(100),
    paddingVertical: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButtonText: {
    fontSize: scale(16),
    fontWeight: '500',
    color: '#7b3306',
    textAlign: 'center',
  },
});
