import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, Alert, Pressable, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { signUpWithEmail } from "../src/lib/auth"; 
import { Colors } from "@/constants/theme";
import Popup from "@/components/Popup";
import {sendEmailVerification} from "firebase/auth";
import { auth } from "../src/lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
const light = Colors.light;
const { width, height } = Dimensions.get("window");
const handleResend = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "No user is currently logged in.");
      return;
    }

    await sendEmailVerification(user);
    Alert.alert("Verification email sent again!");
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const[popupVisible, setPopupVisible] = useState(false);
  const handleRegister = async () => {
    try {
      const cred = await signUpWithEmail(email, password);
      setPopupVisible(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Registration failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Background Gradient */}
        <LinearGradient
          colors={['#a1c5a8', '#fef9d4']}
          style={styles.gradientBackground}
        />

        {/* Tree Background Overlay */}
        <Image
          source={require('../assets/images/tree-background.jpg')} // UPDATE THIS PATH
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.titleLine1}>Sign Up</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="rgba(10,10,10,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(10,10,10,0.5)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            {/* Sign up Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign Up</Text>
            </TouchableOpacity>
            {/* back to login Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/")}>
                <Text style={styles.signUpLink}>Log in</Text>
              </TouchableOpacity>
            </View>
            <Popup
              visible={popupVisible}
              title="Verification Email Sent"
              message="Please check your email to verify your account."
              onClose={() => {
              setPopupVisible(false);
               router.replace("/");
              }}
              onResend={handleResend}
              />
              </View>
            </View>

      </ScrollView>

    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleLine1: {
    fontSize: Math.min(width * 0.15, 58),
    color: '#7b3306',
    lineHeight: Math.min(width * 0.15, 58) * 1.2,
  },
  titleLine2: {
    fontSize: Math.min(width * 0.165, 65),
    color: '#7b3306',
    lineHeight: Math.min(width * 0.165, 65) * 1.2,
  },
  subtitle: {
    fontSize: Math.min(width * 0.048, 19),
    color: 'rgba(151,60,0,0.8)',
    marginTop: 12,
  },
  formContainer: {
    width: '100%',
    maxWidth: 346,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
    paddingHorizontal: 32,
    paddingVertical: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#7b3306',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButton: {
    backgroundColor: '#ffcc7f',
    borderRadius: 50,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  signInButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  forgotPassword: {
    fontSize: 16,
    color: '#973c00',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: 'rgba(151,60,0,0.8)',
  },
  signUpLink: {
    fontSize: 16,
    color: '#f77777',
    textDecorationLine: 'underline',
  },
});