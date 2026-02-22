import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../../components/CustomTabBar";
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false} } tabBar={(props)=><CustomTabBar{ ... props}/>}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="recording" options={{ title: "Record" }} />
      <Tabs.Screen name="App" options={{ title: "Explore" }} />
    </Tabs>
  );
}