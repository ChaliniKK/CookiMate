import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../../config/firebase";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const debuggerHost = Constants.expoConfig?.hostUri;
const address = debuggerHost ? debuggerHost.split(":")[0] : "localhost";
const API_URL = `http://${address}:5000`;

const Settings = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const currentUser = auth.currentUser;
  const uid = currentUser?.uid;

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await auth.signOut();
              await AsyncStorage.removeItem('userToken');
              router.replace("../auth/login");
            } catch (error) {
              Alert.alert("Error", "Failed to log out");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await axios.delete(`${API_URL}/api/users/${uid}`);
              await auth.currentUser?.delete();
              await AsyncStorage.removeItem('userToken');
              router.replace("../auth/signup");
            } catch (error) {
              Alert.alert("Error", "Failed to delete account");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#5F4436" />
        </TouchableOpacity>

        {/* Settings Title */}
        <Text style={styles.settingsTitle}>Settings</Text>

        {/* Change Password Card */}
        <TouchableOpacity 
          style={styles.settingCard}
          onPress={() => router.push("../profile/change-password")}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: '#923d0a20' }]}>
              <Feather name="lock" size={24} color="#923d0a" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Change Password</Text>
              <Text style={styles.cardSubtitle}>Update your account password</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={24} color="#5D4037" />
        </TouchableOpacity>

        {/* Log Out Card */}
        <TouchableOpacity 
          style={[styles.settingCard, styles.logoutCard]}
          onPress={handleLogout}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: '#F4433620' }]}>
              <Feather name="log-out" size={24} color="#F44336" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, styles.logoutText]}>Log Out</Text>
              <Text style={styles.cardSubtitle}>Sign out of your account</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Delete Account Card */}
        <TouchableOpacity 
          style={[styles.settingCard, styles.deleteCard]}
          onPress={handleDeleteAccount}
        >
          <View style={styles.cardContent}>
            <View style={[styles.iconContainer, { backgroundColor: '#F4433620' }]}>
              <Feather name="trash-2" size={24} color="#F44336" />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.cardTitle, styles.deleteText]}>Delete Account</Text>
              <Text style={styles.cardSubtitle}>Permanently delete your account</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Extra bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#923d0a" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f2ece2',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
  },
  backBtn: {
    marginVertical: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 20,
    marginTop: 5,
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E8C28E',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8B6B5C',
  },
  logoutCard: {
    marginTop: 20,
    borderColor: '#F44336',
  },
  deleteCard: {
    borderColor: '#F44336',
  },
  logoutText: {
    color: '#F44336',
  },
  deleteText: {
    color: '#F44336',
  },
  bottomSpacing: {
    height: 30,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Settings;