import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { auth, db } from './firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { colors } from './colors';

const UserProfileScreen = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
    profileImage: null,
  });

  // Fetch user details from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setUserDetails({
              name: userDoc.data().name,
              phone: userDoc.data().phone,
              email: user.email, // Using auth email
              profileImage: userDoc.data().profileImage || null,
            });
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => navigation.replace('Auth'))
      .catch((error) => alert(error.message));
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to photos to upload a profile picture.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    // Check if the result contains a URI before proceeding
    if (!result.canceled && result.uri) {
      const newProfileImage = result.uri;
      setUserDetails(prevState => ({ ...prevState, profileImage: newProfileImage }));
  
      // Save the new profile image URI to Firestore only if it's not undefined
      try {
        const user = auth.currentUser;
        if (user) {
          await db.collection('users').doc(user.uid).update({
            profileImage: newProfileImage,
          });
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    } else {
      console.log("Image selection was canceled or failed.");
    }
  };
  

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={pickImage} style={styles.profilePictureContainer}>
          {userDetails.profileImage ? (
            <Image source={{ uri: userDetails.profileImage }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* User Details */}
        <Text style={styles.name}>{userDetails.name}</Text>
        <Text style={styles.phone}>{userDetails.phone}</Text>
        <Text style={styles.email}>{userDetails.email}</Text>

        {/* Sign Out Button */}
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
  profilePictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D0F0C0',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
  },
  profilePicturePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  addPhotoText: {
    fontSize: 16,
    color: colors.primary,
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
