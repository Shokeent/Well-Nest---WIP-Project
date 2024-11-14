import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from './firebaseConfig';
import { colors } from './colors';

const TherapistDetailScreen = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const [therapist, setTherapist] = useState(null);

  useEffect(() => {
    const fetchTherapistDetails = async () => {
      try {
        const doc = await db.collection('therapists').doc(therapistId).get();
        if (doc.exists) {
          setTherapist(doc.data());
        } else {
          console.log('Therapist not found');
        }
      } catch (error) {
        console.error('Error fetching therapist details: ', error);
      }
    };

    fetchTherapistDetails();
  }, [therapistId]);

  const handleAddToFavorites = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await db.collection('users').doc(user.uid).collection('favorites').doc(therapistId).set({
          name: therapist.name,
          specialization: therapist.specialization,
          rating: therapist.rating,
          location: therapist.location,
        });
        Alert.alert('Added to Favorites', `${therapist.name} has been added to your favorites.`);
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out Dr. ${therapist.name}, specializing in ${therapist.specialization}.`,
      });
    } catch (error) {
      console.error('Error sharing therapist details:', error);
    }
  };

  const handleBookAppointment = () => {
    navigation.navigate('Booking', { therapistId, therapistName: therapist.name });
  };

  const handleLocation = () => {
    navigation.navigate('Map', { location: therapist.location });
  };

  if (!therapist) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Therapist Profile</Text>
        <Text style={styles.name}> {therapist.name}</Text>
        <Text style={styles.rating}>
          Rating: {therapist.rating} <Ionicons name="star" size={16} color="#FFD700" />
        </Text>
        <Text style={styles.location}> {therapist.location}  </Text>

        <Text style={styles.specialization}>Specializations:</Text>
        <Text style={styles.specializationText}>{therapist.specialization}</Text>

        <Text style={styles.about}>About:</Text>
        <Text style={styles.aboutText}>{therapist.bio || 'No bio available.'}</Text>

        <Text style={styles.availability}>Availability:</Text>
        <Text style={styles.availabilityText}>{therapist.availability}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLocation}>
            <Text style={styles.buttonText}>Location</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.largeButton} onPress={handleAddToFavorites}>
          <Text style={styles.largeButtonText}>Add To Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.largeButton} onPress={handleBookAppointment}>
          <Text style={styles.largeButtonText}>Book Appointment</Text>
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
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  rating: {
    fontSize: 18,
    color: '#555',
    marginVertical: 5,
  },
  location: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  specialization: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  specializationText: {
    fontSize: 16,
    color: colors.text,
  },
  about: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  aboutText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  availability: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 10,
  },
  availabilityText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  largeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
  },
  largeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TherapistDetailScreen;
