import { useFonts, GloriaHallelujah_400Regular } from "@expo-google-fonts/gloria-hallelujah";
import * as SplashScreen from "expo-splash-screen";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,

} from "react-native";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/lib/firebase";
import { Colors } from "@/constants/theme";
import { useGoogleAuth } from "../src/hooks/useGoogleAuth";
import {LinearGradient} from "expo-linear-gradient";  
// import{useFonts, JosefinSans_400Regular, JosefinSans_500Medium, JosefinSans_600SemiBold} from "@expo-google-fonts/josefin-sans";
const light = Colors.light;
const{width, height}= Dimensions.get("window");
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[showPassword, setShowPassword] = useState(false);
  //load fonts
  const { signInWithGoogle, isAuthenticating, errorMessage } = useGoogleAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("AUTH STATE:", user ? user.uid : "signed out");

      if (user&& user.emailVerified) {
        router.push("/(tabs)")
      } else {
        setCheckingAuth(false);
      }
    });

    return unsub;
  }, [router]);

  useEffect(() => {
    if (errorMessage) Alert.alert("Google sign-in failed", errorMessage);
  }, [errorMessage]);

  const [fontsLoaded] = useFonts({
  GloriaHallelujah_400Regular,
});

useEffect(() => {
  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }
}, [fontsLoaded]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.log("Google prompt error:", e);
    }
  };

  // ✅ prevents flicker / weird “back to login” feel
  if (checkingAuth) return null;

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
            <Text style={styles.titleLine1}>Nonna's</Text>
            <Text style={styles.titleLine2}>Recipes</Text>
            <Text style={styles.subtitle}>Where recipes tell stories</Text>
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

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Forgot Password Link 
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
              */}
            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
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
    lineHeight: Math.min(width * 0.15, 58) * 1.5,
    fontFamily: 'GloriaHallelujah_400Regular', //  add this
  },
  titleLine2: {
    fontSize: Math.min(width * 0.165, 65),
    color: '#7b3306',
    lineHeight: Math.min(width * 0.165, 65) * 1.5,
    fontFamily: 'GloriaHallelujah_400Regular', // add this
  },
  subtitle: {
    fontSize: Math.min(width * 0.048, 19),
    color: 'rgba(151,60,0,0.8)',
    marginTop: 1,
    fontFamily: 'GloriaHallelujah_400Regular'
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