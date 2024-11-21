import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ImageBackground, Switch, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../utils/firebaseConfig';
import { colors } from '../../utils/colors';

const UserProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [localImageUri, setLocalImageUri] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await db.collection('users').doc(userId).get();
        setUserData(userDoc.data());
        setLocalImageUri(userDoc.data()?.profileImage);
      }
    };
    fetchUserData();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant camera roll permissions to change the profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.uri) {
      setLocalImageUri(result.uri);
      saveImageUri(result.uri);
    }
  };

  const saveImageUri = async (uri) => {
    try {
      const userId = auth.currentUser.uid;
      await db.collection('users').doc(userId).update({
        profileImage: uri,
      });
      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    }
  };

  const handleSignOut = () => {
    auth.signOut()
      .then(() => navigation.replace('Auth'))
      .catch((error) => alert(error.message));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* User Info */}
          <Text style={styles.name}>{userData.name || "User Name"}</Text>
          <Text style={styles.phone}>{userData.phone || "(123) 456-7890"}</Text>
          <Text style={styles.email}>{userData.email || "user@example.com"}</Text>

          {/* Notifications Toggle */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '90%',
    height: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  editText: {
    fontSize: 14,
    color: '#388E3C',
    fontStyle: 'italic',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  phone: {
    fontSize: 18,
    color: colors.text,
  },
  email: {
    fontSize: 18,
    color: colors.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
  signOutButton: {
    width: '80%',
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
