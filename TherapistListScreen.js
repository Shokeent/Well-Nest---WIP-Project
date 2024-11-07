import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { db } from './firebaseConfig'; // Import your Firestore config
import { colors } from './colors'; // Import color values

const TherapistListScreen = () => {
  const [therapists, setTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredTherapists, setFilteredTherapists] = useState([]); // State for filtered list
  const navigation = useNavigation(); // Use navigation hook

  useEffect(() => {
    const unsubscribe = db.collection('therapists').onSnapshot((snapshot) => {
      const therapistsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTherapists(therapistsData);
      setFilteredTherapists(therapistsData); // Initially show all therapists
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle search term change
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredTherapists(therapists); // Show all therapists if search is cleared
    } else {
      // Filter therapists by name (case insensitive)
      const filtered = therapists.filter((therapist) =>
        therapist.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTherapists(filtered);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} // Replace with your background image URL or local path
      style={styles.container}
      resizeMode="cover"
    >
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by name"
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {/* Therapist list */}
      <FlatList
        data={filteredTherapists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Profile', { therapistId: item.id })} // Navigate to ProfileScreen
          >
            {/* Only display name and specialization */}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialty}>{item.specialization}</Text>
            {/* Display rating */}
            <Text style={styles.rating}>Rating: {item.rating ? item.rating.toFixed(1) : 'No rating yet'}</Text>
          </TouchableOpacity>
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background, // Fallback color in case the image fails
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    backgroundColor: colors.background, // Background for search bar to make it readable
  },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.accent, // Soft green background for each card
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary, // Dark green for therapist's name
  },
  specialty: {
    fontSize: 16,
    color: colors.text, // Dark text for the specialization
  },
  rating: {
    fontSize: 14,
    color: colors.primary, // Greenish color for the rating
    marginTop: 8,
  },
});

export default TherapistListScreen;
