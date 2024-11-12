// FavoritesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from './firebaseConfig';
import { colors } from './colors';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch favorited therapists from Firestore for the current user
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const favSnapshot = await db
          .collection('users')
          .doc(user.uid)
          .collection('favorites')
          .get();

        const favData = favSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setFavorites(favData);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (therapistId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await db
        .collection('users')
        .doc(user.uid)
        .collection('favorites')
        .doc(therapistId)
        .delete();

      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== therapistId));
    } catch (error) {
      console.error("Error removing favorite: ", error);
    }
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites yet!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.exploreText}>Explore Therapists</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.image} />}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.specialization}>{item.specialization}</Text>
            <Text style={styles.rating}>Rating: {item.rating ? item.rating.toFixed(1) : 'No rating'}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { therapistId: item.id })}>
              <Text style={styles.viewProfile}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)}>
              <Text style={styles.removeFavorite}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.accent,
    borderRadius: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  specialization: {
    fontSize: 16,
    color: colors.text,
  },
  rating: {
    fontSize: 14,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
  },
  viewProfile: {
    color: colors.primary,
    marginRight: 10,
  },
  removeFavorite: {
    color: colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: colors.primary,
    marginBottom: 8,
  },
  exploreText: {
    fontSize: 16,
    color: colors.secondary,
  },
});

export default FavoritesScreen;
