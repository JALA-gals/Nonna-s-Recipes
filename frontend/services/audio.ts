import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

let recordingInstance: Audio.Recording | null = null;
let recordingStartTime: number = 0;
let currentSound: Audio.Sound | null = null;

export async function startRecording(): Promise<void> {
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

  const { recording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  recordingInstance = recording;
  recordingStartTime = Date.now();
}

export async function stopRecording(): Promise<string | null> {
  if (!recordingInstance) throw new Error('No recording in progress');

  const duration = Date.now() - recordingStartTime;

  await recordingInstance.stopAndUnloadAsync();
  
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });

  if (duration < 1500) {
    recordingInstance = null;
    return null;
  }

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
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });
  
  if (currentSound) {
    try {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
    } catch (e) {}
    currentSound = null;
  }

  const { sound } = await Audio.Sound.createAsync({ uri });
  currentSound = sound;
  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isLoaded && status.didJustFinish) {
      sound.unloadAsync();
      currentSound = null;
    }
  });
}

export async function pauseRecording(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.pauseAsync();
    } catch (e) {}
  }
}

export async function resumeRecording(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.playAsync();
    } catch (e) {}
  }
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
    .filter(f =>
      f.startsWith('recording_') && (
        f.endsWith('.m4a') ||
        f.endsWith('.mp3') ||
        f.endsWith('.wav') ||
        f.endsWith('.mp4') ||
        f.endsWith('.aac')
      )
    )
    .map(f => ({
      name: f,
      uri: docDir + f,
      date: new Date(parseInt(f.replace('recording_', '').replace(/\.\w+$/, ''))).toLocaleString()
    }))
    .sort((a, b) => b.name.localeCompare(a.name));
}

export async function deleteRecording(uri: string): Promise<void> {
  await FileSystem.deleteAsync(uri);
}