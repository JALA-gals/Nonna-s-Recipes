import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface Props {
  emoji: string;
  label: string;
  bgColor: string;
}

export default function RegionButton({
  emoji,
  label,
  bgColor,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
    >
      <Text style={styles.text}>
        {emoji} {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    margin: 4,
  },
  text: {
    fontSize: 15,
    color: "#7b3306",
  },
});