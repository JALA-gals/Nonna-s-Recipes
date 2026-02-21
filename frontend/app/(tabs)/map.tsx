import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { subscribeToRecipes } from "../../src/services/recipes";

// Only import maps on native platforms
let MapView: any;
let Marker: any;
let Callout: any;

if (Platform.OS !== "web") {
  const maps = require("react-native-maps");
  MapView = maps.default;
  Marker = maps.Marker;
  Callout = maps.Callout;
}

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

export default function MapScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToRecipes((rows) => {
      setRecipes(rows as Recipe[]);
      setLoading(false);
    });
    return unsub;
  }, []);

  const mappable = useMemo(() => {
    return recipes.filter((r) => {
      const lat = r.origin?.lat;
      const lng = r.origin?.lng;
      return typeof lat === "number" && typeof lng === "number";
    });
  }, [recipes]);

  // -------------------------
  // WEB VERSION
  // -------------------------
  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>Oops 😅</Text>
        <Text style={styles.webText}>
          Sorry, the interactive map is only compatible with phones.
        </Text>
        <Text style={styles.webSub}>
          Open this app in Expo Go on your mobile device to explore recipe
          locations.
        </Text>
      </View>
    );
  }

  const initialRegion = useMemo(() => {
    const first = mappable[0];
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
  }, [mappable]);

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
        {mappable.map((r) => (
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
                <Text>
                  {(r.origin?.name ?? "Unknown") +
                    (r.origin?.countryCode ? `, ${r.origin.countryCode}` : "")}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {mappable.length} pinned recipe
          {mappable.length === 1 ? "" : "s"}.
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

  // Web styles
  webContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  webTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
  },
  webText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  webSub: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
});