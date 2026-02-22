import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Animated,
  Easing,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const ProfileImage = require("../assets/images/profile.png");
type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;

  // optional data props (so this can be dynamic later)
  name?: string;
  email?: string;
  profilePhotoUrl?: string|null;
  recipesCount?: number;
  countriesCount?: number;

  // optional actions
  onPressChangePassword?: () => void;
  onPressHelp?: () => void;
  onPressAbout?: () => void;
  onPressLogOut?: () => void;
  onPressChangePhoto?: () => void;

  // toggles
  notificationsEnabled?: boolean;
  privacyEnabled?: boolean;
  onToggleNotifications?: (value: boolean) => void;
  onTogglePrivacy?: (value: boolean) => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  name = "Maria Rodriguez",
  email = "grandma@recipes.com",
  profilePhotoUrl,
  recipesCount = 47,
  countriesCount = 8,

  onPressChangePassword,
  onPressHelp,
  onPressAbout,
  onPressLogOut,
  onPressChangePhoto,

  notificationsEnabled = true,
  privacyEnabled = true,
  onToggleNotifications,
  onTogglePrivacy,
}: SettingsModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguages, setShowLanguages] = useState(false);

  const [localNotif, setLocalNotif] = useState(notificationsEnabled);
  const [localPrivacy, setLocalPrivacy] = useState(privacyEnabled);

  useEffect(() => setLocalNotif(notificationsEnabled), [notificationsEnabled]);
  useEffect(() => setLocalPrivacy(privacyEnabled), [privacyEnabled]);

  const languages = useMemo(
    () => ["English", "Spanish", "French", "Italian", "German", "Portuguese"],
    []
  );

  // Slide-down animation
  const translateY = useRef(new Animated.Value(-600)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setShowLanguages(false);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 28,
          stiffness: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 160,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -600,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, overlayOpacity, translateY]);

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      {/* Overlay */}
      <Pressable style={styles.overlayPressable} onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      {/* Top sheet */}
      <Animated.View style={[styles.sheetWrap, { transform: [{ translateY }] }]}>
        <SafeAreaView edges={["top"]} style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Settings</Text>
              <Text style={styles.subtitle}>Manage your account</Text>
            </View>

            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Profile photo */}
            <View style={styles.profileSection}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatarRing}>
                <Image
                  source={profilePhotoUrl ? { uri: profilePhotoUrl } : ProfileImage}
                  style={styles.avatarImg}
                />                </View>

                <Pressable
                  onPress={onPressChangePhoto}
                  style={({ pressed }) => [
                    styles.cameraBtn,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text style={styles.cameraText}>📷</Text>
                </Pressable>
              </View>

              <Text style={styles.profileName}>{name}</Text>
            </View>

            {/* Account */}
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.card}>
              <View style={[styles.row, styles.rowBorder]}>
                <View>
                  <Text style={styles.rowLabel}>Email</Text>
                  <Text style={styles.rowSub}>{email}</Text>
                </View>
              </View>

              <Pressable
                onPress={onPressChangePassword}
                style={({ pressed }) => [styles.rowButton, styles.rowBorder, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>Change Password</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowLanguages((v) => !v)}
                style={({ pressed }) => [styles.rowButton, styles.rowBorder, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>Language</Text>
                <View style={styles.rowRight}>
                  <Text style={styles.rowRightText}>{selectedLanguage}</Text>
                  <Text style={[styles.chevron, showLanguages && styles.chevronRotated]}>›</Text>
                </View>
              </Pressable>

              {showLanguages && (
                <View style={styles.languagesWrap}>
                  {languages.map((lang, idx) => {
                    const isSelected = selectedLanguage === lang;
                    return (
                      <Pressable
                        key={lang}
                        onPress={() => {
                          setSelectedLanguage(lang);
                          setShowLanguages(false);
                        }}
                        style={({ pressed }) => [
                          styles.languageRow,
                          idx !== languages.length - 1 && styles.languageRowBorder,
                          pressed && styles.rowPressed,
                        ]}
                      >
                        <Text style={[styles.languageText, isSelected && styles.languageSelected]}>
                          {lang}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <View style={[styles.rowButton, styles.rowBorder]}>
                <Text style={styles.rowLabel}>Notifications</Text>
                <Switch
                  value={localNotif}
                  onValueChange={(v) => {
                    setLocalNotif(v);
                    onToggleNotifications?.(v);
                  }}
                />
              </View>

              <View style={styles.rowButton}>
                <Text style={styles.rowLabel}>Privacy</Text>
                <Switch
                  value={localPrivacy}
                  onValueChange={(v) => {
                    setLocalPrivacy(v);
                    onTogglePrivacy?.(v);
                  }}
                />
              </View>
            </View>

            {/* Profile Stats */}
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{recipesCount}</Text>
                <Text style={styles.statLabel}>Recipes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{countriesCount}</Text>
                <Text style={styles.statLabel}>Countries</Text>
              </View>
            </View>

            {/* Support */}
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.card}>
              <Pressable
                onPress={onPressHelp}
                style={({ pressed }) => [styles.rowButton, styles.rowBorder, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>Help</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable
                onPress={onPressAbout}
                style={({ pressed }) => [styles.rowButton, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>About</Text>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </View>

            {/* Logout */}
            <Pressable
              onPress={onPressLogOut}
              style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>

            <View style={{ height: 16 }} />
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const COLORS = {
  brown: "#3E2723",
  warmBrown: "#8B7355",
  accent: "#D4824A",
  cardBg: "#FFF8F0",
  white: "#FFFFFF",
  danger: "#C85A54",
  overlay: "rgba(0,0,0,0.40)",
};

const styles = StyleSheet.create({
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  sheetWrap: {
    position: "absolute",
    top: Platform.OS === "ios" ? 44 :20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  sheet: {
    width: "100%",
    maxWidth: 720,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
    maxHeight: "85%",
    paddingTop: 6, // small extra breathing room below safe area
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10, // reduced because SafeAreaView adds top inset
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(139,115,85,0.15)",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  title: {
    fontSize: 20,
    color: COLORS.brown,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(139,115,85,0.70)",
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 18,
    color: COLORS.warmBrown,
  },

  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 18,
  },

  profileSection: {
    alignItems: "center",
    gap: 10,
  },
  avatarWrap: {
    position: "relative",
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "rgba(212,130,74,0.20)",
    backgroundColor: "#F5F5F0",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 12,
    color: "rgba(0,0,0,0.25)",
  },
  cameraBtn: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cameraText: {
    fontSize: 14,
    color: "#fff",
    marginTop: Platform.OS === "android" ? 0 : 1,
  },
  profileName: {
    fontSize: 15,
    color: COLORS.brown,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 15,
    color: COLORS.brown,
    fontWeight: "600",
    marginTop: 4,
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(139,115,85,0.15)",
  },
  rowPressed: {
    backgroundColor: "rgba(139,115,85,0.05)",
  },
  rowLabel: {
    fontSize: 13,
    color: COLORS.brown,
  },
  rowSub: {
    marginTop: 2,
    fontSize: 13,
    color: "rgba(139,115,85,0.60)",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowRightText: {
    fontSize: 13,
    color: "rgba(139,115,85,0.75)",
  },
  chevron: {
    fontSize: 20,
    color: COLORS.warmBrown,
    lineHeight: 20,
  },
  chevronRotated: {
    transform: [{ rotate: "90deg" }],
  },

  languagesWrap: {
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(139,115,85,0.15)",
  },
  languageRow: {
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  languageRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(139,115,85,0.10)",
  },
  languageText: {
    fontSize: 13,
    color: COLORS.brown,
  },
  languageSelected: {
    color: COLORS.accent,
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    color: COLORS.accent,
    fontWeight: "700",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.warmBrown,
  },

  logoutBtn: {
    marginTop: 2,
    width: "100%",
    borderRadius: 18,
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});