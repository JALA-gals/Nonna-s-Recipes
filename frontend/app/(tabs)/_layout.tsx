import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="recording"
        options={{
          title: "Recording",
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Add Recipe",
        }}
      />

       <Tabs.Screen
        name="addrecipes"
        options={{
          title: "REAL Add Recipe",
        }}
      />

    </Tabs>
  );
}

