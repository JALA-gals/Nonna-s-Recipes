import React from "react";
import { TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, Platform, Dimensions, Modal, View, Text, Button, StyleSheet, Pressable } from "react-native";

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
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color:'#7b3306',
    shadowColor: '#7b3306',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  message: {
    fontSize: 16,
     color:'#7b3306',
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width:"80%",
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
  resendButton:{
    width:"80%",  
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
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
