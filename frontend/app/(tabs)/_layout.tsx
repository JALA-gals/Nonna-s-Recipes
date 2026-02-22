import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="recording" options={{ title: "Record" }} />
      <Tabs.Screen name="settings-test" options={{ title: "Settings" }} />
    </Tabs>
  );
}