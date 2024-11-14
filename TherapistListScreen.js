import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { db, auth } from './firebaseConfig';
import { colors } from './colors';

const TherapistListScreen = () => {
  const [therapists, setTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredTherapists, setFilteredTherapists] = useState([]); 
  const navigation = useNavigation(); 

  useEffect(() => {
    const unsubscribe = db.collection('therapists').onSnapshot((snapshot) => {
      const therapistsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTherapists(therapistsData);
      setFilteredTherapists(therapistsData);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredTherapists(therapists); 
    } else {
      const filtered = therapists.filter((therapist) =>
        therapist.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredTherapists(filtered);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name"
          placeholderTextColor="#A5D6A7"
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredTherapists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('TherapistDetail', { therapistId: item.id })} 
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialization}</Text>
              <Text style={styles.rating}>Rating: {item.rating ? item.rating.toFixed(1) : 'No rating yet'}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
  },
  searchBar: {
    height: 50,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    color: '#388E3C',
    fontSize: 16,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  specialty: {
    fontSize: 16,
    color: '#388E3C',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: '#81C784',
    marginTop: 8,
    
  },
});

export default TherapistListScreen;
