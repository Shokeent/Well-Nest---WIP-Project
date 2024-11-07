import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from './firebaseConfig';

const BookingScreen = ({ route, navigation }) => {
  const { therapistId, therapistName } = route.params;

  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('Online');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const doc = await db.collection('therapists').doc(therapistId).get();
        if (doc.exists) {
          const slots = doc.data().availability || [];
          setTimeSlots(slots);
        }
      } catch (error) {
        console.error('Error fetching time slots: ', error);
      }
    };

    fetchTimeSlots();
  }, [therapistId]);

  const handleBooking = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot.');
      return;
    }

    try {
      const user = auth.currentUser;
      const bookingData = {
        userId: user.uid,
        therapistId,
        therapistName,
        time: selectedTime,
        sessionType,
        status: 'Pending',
        createdAt: new Date(),
      };

      await db.collection('appointments').add(bookingData);

      setIsBookingSuccess(true);
      setTimeout(() => {
        navigation.navigate('Profile');
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment: ', error);
      Alert.alert('Error', 'Failed to book appointment.');
    }
  };

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Book an Appointment with {therapistName}</Text>

        <View style={[styles.formContainer, styles.timeSlotContainer]}>
          <Text style={styles.label}>Select a Time Slot:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedTime}
              onValueChange={(itemValue) => setSelectedTime(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Time" value="" />
              {timeSlots.map((slot, index) => (
                <Picker.Item key={index} label={slot} value={slot} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Session Type:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sessionType}
              onValueChange={(itemValue) => setSessionType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Online" value="Online" />
              <Picker.Item label="In-Person" value="In-Person" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>

        {isBookingSuccess && <Text style={styles.successMessage}>Booking Successful! Redirecting...</Text>}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#28A745',
  },
  formContainer: {
    marginBottom: 20,
    alignItems: 'stretch',
  },
  timeSlotContainer: {
    marginBottom: 30, // Additional space between Time Slot and Session Type
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#2F4F4F',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#28A745',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default BookingScreen;
