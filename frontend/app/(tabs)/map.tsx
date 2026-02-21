import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Callout, Region } from "react-native-maps";
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Track which recipe IDs we've attempted to geocode this session
  const attempted = useRef<Set<string>>(new Set());
  const running = useRef(false);

  useEffect(() => {
    const unsub = subscribeToRecipes((rows) => {
      console.log("MAP RECEIVED RECIPES:", rows.length);
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

  useEffect(() => {
    if (running.current) return;
    if (missing.length === 0) return;

    running.current = true;

    (async () => {
      console.log("MISSING COORDS COUNT:", missing.length);

      for (const r of missing) {
        if (attempted.current.has(r.id)) continue;
        attempted.current.add(r.id);

        const place = r.origin?.name?.trim() ?? "";
        const cc = r.origin?.countryCode?.trim().toUpperCase() ?? "";

        console.log("AUTO-GEOCODING:", r.id, place, cc);

        try {
          const coords = await geocodePlace(place, cc);
          console.log("AUTO-GEOCODE RESULT:", r.id, coords);

          if (coords) {
            await updateRecipeOriginCoords(r.id, coords.lat, coords.lng);
            console.log("WROTE COORDS TO FIRESTORE:", r.id);
          } else {
            console.log("NO COORDS FOUND:", r.id, place, cc);
          }
        } catch (e) {
          console.log("AUTO-GEOCODE / UPDATE ERROR:", r.id, e);
        }

        // Nominatim rate-limit friendly: space out requests
        await sleep(900);
      }

      running.current = false;
    })();
  }, [missing]);

  const initialRegion: Region = useMemo(() => {
    const first = pinned[0];
    if (first?.origin?.lat && first?.origin?.lng) {
      return {
        latitude: first.origin.lat,
        longitude: first.origin.lng,
        latitudeDelta: 20,
        longitudeDelta: 20,
      };
    }
    return {
      latitude: 39.5,
      longitude: -98.35,
      latitudeDelta: 50,
      longitudeDelta: 50,
    };
  }, [pinned]);

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
      <MapView style={styles.map} initialRegion={initialRegion}>
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
              <Callout>
                <View style={{ maxWidth: 220 }}>
                  <Text style={{ fontWeight: "700" }}>{r.title ?? "Recipe"}</Text>
                  <Text>{label + cc}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pinned: {pinned.length} • Missing: {missing.length} • Total: {recipes.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  footerText: { textAlign: "center" },
});