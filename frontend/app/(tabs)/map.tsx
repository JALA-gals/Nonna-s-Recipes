import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout, Region } from "react-native-maps";
import { useRouter } from "expo-router";

import {
  subscribeToRecipes,
  updateRecipeOriginCoords,
} from "@/src/services/recipes";
import { geocodePlace } from "@/src/services/geocode";

type Recipe = {
  id: string;
  title?: string;
  origin?: {
    name?: string;
    countryCode?: string;
    lat?: number | null;
    lng?: number | null;
  };
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const attempted = useRef<Set<string>>(new Set());
  const running = useRef(false);

  useEffect(() => {
    const unsub = subscribeToRecipes((rows) => {
      setRecipes(rows as Recipe[]);
      setLoading(false);
    });
    return unsub;
  }, []);

  const pinned = useMemo(() => {
    return recipes.filter((r) => {
      const lat = r.origin?.lat;
      const lng = r.origin?.lng;
      return typeof lat === "number" && typeof lng === "number";
    });
  }, [recipes]);

  const missing = useMemo(() => {
    return recipes.filter((r) => {
      const lat = r.origin?.lat;
      const lng = r.origin?.lng;
      const hasCoords = typeof lat === "number" && typeof lng === "number";
      const hasText = !!r.origin?.name && !!r.origin?.countryCode;
      return !hasCoords && hasText;
    });
  }, [recipes]);

  // Auto-geocode missing coords
  useEffect(() => {
    if (running.current) return;
    if (missing.length === 0) return;

    running.current = true;

    (async () => {
      for (const r of missing) {
        if (attempted.current.has(r.id)) continue;
        attempted.current.add(r.id);

        const place = r.origin?.name?.trim() ?? "";
        const cc = r.origin?.countryCode?.trim().toUpperCase() ?? "";

        try {
          const coords = await geocodePlace(place, cc);
          if (coords) {
            await updateRecipeOriginCoords(r.id, coords.lat, coords.lng);
          }
        } catch (e) {
          console.log("Geocode error:", e);
        }

        await sleep(900);
      }

      running.current = false;
    })();
  }, [missing]);

  const initialRegion: Region = {
    latitude: 20,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 100,
  };

  // Auto-fit map to all pinned locations
  useEffect(() => {
    if (pinned.length === 0) return;

    const coords = pinned.map((r) => ({
      latitude: r.origin!.lat as number,
      longitude: r.origin!.lng as number,
    }));

    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  }, [pinned.length]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading recipes…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={initialRegion}>
        {pinned.map((r) => {
          const label = r.origin?.name ?? "Unknown";
          const cc = r.origin?.countryCode ? `, ${r.origin.countryCode}` : "";

          return (
            <Marker
              key={r.id}
              coordinate={{
                latitude: r.origin!.lat as number,
                longitude: r.origin!.lng as number,
              }}
            >
              <Callout
                onPress={() => {
                  router.push(`/recipe/${r.id}`);
                }}
              >
                <View style={{ maxWidth: 220 }}>
                  <Text style={{ fontWeight: "700" }}>
                    {r.title ?? "Recipe"}
                  </Text>
                  <Text>{label + cc}</Text>
                  <Text style={{ marginTop: 6, opacity: 0.6 }}>
                    Tap to open
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});