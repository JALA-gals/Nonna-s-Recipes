import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';

import { startRecording, stopRecording } from '../src/services/audio';
import { transcribeAudio } from '../src/services/whisper';

const { width } = Dimensions.get('window');

export default function TranscriptionPage() {
  const router = useRouter();

  const questions = [
    'What kind of ingredients did you use?',
    'How did you prepare the ingredients?',
    'Where did you get this recipe from?',
    'Share a story about the recipe',
  ];

  // Logic States
  const [isRecording, setIsRecording] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [fullTranscript, setFullTranscript] = React.useState('');
  const [hasRecorded, setHasRecorded] = React.useState(false);

  const [expandedQuestions, setExpandedQuestions] = React.useState<Set<number>>(new Set([0]));

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  async function handleRecordPress() {
    // Prevent multiple recordings
    if (hasRecorded && !isRecording) {
      Alert.alert("Limit Reached", "You can only record once. Please edit the text manually if you need to make changes.");
      return;
    }

    if (isRecording) {
      try {
        const uri = await stopRecording();
        setIsRecording(false);
        if (!uri) {
          setStatus('Hold longer to record');
          return;
        }

        setStatus('Transcribing...');
        const transcript = await transcribeAudio(uri);
        
        setFullTranscript(transcript);
        setHasRecorded(true); // Lock the recording feature
        setStatus('Transcription complete!');
      } catch (e) {
        setIsRecording(false);
        setStatus('Error processing audio');
        console.error(e);
      }
    } else {
      setIsRecording(true);
      setStatus('Recording...');
      await startRecording();
    }
  }

  const handleCopy = async () => {
    await Clipboard.setStringAsync(fullTranscript);
    setStatus('Copied!');
    setTimeout(() => setStatus(''), 2000);
  };

  const resetRecording = () => {
    Alert.alert(
      "Reset Recording",
      "This will delete your current transcript. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          setFullTranscript('');
          setHasRecorded(false);
          setStatus('');
        }}
      ]
    );
  };

  return (
    <View style={styles.fullScreenWrapper}>
      <View style={styles.modalContainer}>
        {/* Header*/}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#7b3306" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transcribe Recipe</Text>
          <TouchableOpacity onPress={handleCopy} disabled={!fullTranscript}>
            <Ionicons name="copy-outline" size={24} color={fullTranscript ? "#7b3306" : "#ccc"} />
          </TouchableOpacity>
        </View>

        {status ? <Text style={styles.status}>{status}</Text> : null}

        {/* Scrollable Content*/}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentCard}>
            <View style={styles.beigeBackground} />

            <View style={styles.questionsContainer}>
              {questions.map((question, index) => (
                <View key={index} style={styles.questionBlock}>
                  <View style={styles.questionRow}>
                    <View
                      style={[
                        styles.questionHighlight,
                        { width: Math.min(question.length * 8, width * 0.7) },
                      ]}
                    />
                    <Text style={styles.questionText}>
                      {index + 1}. {question}
                    </Text>
                  </View>

                  {expandedQuestions.has(index) && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.guideSubText}>Use these prompts to guide your story...</Text>
                      <TouchableOpacity onPress={() => toggleQuestion(index)}>
                        <Text style={styles.toggleText}>Collapse ↑</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {!expandedQuestions.has(index) && (
                    <TouchableOpacity onPress={() => toggleQuestion(index)}>
                      <Text style={styles.toggleText}>Show Prompts ↓</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Functional Transcript Input*/}
              <View style={styles.functionalArea}>
                <View style={styles.cardHeader}>
                  <Text style={styles.label}>Your Transcription</Text>
                  {hasRecorded && (
                    <TouchableOpacity onPress={resetRecording}>
                      <Text style={styles.redoText}>Redo Recording</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  value={fullTranscript}
                  onChangeText={setFullTranscript}
                  placeholder="The story will appear here after your recording..."
                  placeholderTextColor="rgba(123,51,6,0.4)"
                  multiline
                  textAlignVertical="top"
                  style={styles.answerInput}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Recording Indicator*/}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Text style={styles.recordingText}>Recording your recipe story...</Text>
            <Text style={styles.recordingTime}>00:00.00</Text>
            <View style={styles.waveform}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    { height: 10 + Math.random() * 30 },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Bottom Controls*/}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="attach" size={24} color="#7b3306" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
              hasRecorded && !isRecording && styles.recordButtonDisabled
            ]}
            onPress={handleRecordPress}
          >
            {isRecording ? (
              <Ionicons name="stop" size={28} color="#f77777" />
            ) : hasRecorded ? (
                <Ionicons name="checkmark-circle" size={32} color="white" />
            ) : (
              <Svg width={32} height={32} viewBox="0 0 32 32">
                <Rect x="10" y="6" width="12" height="16" rx="6" stroke="white" strokeWidth="2.67" />
                <Path d="M7 16c0 5 4 9 9 9s9-4 9-9" stroke="white" strokeWidth="2.67" strokeLinecap="round" />
                <Path d="M16 25.33V29.33" stroke="white" strokeWidth="2.67" strokeLinecap="round" />
              </Svg>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={() => router.back()}>
            <Ionicons name="download-outline" size={24} color="#7b3306" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenWrapper: { flex: 1, backgroundColor: 'rgb(255, 250, 213)' },
  modalContainer: { flex: 1, backgroundColor: 'rgb(255, 250, 213)' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  closeButton: {
    backgroundColor: '#ffffff',
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  headerTitle: { fontSize: 22, color: '#7b3306', fontWeight: '600' },
  status: { fontSize: 14, color: '#ce7943', textAlign: 'center', fontWeight: 'bold', marginBottom: 8 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 180 },
  contentCard: { position: 'relative', minHeight: 650 },
  beigeBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#EBDCBF',
    borderRadius: 24,
    opacity: 0.5,
  },
  questionsContainer: { padding: 16, gap: 24 },
  questionBlock: { marginBottom: 10 },
  questionRow: { position: 'relative', marginBottom: 8 },
  questionHighlight: {
    position: 'absolute',
    top: 10, left: 0, height: 14,
    backgroundColor: '#FFCC7F',
    opacity: 0.6,
  },
  questionText: { fontSize: 17, color: '#7b3306', fontWeight: '500' },
  answerContainer: { marginTop: 10 },
  guideSubText: { fontSize: 13, color: 'rgba(123,51,6,0.6)', fontStyle: 'italic' },
  
  functionalArea: { marginTop: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '700', color: '#7b3306', opacity: 0.5, textTransform: 'uppercase' },
  redoText: { fontSize: 12, color: '#f77777', fontWeight: '700' },
  
  answerInput: {
    fontSize: 16,
    color: '#7b3306',
    minHeight: 250,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
  },
  toggleText: { fontSize: 12, color: '#ce7943', marginTop: 6 },
  recordingIndicator: {
    position: 'absolute',
    bottom: 110, left: 20, right: 20,
    backgroundColor: '#fffdf9',
    borderRadius: 20, padding: 16,
    alignItems: 'center', elevation: 8,
  },
  recordingText: { fontSize: 14, color: '#7b3306' },
  recordingTime: { fontSize: 12, color: '#f77777', fontWeight: '700' },
  waveform: { flexDirection: 'row', alignItems: 'flex-end', height: 30, gap: 3, marginTop: 8 },
  waveformBar: { width: 4, backgroundColor: '#f77777', borderRadius: 2 },
  bottomControls: {
    position: 'absolute',
    bottom: 30, left: 20, right: 20,
    backgroundColor: '#fffdf9',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25, paddingVertical: 15,
    elevation: 10,
  },
  controlButton: { padding: 5 },
  recordButton: {
    width: 65, height: 65, borderRadius: 35,
    backgroundColor: '#f77777',
    alignItems: 'center', justifyContent: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 4, borderColor: '#7b3306',
  },
  recordButtonDisabled: {
    backgroundColor: '#2ecc71',
  }
});