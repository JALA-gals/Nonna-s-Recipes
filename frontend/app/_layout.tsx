import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(transcription)" options={{
          presentation: 'modal',
          headerTitle: "Voice Transcription",
          headerBackTitle: '',
          headerTintColor: '#7b3306',
          headerStyle: {
          backgroundColor: 'rgb(255, 250, 213)',
          },
        }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
