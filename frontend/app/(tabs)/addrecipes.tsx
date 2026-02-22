import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {createTestRecipe} from '../../src/services/createRecipeWithGeo';
const { width } = Dimensions.get('window');

export default function AddRecipePage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Form States
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ancestryName, setAncestryName] = useState('');
  const [originLocation, setOriginLocation] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [familyStory, setFamilyStory] = useState('');
  const [photo, setPhoto]=useState<string | null>(null);
  // Image picker
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access photos is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };
  //convert image
  async function convertToJpeg(uri: string) {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  }

  // Image upload helper
  async function uploadImageAsync(uri: string) {
    try {
      console.log("Uploading image from:", uri);

      const jpegUri = await convertToJpeg(uri);

      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError("Network request failed"));
        xhr.responseType = "blob";
        xhr.open("GET", jpegUri, true);
        xhr.send(null);
      });

      const storage = getStorage();
      const storageRef = ref(storage, `recipePhotos/${Date.now()}.jpg`);

      await uploadBytes(storageRef, blob);


      const downloadUrl = await getDownloadURL(storageRef);

      return downloadUrl;
    } catch (err: any) {
      console.log("UPLOAD ERROR FULL:", err);
      throw err;
    }
  }


  // saving to the database
  const handleSave = async () => {
  try {
    let uploadedImageUrl = null;

    if (photo) {
      uploadedImageUrl = await uploadImageAsync(photo);
    }

    const { id, coords } = await createTestRecipe({
      title: recipeName,
      place: originLocation,
      countryCode: "US",
      photoUrl: uploadedImageUrl,
      ingredients: ingredients.split('\n').map(line => {
        const [amount, ...itemParts] = line.trim().split(' ');
        return {
          item: itemParts.join(' '),
          amount,
          preparation: '',
          note: '',
        };
      }),
      steps: instructions.split('\n').map((line, index) => ({
        step: index + 1,
        instruction: line.trim(),
        tip: '',
        note: '',
      })),
      story: familyStory,
      storyteller: ancestryName,
      creationDate,
    });

    Alert.alert(
      coords ? "Created recipe + pinned!" : "Created recipe (no pin)",
      coords
        ? `Pinned at ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
        : "Couldn’t find coordinates."
    );
  } catch (e: any) {
    Alert.alert("Save failed", e.message);
  }
};


  // Auto-fill logic from Gemini transcription
  useEffect(() => {
    if (params.recipeData && params.autoFill === 'true') {
      try {
        const data = JSON.parse(params.recipeData as string);
        
        if (data.title) setRecipeName(data.title);
        
        if (data.ingredients) {
          const ingString = Array.isArray(data.ingredients)
            ? data.ingredients.map((i: any) => `${i.amount || ''} ${i.item || ''}`).join('\n')
            : data.ingredients;
          setIngredients(ingString);
        }

        if (data.steps) {
          const stepString = Array.isArray(data.steps)
            ? data.steps.map((s: any) => typeof s === 'string' ? s : s.instruction).join('\n')
            : data.steps;
          setInstructions(stepString);
        }

        if (data.cultural_background) setOriginLocation(data.cultural_background);
        if (data.memory) setFamilyStory(data.memory);

      } catch (e) {
        console.error("Failed to parse auto-fill data", e);
      }
    }
  }, [params.recipeData]);

  const handleConvert = () => {
    console.log("Convert function triggered");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgb(221, 247, 228)', 'rgb(255, 250, 213)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#7b3306" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Recipe</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Centered Voice Input Method */}
        <View style={styles.inputMethodsCard}>
          <TouchableOpacity 
            style={styles.voiceButton} 
            onPress={() => router.push('/transcription')}
          >
            <Ionicons name="mic" size={40} color="#ffffff" />
            <Text style={styles.buttonText}>Voice Input (Easy Fill)</Text>
          </TouchableOpacity>
        </View>

        {/* Convert Recipe Button */}
        <View style={styles.convertButtonContainer}>
          <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
            <Text style={styles.convertButtonText}>Convert Recipe</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Photo</Text>

          <TouchableOpacity style={styles.photoPlaceholder} onPress={pickImage}>
            {photo ? (
              <Image
                source={{ uri: photo }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <>
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={32} color="#7b3306" />
                </View>
                <Text style={styles.photoTitle}>Add Photo</Text>
                <Text style={styles.photoSubtitle}>
                  Tap to upload or take a picture
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>


        {/* Recipe Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Name</Text>
          <TextInput
            placeholder="ex: Nona's Secret Linguine"
            placeholderTextColor="rgba(10,10,10,0.5)"
            value={recipeName}
            onChangeText={setRecipeName}
            style={styles.input}
          />
        </View>

        {/* Recipe Ancestry */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Ancestry</Text>
          
          <View style={styles.ancestryCard}>
            <Text style={styles.ancestryLabel}>Original Recipe From</Text>
            <View style={styles.ancestryInputRow}>
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Circle cx="10" cy="7" r="3" stroke="#FF3636" strokeWidth="1.67" />
                <Path d="M5 16c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="#FF3636" strokeWidth="1.67" />
              </Svg>
              <TextInput
                placeholder="ex: Grandmother Maria"
                placeholderTextColor="#7e807d"
                value={ancestryName}
                onChangeText={setAncestryName}
                style={styles.ancestryInput}
              />
            </View>
          </View>

          <View style={styles.ancestryCard}>
            <Text style={[styles.ancestryLabel, { color: '#193cb8' }]}>Origin Location</Text>
            <View style={styles.ancestryInputRow}>
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path d="M10 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" stroke="#1447E6" strokeWidth="1.67" />
                <Path d="M10 2c-3.3 0-6 2.7-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z" stroke="#1447E6" strokeWidth="1.67" />
              </Svg>
              <TextInput
                placeholder="ex: Sicily, Italy"
                placeholderTextColor="#7e807d"
                value={originLocation}
                onChangeText={setOriginLocation}
                style={styles.ancestryInput}
              />
            </View>
          </View>

          <View style={[styles.ancestryCard, { backgroundColor: '#f7f9f2' }]}>
            <Text style={[styles.ancestryLabel, { color: '#016630' }]}>Estimated Date</Text>
            <View style={styles.ancestryInputRow}>
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Rect x="3" y="4" width="14" height="14" rx="2" stroke="#008236" strokeWidth="1.67" />
                <Path d="M14 2v4M6 2v4M3 8h14" stroke="#008236" strokeWidth="1.67" />
              </Svg>
              <TextInput
                placeholder="ex: 1978-1983"
                placeholderTextColor="#7e807d"
                value={creationDate}
                onChangeText={setCreationDate}
                style={styles.ancestryInput}
              />
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <TextInput
            placeholder="List your ingredients..."
            placeholderTextColor="rgba(10,10,10,0.5)"
            multiline
            value={ingredients}
            onChangeText={setIngredients}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <TextInput
            placeholder="Describe the cooking steps..."
            placeholderTextColor="rgba(10,10,10,0.5)"
            multiline
            value={instructions}
            onChangeText={setInstructions}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        {/* Family Story */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Family Story</Text>
          <LinearGradient
            colors={['rgba(255, 240, 133, 0.7)', 'rgba(254, 230, 133, 0.7)']}
            style={styles.familyStoryCard}
          >
            <TextInput
              placeholder="Share the story behind this recipe..."
              placeholderTextColor="rgba(151,60,0,0.6)"
              multiline
              value={familyStory}
              onChangeText={setFamilyStory}
              textAlignVertical="top"
              style={styles.familyStoryInput}
            />
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.publishButton} onPress={handleSave}>
            <Text style={styles.publishButtonText}>Publish Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.draftButton}>
            <Text style={styles.draftButtonText}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  scrollView: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 96,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backButton: {
    backgroundColor: '#ffaeae',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  headerTitle: { fontSize: 24, color: '#7b3306', fontWeight: '400' },
  headerSpacer: { width: 40 },
  inputMethodsCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    alignItems: 'center', // Centers the content horizontally
  },
  voiceButton: {
    width: '100%', // Button takes full width of parent card padding
    backgroundColor: '#f77777',
    borderRadius: 24,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 8,
  },
  buttonText: { fontSize: 16, color: '#ffffff', fontWeight: '600' },
  convertButtonContainer: { alignItems: 'center', marginBottom: 32 },
  convertButton: {
    backgroundColor: '#ffcc7f',
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 16,
    elevation: 8,
  },
  convertButtonText: { fontSize: 20, color: '#7b3306', fontWeight: '400' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 24, color: '#7b3306', marginBottom: 12, fontWeight: '400' },
  photoPlaceholder: {
    backgroundColor: '#fffdf9',
    borderRadius: 12,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    elevation: 5,
  },
  cameraIconContainer: {
    backgroundColor: '#ffcc7f',
    borderRadius: 100,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoTitle: { fontSize: 16, color: '#7b3306', fontWeight: '400' },
  photoSubtitle: { fontSize: 14, color: 'rgba(151,60,0,0.7)', textAlign: 'center', paddingHorizontal: 16 },
  input: {
    backgroundColor: '#fffdf9',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
    elevation: 5,
  },
  textArea: { minHeight: 140, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 24 },
  ancestryCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    elevation: 5,
  },
  ancestryLabel: { fontSize: 14, color: '#ff3636', marginBottom: 8, fontWeight: '400' },
  ancestryInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ancestryInput: { flex: 1, fontSize: 16, color: '#000000', padding: 0 },
  familyStoryCard: { borderRadius: 24, padding: 20, minHeight: 143, elevation: 5 },
  familyStoryInput: { fontSize: 16, color: 'rgba(151,60,0,0.6)', lineHeight: 24, padding: 0 },
  actionButtons: { gap: 12, marginBottom: 32 },
  publishButton: { backgroundColor: '#ffcc7f', borderRadius: 100, paddingVertical: 20, alignItems: 'center', elevation: 10 },
  publishButtonText: { fontSize: 20, color: '#7b3306', fontWeight: '400' },
  draftButton: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 100, paddingVertical: 16, alignItems: 'center', elevation: 5 },
  draftButtonText: { fontSize: 16, color: '#7b3306', fontWeight: '400' },
});