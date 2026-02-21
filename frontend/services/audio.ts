import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recordingInstance: Audio.Recording | null = null;

export async function startRecording(): Promise<void> {
  // force cleanup of any lingering recording
  if (recordingInstance) {
    try {
      await recordingInstance.stopAndUnloadAsync();
    } catch (e) {}
    recordingInstance = null;
  }

  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  // use createAsync instead of new Audio.Recording()
  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  recordingInstance = recording;
}

export async function stopRecording(): Promise<string> {
  if (!recordingInstance) throw new Error('No recording in progress');

  await recordingInstance.stopAndUnloadAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

  const tempUri = recordingInstance.getURI();
  if (!tempUri) throw new Error('Failed to get recording URI');

  const docDir = FileSystem.documentDirectory;
  if (!docDir) throw new Error('No document directory available');

  const fileName = `recording_${Date.now()}.m4a`;
  const permanentUri = docDir + fileName;
  await FileSystem.copyAsync({ from: tempUri, to: permanentUri });

  recordingInstance = null;
  return permanentUri;
}

export async function playRecording(uri: string): Promise<void> {
  const { sound } = await Audio.Sound.createAsync({ uri });
  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
    }
  });
}

export interface Recording {
  name: string;
  uri: string;
  date: string;
}

export async function getSavedRecordings(): Promise<Recording[]> {
  const docDir = FileSystem.documentDirectory;
  if (!docDir) return [];

  const files = await FileSystem.readDirectoryAsync(docDir);
  return files
    .filter(f => f.endsWith('.m4a'))
    .map(f => ({
      name: f,
      uri: docDir + f,
      date: new Date(parseInt(f.replace('recording_', '').replace('.m4a', ''))).toLocaleString()
    }))
    .sort((a, b) => b.name.localeCompare(a.name));
}

export async function deleteRecording(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri);
}