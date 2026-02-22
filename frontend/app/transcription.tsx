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
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function TranscriptionPage() {
  const router = useRouter();

  const questions = [
    'What kind of ingredients did you use?',
    'How did you prepare the ingredients?',
    'Where did you get this recipe from?',
    'Share a story about the recipe',
  ];

  const [expandedQuestions, setExpandedQuestions] = React.useState<Set<number>>(
    new Set([0])
  );
  const [responses, setResponses] = React.useState<{ [key: number]: string }>({});
  const [isRecording, setIsRecording] = React.useState(false);
  const [activeQuestion, setActiveQuestion] = React.useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <View style={styles.fullScreenWrapper}>
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#7b3306" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transcribe Recipe</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scrollable Content */}
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
                      <TextInput
                        value={responses[index] || ''}
                        onChangeText={(text) =>
                          setResponses({ ...responses, [index]: text })
                        }
                        onFocus={() => setActiveQuestion(index)}
                        placeholder={`Type or record your answer...`}
                        placeholderTextColor="rgba(123,51,6,0.4)"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        style={styles.answerInput}
                      />
                      <TouchableOpacity onPress={() => toggleQuestion(index)}>
                        <Text style={styles.toggleText}>Collapse Response ↑</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {!expandedQuestions.has(index) && (
                    <TouchableOpacity onPress={() => toggleQuestion(index)}>
                      <Text style={styles.toggleText}>Review Response ↓</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Recording Indicator */}
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Text style={styles.recordingText}>
              Recording for Question {(activeQuestion ?? 0) + 1}
            </Text>
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

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="attach" size={24} color="#7b3306" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive,
            ]}
            onPress={() => setIsRecording(!isRecording)}
          >
            {isRecording ? (
              <Ionicons name="stop" size={28} color="#f77777" />
            ) : (
              <Svg width={32} height={32} viewBox="0 0 32 32">
                <Rect
                  x="10"
                  y="6"
                  width="12"
                  height="16"
                  rx="6"
                  stroke="white"
                  strokeWidth="2.67"
                />
                <Path
                  d="M7 16c0 5 4 9 9 9s9-4 9-9"
                  stroke="white"
                  strokeWidth="2.67"
                  strokeLinecap="round"
                />
                <Path
                  d="M16 25.33V29.33"
                  stroke="white"
                  strokeWidth="2.67"
                  strokeLinecap="round"
                />
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
  fullScreenWrapper: {
    flex: 1,
    backgroundColor: 'rgb(255, 250, 213)',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgb(255, 250, 213)',
  },
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
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    color: '#7b3306',
    fontWeight: '600',
  },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 180,
  },
  contentCard: { position: 'relative', minHeight: 500 },
  beigeBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EBDCBF',
    borderRadius: 24,
    opacity: 0.5,
  },
  questionsContainer: { padding: 16, gap: 24 },
  questionBlock: { marginBottom: 10 },
  questionRow: { position: 'relative', marginBottom: 8 },
  questionHighlight: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: 14,
    backgroundColor: '#FFCC7F',
    opacity: 0.6,
  },
  questionText: {
    fontSize: 17,
    color: '#7b3306',
    fontWeight: '500',
  },
  answerContainer: { marginTop: 10 },
  answerInput: {
    fontSize: 16,
    color: '#7b3306',
    minHeight: 120,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
  },
  toggleText: { fontSize: 12, color: '#ce7943', marginTop: 6 },
  recordingIndicator: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    backgroundColor: '#fffdf9',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    elevation: 8,
  },
  recordingText: { fontSize: 14, color: '#7b3306' },
  recordingTime: { fontSize: 12, color: '#f77777', fontWeight: '700' },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    gap: 3,
    marginTop: 8,
  },
  waveformBar: { width: 4, backgroundColor: '#f77777', borderRadius: 2 },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#fffdf9',
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 15,
    elevation: 10,
  },
  controlButton: { padding: 5 },
  recordButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#f77777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#7b3306',
  },
});