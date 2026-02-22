import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function AddRecipePage() {
  const router = useRouter();

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

        {/* Voice Input*/}
        <View style={styles.inputMethodsCard}>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() => router.push('/transcription')}
          >
            <Ionicons name="mic" size={40} color="#ffffff" />
            <Text style={styles.buttonText}>Recipe Input</Text>
          </TouchableOpacity>
        </View>

        {/* Convert Recipe Button */}
        <View style={styles.convertButtonContainer}>
          <TouchableOpacity
            style={styles.convertButton}
            onPress={handleConvert}
          >
            <Text style={styles.convertButtonText}>Convert Recipe</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Name</Text>
          <TextInput
            placeholder="ex: Nona's Secret Linguine"
            placeholderTextColor="rgba(10,10,10,0.5)"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <TextInput
            placeholder="List your ingredients..."
            placeholderTextColor="rgba(10,10,10,0.5)"
            multiline
            numberOfLines={7}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publish Recipe</Text>
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
  headerTitle: { fontSize: 24, color: '#7b3306', fontWeight: 'bold' },
  headerSpacer: { width: 40 },
  inputMethodsCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 24,
    padding: 12,
    marginBottom: 24,
    elevation: 10,
    alignItems: 'center',
  },
  voiceButton: {
    backgroundColor: '#f77777',
    borderRadius: 24,
    height: 120,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { fontSize: 16, color: '#ffffff', fontWeight: '600' },
  convertButtonContainer: { alignItems: 'center', marginBottom: 32 },
  convertButton: { backgroundColor: '#ffcc7f', borderRadius: 100, paddingHorizontal: 32, paddingVertical: 16 },
  convertButtonText: { fontSize: 20, color: '#7b3306' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 24, color: '#7b3306', marginBottom: 12 },
  input: {
    backgroundColor: '#fffdf9',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  textArea: { minHeight: 140, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 24 },
  actionButtons: { gap: 12, marginBottom: 32 },
  publishButton: { backgroundColor: '#ffcc7f', borderRadius: 100, paddingVertical: 20, alignItems: 'center' },
  publishButtonText: { fontSize: 20, color: '#7b3306' },
});