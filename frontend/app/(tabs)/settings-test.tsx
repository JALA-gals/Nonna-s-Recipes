import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import SettingsModal from "../../components/settings-modal";

export default function SettingsTestScreen() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Modal Test</Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={styles.openButton}
      >
        <Text style={styles.openButtonText}>Open Settings</Text>
      </Pressable>

      <SettingsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onPressLogOut={() => {
          console.log("Logout pressed");
          setOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef4ea",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  openButton: {
    backgroundColor: "#D4824A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  openButtonText: {
    color: "white",
    fontWeight: "600",
  },
});