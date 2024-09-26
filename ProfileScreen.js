import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from './colors';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      {/* Display user profile information */}
      <Text style={styles.info}>Email: example@example.com</Text>
      <Text style={styles.info}>Appointments: 5</Text>
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
  info: {
    fontSize: 18,
    color: colors.text,
    marginVertical: 5,
  },
});

export default ProfileScreen;
