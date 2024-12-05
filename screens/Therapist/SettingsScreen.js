import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Switch, SafeAreaView, ImageBackground } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';
import { colors } from '../../utils/colors';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [bio, setBio] = useState('');
  const [rating, setRating] = useState('');
  const [therapistData, setTherapistData] = useState({});

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const doc = await db.collection('therapists').doc(userId).get();
          const data = doc.data();
          setTherapistData(data);
          setBio(data?.bio || '');
          setRating(data?.rating?.toString() || '');
        }
      } catch (error) {
        console.error('Error fetching therapist data:', error);
      }
    };
    fetchTherapistData();
  }, []);

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('AdminLogin'); 
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = auth.currentUser.uid;
              await db.collection('therapists').doc(userId).delete(); 
              await auth.currentUser.delete(); 
              navigation.navigate('AdminLogin');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSaveBioAndRating = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        await db.collection('therapists').doc(userId).update({
          bio,
          rating: parseFloat(rating) || 0,
        });
        Alert.alert('Success', 'Bio and rating updated successfully!');
      }
    } catch (error) {
      console.error('Error updating bio and rating:', error);
      Alert.alert('Error', 'Failed to update bio and rating.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.header}>Settings</Text>

          {/* Bio and Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Add your bio"
              placeholderTextColor={colors.secondary}
              value={bio}
              onChangeText={setBio}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Rating (e.g., 4.5)"
              placeholderTextColor={colors.secondary}
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveBioAndRating}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Enable Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ true: colors.primary, false: colors.error }}
                thumbColor={notificationsEnabled ? colors.accent : colors.error}
              />
            </View>
          </View>

          {/* Account Management */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.text,
  },
  button: {
    padding: 15,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    padding: 15,
    backgroundColor: colors.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: colors.text,
  },
});

export default SettingsScreen;
