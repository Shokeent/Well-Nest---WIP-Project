import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db, auth } from './firebaseConfig';
import { colors } from './colors';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const favSnapshot = await db
        .collection('users')
        .doc(user.uid)
        .collection('favorites')
        .get();

      const favData = favSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavorites(favData);
    } catch (error) {
      console.error("Error fetching favorites: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFavorites(); 
    }, [])
  );

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

      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.id !== therapistId)
      );
    } catch (error) {
      console.error("Error removing favorite: ", error);
    }
  };

  const handleRemoveAllFavorites = async () => {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert(
      "Remove All Favorites",
      "Are you sure you want to remove all favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const favCollection = db
                .collection('users')
                .doc(user.uid)
                .collection('favorites');

              const favSnapshot = await favCollection.get();
              const batch = db.batch();

              favSnapshot.forEach((doc) => {
                batch.delete(doc.ref);
              });

              await batch.commit();
              setFavorites([]);
            } catch (error) {
              console.error("Error removing all favorites: ", error);
            }
          },
        },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <ImageBackground source={require('./assets/background.jpg')} style={styles.background} resizeMode="cover">
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites yet!</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
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
              <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)}>
                <Text style={styles.removeFavorite}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity style={styles.removeAllButton} onPress={handleRemoveAllFavorites}>
          <Text style={styles.removeAllButtonText}>Remove All Favorites</Text>
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
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    borderRadius: 10,
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
  removeFavorite: {
    color: colors.error,
    fontSize: 14,
  },
  removeAllButton: {
    backgroundColor: colors.error,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  removeAllButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default FavoritesScreen;
