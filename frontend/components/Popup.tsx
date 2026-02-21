import React from "react";
import { Modal, View, Text, Button, StyleSheet, Pressable } from "react-native";

interface PopupProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onResend?: () => void;
}

export default function Popup({ visible, onClose, title, message, onResend }: PopupProps) {
    return (
        <Modal visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    {/*Ok button*/}
                    <Pressable style={styles.button} onPress={onClose}> 
                        <Text style={styles.buttonText}>Ok</Text> 
                    </Pressable>
                    {/*Resend button*/}
                    {onResend && (
                        <Pressable style={[styles.button, styles.resendButton]} onPress={onResend}>
                        <Text style={styles.buttonText}>Resend Email</Text>
                    </Pressable>)}
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resendButton:{
    backgroundColor:"#34C759",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
