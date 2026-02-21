import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView
} from 'react-native';
import {
  startRecording, stopRecording,
  playRecording, pauseRecording, resumeRecording,
  getSavedRecordings, deleteRecording,
  type Recording
} from '../../services/audio';
import { transcribeAudio } from '../../services/whisper';
import { structureRecipe } from '../../services/gemini';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [status, setStatus] = useState('');
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});
  const [recipes, setRecipes] = useState<Record<string, any>>({});
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [submittingUri, setSubmittingUri] = useState<string | null>(null);

  useEffect(() => {
    loadRecordings();
  }, []);

  async function loadRecordings() {
    const saved = await getSavedRecordings();
    setRecordings(saved);
  }

  async function handlePressIn() {
    setIsRecording(true);
    setStatus('Recording...');
    await startRecording();
  }

  async function handlePressOut() {
    try {
      const uri = await stopRecording();
      setIsRecording(false);
      if (uri === null) {
        setStatus('Hold longer to record');
      } else {
        setStatus('Saved!');
        loadRecordings();
      }
    } catch (e) {
      setIsRecording(false);
      setStatus('Something went wrong, try again');
      console.log(e);
    }
  }

  async function handlePlay(uri: string) {
    if (playingUri === uri) {
      await pauseRecording();
      setPlayingUri(null);
    } else {
      await playRecording(uri);
      setPlayingUri(uri);
    }
  }

  async function handleSubmit(uri: string) {
    try {
      setSubmittingUri(uri);
      setStatus('Transcribing...');
      const transcript = await transcribeAudio(uri);

      setStatus('Structuring recipe...');
      const recipe = await structureRecipe(transcript);

      setTranscripts(prev => ({ ...prev, [uri]: transcript }));
      setRecipes(prev => ({ ...prev, [uri]: recipe }));
      setStatus('Done!');
    } catch (e) {
      setStatus('Something went wrong');
      console.log(e);
    } finally {
      setSubmittingUri(null);
    }
  }

  async function handleDelete(uri: string) {
    await deleteRecording(uri);
    setTranscripts(prev => {
      const updated = { ...prev };
      delete updated[uri];
      return updated;
    });
    setRecipes(prev => {
      const updated = { ...prev };
      delete updated[uri];
      return updated;
    });
    loadRecordings();
  }
  async function handleUpload() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      const extension = file.name.split('.').pop() || 'm4a';
      const fileName = `recording_${Date.now()}.${extension}`;
      const docDir = FileSystem.documentDirectory;
      if (!docDir) return;

      const permanentUri = docDir + fileName;
      await FileSystem.copyAsync({ from: file.uri, to: permanentUri });

      setStatus('File uploaded!');
      loadRecordings();
    } catch (e) {
      setStatus('Upload failed');
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🍝 Record a Recipe</Text>
      <Text style={styles.status}>{status}</Text>

      <TouchableOpacity
        style={[styles.recordBtn, isRecording && styles.recording]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.recordBtnText}>
          {isRecording ? '🔴  Recording...' : '🎙  Hold to Record'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Text style={styles.uploadBtnText}>📁 Upload Audio File</Text>
      </TouchableOpacity>

      <Text style={styles.subheader}>Saved Recordings</Text>

      <FlatList
        data={recordings}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemDate}>{item.date}</Text>

            <View style={styles.playerRow}>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => handlePlay(item.uri)}
              >
                <Text style={styles.playBtnText}>
                  {playingUri === item.uri ? '⏸' : '▶'}
                </Text>
              </TouchableOpacity>

              <View style={styles.waveform}>
                {Array.from({ length: 50 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      { height: Math.random() * 24 + 8 },
                      playingUri === item.uri && styles.barActive
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity onPress={() => handleDelete(item.uri)}>
                <Text style={styles.deleteBtn}>🗑</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, submittingUri === item.uri && styles.submitBtnLoading]}
              onPress={() => handleSubmit(item.uri)}
              disabled={submittingUri === item.uri}
            >
              <Text style={styles.submitBtnText}>
                {submittingUri === item.uri ? 'Processing...' : '✨ Submit Recipe'}
              </Text>
            </TouchableOpacity>

            {/* Transcript */}
            {transcripts[item.uri] ? (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>Transcript</Text>
                <Text style={styles.transcriptText}>{transcripts[item.uri]}</Text>
              </View>
            ) : null}

            {/* Structured Recipe */}
            {recipes[item.uri] ? (
              <View style={styles.recipeBox}>
                <Text style={styles.recipeTitle}>{recipes[item.uri].title}</Text>

                {recipes[item.uri].memory ? (
                  <Text style={styles.recipeMemory}>💭 {recipes[item.uri].memory}</Text>
                ) : null}

                {recipes[item.uri].cultural_background ? (
                  <Text style={styles.recipeCulture}>🌍 {recipes[item.uri].cultural_background}</Text>
                ) : null}

                <Text style={styles.recipeSection}>Ingredients</Text>
                {recipes[item.uri].ingredients?.map((ing: any, i: number) => (
                  <View key={i} style={styles.ingredientRow}>
                    <Text style={styles.ingredientText}>• {ing.amount} {ing.item}</Text>
                    {ing.note ? <Text style={styles.ingredientNote}>{ing.note}</Text> : null}
                  </View>
                ))}

                <Text style={styles.recipeSection}>Steps</Text>
                {recipes[item.uri].steps?.map((s: any, i: number) => (
                  <View key={i} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{s.step}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepText}>{s.instruction}</Text>
                      {s.tip ? <Text style={styles.stepTip}>💬 "{s.tip}"</Text> : null}
                    </View>
                  </View>
                ))}

                {recipes[item.uri].flexibility_notes ? (
                  <Text style={styles.flexNote}>📝 {recipes[item.uri].flexibility_notes}</Text>
                ) : null}
              </View>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No recordings yet</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  subheader: { fontSize: 18, fontWeight: '600', marginTop: 32, marginBottom: 12 },
  status: { fontSize: 14, color: '#666', marginBottom: 16 },
  recordBtn: {
    backgroundColor: '#1a73e8',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center'
  },
  recording: { backgroundColor: '#e53935' },
  recordBtnText: { color: 'white', fontSize: 18, fontWeight: '600' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemDate: { fontSize: 12, color: '#888', marginBottom: 12 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnText: { fontSize: 16 },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 40,
  },
  uploadBtn: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadBtnText: { fontSize: 16, color: '#333' },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  barActive: { backgroundColor: '#1a73e8' },
  deleteBtn: { fontSize: 20 },
  submitBtn: {
    backgroundColor: '#1a73e8',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnLoading: { backgroundColor: '#888' },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  transcriptBox: {
    marginTop: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
  },
  transcriptLabel: { fontSize: 11, color: '#888', marginBottom: 4 },
  transcriptText: { fontSize: 14, color: '#333', fontStyle: 'italic', lineHeight: 20 },
  recipeBox: {
    marginTop: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  recipeTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  recipeMemory: { fontSize: 13, color: '#888', fontStyle: 'italic', marginBottom: 4 },
  recipeCulture: { fontSize: 13, color: '#888', marginBottom: 12 },
  recipeSection: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  ingredientRow: { marginBottom: 4 },
  ingredientText: { fontSize: 14, color: '#333' },
  ingredientNote: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a73e8',
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  stepText: { fontSize: 14, color: '#333', flex: 1 },
  stepTip: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 2 },
  flexNote: { fontSize: 13, color: '#666', marginTop: 12, fontStyle: 'italic' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 24 }
});