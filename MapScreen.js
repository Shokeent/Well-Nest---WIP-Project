import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from './colors';

const MapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Therapist Locations</Text>
      {/*Maps Implementation */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.text,
    marginBottom: 20,
  },
});

export default MapScreen;
