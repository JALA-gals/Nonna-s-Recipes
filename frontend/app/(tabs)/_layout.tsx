import React from "react";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "Add Recipe",
        }}
      />

      {/* Optional: keep the starter explore tab if you want */}
      {/* <Tabs.Screen name="explore" options={{ title: "Explore" }} /> */}
    </Tabs>
  );
}