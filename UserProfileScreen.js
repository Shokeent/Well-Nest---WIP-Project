import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from './firebaseConfig';
import { colors } from './colors';

const UserProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [localImageUri, setLocalImageUri] = useState(null); // For storing the selected image URI

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await db.collection('users').doc(userId).get();
        setUserData(userDoc.data());
        setLocalImageUri(userDoc.data()?.profileImage); // Load image URI from Firestore
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
      setLocalImageUri(result.uri); // Update the local image URI immediately
      saveImageUri(result.uri); // Save it to Firestore if URI is valid
    } else {
      console.log("Image selection was canceled or failed.");
    }
  };
  
  const saveImageUri = async (uri) => {
    try {
      if (!uri) {
        console.warn("No valid URI to save.");
        return;
      }
  
      const userId = auth.currentUser.uid;
      await db.collection('users').doc(userId).update({
        profileImage: uri, // Store the URI in Firestore
      });
      console.log('Image URI saved to Firestore successfully.');
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };
  

  const handleSignOut = () => {
    auth.signOut()
      .then(() => navigation.replace('Auth'))
      .catch((error) => alert(error.message));
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TouchableOpacity onPress={pickImage}>
          {localImageUri ? (
            <Image source={{ uri: localImageUri }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.name}>{userData.name || "User Name"}</Text>
        <Text style={styles.phone}>{userData.phone || "(123) 456-7890"}</Text>
        <Text style={styles.email}>{userData.email || "user@example.com"}</Text>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D0F0C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#888',
    fontSize: 16,
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
