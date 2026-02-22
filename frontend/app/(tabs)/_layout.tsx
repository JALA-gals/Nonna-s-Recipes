import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../../components/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="homepage" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="addrecipes" options={{ title: "Add" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="UserRecipes" options={{ title: "Me" }} />

      {/* Hide everything else in (tabs) so it won’t appear */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="recording" options={{ href: null }} />
      <Tabs.Screen name="MyRecipe" options={{ href: null }} />
      <Tabs.Screen name="settings-test" options={{ href: null }} />
      <Tabs.Screen name="test-upload" options={{ href: null }} />
    </Tabs>
  );
}