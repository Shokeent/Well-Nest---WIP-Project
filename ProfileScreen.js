import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';
import { db } from './firebaseConfig'; 
import { colors } from './colors'; 

const ProfileScreen = ({ route, navigation }) => {
  const { therapistId } = route.params;
  const [therapist, setTherapist] = useState(null);

  useEffect(() => {
    const fetchTherapistDetails = async () => {
      try {
        const therapistDoc = await db.collection('therapists').doc(therapistId).get();
        if (therapistDoc.exists) {
          setTherapist(therapistDoc.data());
        } else {
          console.log('Therapist not found');
        }
      } catch (error) {
        console.error('Error fetching therapist details: ', error);
      }
    };

    fetchTherapistDetails();
  }, [therapistId]);

  if (!therapist) {
    return <Text>Loading...</Text>;
  }

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.profileContainer}>
        <Text style={styles.name}>{therapist.name}</Text>
        <Text style={styles.specialization}>{therapist.specialization}</Text>
        <Text style={styles.rating}>Rating: {therapist.rating}</Text>
        <Text style={styles.location}>Location: {therapist.location}</Text>
        <Text style={styles.bio}>{therapist.bio || 'No bio available.'}</Text>
        <Text style={styles.availability}>Availability: {therapist.availability}</Text>

        <Button
          title="Book Now"
          onPress={() => navigation.navigate('Booking', { therapistId })}
          color={colors.primary}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, 
    opacity: 0.9, 
    borderRadius: 10, // Optional: adds a slight curve to the container edges
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  specialization: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  availability: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
});

export default ProfileScreen;
