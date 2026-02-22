import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TestUploadPage() {
  const [image, setImage] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Pick image
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setDownloadUrl(null);
    }
  };

  // Convert to JPEG (iOS safe)
  async function convertToJpeg(uri: string) {
    const result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 0.9,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return result.uri;
  }

  // Upload image
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Pick an image first");
      return;
    }

    try {
      setUploading(true);

      console.log("Original URI:", image);

      const jpegUri = await convertToJpeg(image);
      console.log("JPEG URI:", jpegUri);

      // Convert to blob (iOS reliable method)
      const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = () => reject(new TypeError("Network request failed"));
        xhr.responseType = "blob";
        xhr.open("GET", jpegUri, true);
        xhr.send(null);
      });

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `testUploads/${Date.now()}.jpg`
      );

      console.log("Uploading...");

      await uploadBytes(storageRef, blob, {
        contentType: "image/jpeg",
      });

      console.log("Upload success!");

      const url = await getDownloadURL(storageRef);
      setDownloadUrl(url);

      Alert.alert("Upload successful!");
    } catch (error: any) {
      console.log("UPLOAD ERROR FULL:", error);
      console.log("ERROR CODE:", error?.code);
      console.log("ERROR MESSAGE:", error?.message);

      Alert.alert("Upload failed", error?.message || "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Firebase Storage Test</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.preview} />
      )}

      <TouchableOpacity
        style={[styles.button, uploading && { opacity: 0.5 }]}
        onPress={uploadImage}
        disabled={uploading}
      >
        <Text style={styles.buttonText}>
          {uploading ? "Uploading..." : "Upload to Firebase"}
        </Text>
      </TouchableOpacity>

      {downloadUrl && (
        <>
          <Text style={styles.success}>Upload Successful!</Text>
          <Text selectable>{downloadUrl}</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  preview: {
    width: 250,
    height: 250,
    marginVertical: 15,
    borderRadius: 12,
  },
  success: {
    marginTop: 20,
    fontWeight: "bold",
    color: "green",
  },
});