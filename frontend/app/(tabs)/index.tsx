import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView
} from 'react-native';
import {
  startRecording, stopRecording,
  playRecording, getSavedRecordings, deleteRecording,
  type Recording
} from '../../services/audio';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [status, setStatus] = useState('');

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
    setStatus('Saved!');
    loadRecordings();
  } catch (e) {
    setIsRecording(false);
    setStatus('Hold longer to record');
  }
}
  async function handlePlay(uri: string) {
    setStatus('Playing...');
    await playRecording(uri);
    setStatus('');
  }

  async function handleDelete(uri: string) {
    await deleteRecording(uri);
    loadRecordings();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Record a Recipe</Text>
      <Text style={styles.status}>{status}</Text>

      <TouchableOpacity
        style={[styles.recordBtn, isRecording && styles.recording]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.recordBtnText}>
          {isRecording ? '🔴 Recording...' : '🎙 Hold to Record'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subheader}>Saved Recordings</Text>

      <FlatList
        data={recordings}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemDate}>{item.date}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity onPress={() => handlePlay(item.uri)}>
                <Text style={styles.actionPlay}>▶ Play</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.uri)}>
                <Text style={styles.actionDelete}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
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
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10
  },
  itemDate: { fontSize: 14, color: '#666', marginBottom: 8 },
  itemActions: { flexDirection: 'row', gap: 16 },
  actionPlay: { fontSize: 16, color: '#1a73e8' },
  actionDelete: { fontSize: 16, color: '#e53935' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 24 }
});