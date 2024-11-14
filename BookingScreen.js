// BookingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ImageBackground } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db, auth } from './firebaseConfig';
import { colors } from './colors';

const BookingScreen = ({ route, navigation }) => {
  const { therapistId, therapistName } = route.params;

  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('Select a Time Slot');
  const [sessionType, setSessionType] = useState('In-Person');
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

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
    if (!selectedDate || selectedTime === 'Select a Time Slot') {
      alert('Please select a date and time slot.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please log in to book an appointment.');
        return;
      }

      // Define the appointment data
      const appointmentData = {
        therapistId,
        therapistName,
        date: selectedDate,
        time: selectedTime,
        sessionType,
        status: 'Pending',
        createdAt: new Date(),
      };

      // Save the appointment to the user's subcollection in Firestore
      await db
        .collection('users')
        .doc(user.uid)
        .collection('appointments')
        .add(appointmentData);

      setIsBookingSuccess(true);
      setTimeout(() => {
        navigation.navigate('Profile'); // Navigate to Profile or any other screen after booking
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment: ', error);
      alert('Failed to book appointment.');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Book an Appointment with {therapistName}</Text>

        {/* Calendar for selecting date */}
        <Text style={styles.label}>Select a Date:</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: colors.primary },
          }}
          style={styles.calendar}
        />

        {/* Time slot picker */}
        <TouchableOpacity style={styles.selector} onPress={() => setTimeModalVisible(true)}>
          <Text style={styles.selectorText}>{selectedTime}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>

        {isBookingSuccess && <Text style={styles.successMessage}>Booking Successful! Redirecting...</Text>}

        {/* Time Slot Modal */}
        <Modal visible={timeModalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedTime(slot);
                    setTimeModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{slot}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalClose} onPress={() => setTimeModalVisible(false)}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginVertical: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  calendar: {
    width: '100%',
    marginBottom: 20,
  },
  selector: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalItem: {
    paddingVertical: 10,
    width: '100%',
  },
  modalText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  modalClose: {
    marginTop: 20,
  },
  modalCloseText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
