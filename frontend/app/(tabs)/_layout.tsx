import React, { useEffect, useState } from "react";
import { Tabs, Redirect } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../src/lib/firebase";

export default function TabLayout() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  if (!ready) return null;

  // If not logged in, force back to login screen
  if (!user) return <Redirect href="/" />;

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="add" options={{ title: "Add Recipe" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="settings-test" options={{ title: "Settings Test" }} />

    </Tabs>
  );
}