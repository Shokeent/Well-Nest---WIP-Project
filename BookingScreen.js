import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import colors from './colors';

const BookingScreen = ({ route }) => {
  const { therapist } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book an Appointment with {therapist.name}</Text>
      <Button title="Confirm Booking" onPress={() => {/* handle booking */}} color={colors.primary} />
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
    fontSize: 22,
    color: colors.text,
    marginBottom: 20,
  },
});

export default BookingScreen;
