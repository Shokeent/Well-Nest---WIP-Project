import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';

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
      navigation.navigate('AdminLogin'); // Navigate back to the login screen
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
              await db.collection('therapists').doc(userId).delete(); // Remove therapist data from Firestore
              await auth.currentUser.delete(); // Delete the user account
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
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Bio and Rating */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Add your bio"
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Rating (e.g., 4.5)"
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    padding: 15,
    backgroundColor: '#81C784',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    padding: 15,
    backgroundColor: '#F44336',
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
    color: '#555',
  },
});

export default SettingsScreen;
