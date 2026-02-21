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
import { transcribeAudio } from '../../services/whisper';

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [status, setStatus] = useState('');
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});
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
    setPlayingUri(uri);
    await playRecording(uri);
    setPlayingUri(null);
  }

  async function handleSubmit(uri: string) {
    try {
      setSubmittingUri(uri);
      setStatus('Transcribing...');
      const result = await transcribeAudio(uri);
      setTranscripts(prev => ({ ...prev, [uri]: result }));
      setStatus('Done!');
      console.log('Transcript:', result);
    } catch (e) {
      setStatus('Transcription failed');
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
    loadRecordings();
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
                {submittingUri === item.uri ? 'Transcribing...' : '✨ Submit Recipe'}
              </Text>
            </TouchableOpacity>

            {transcripts[item.uri] ? (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>Transcript</Text>
                <Text style={styles.transcriptText}>{transcripts[item.uri]}</Text>
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
  transcriptText: { fontSize: 14, color: '#333', lineHeight: 20 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 24 }
});