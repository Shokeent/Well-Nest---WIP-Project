import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ImageBackground, Alert, SafeAreaView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db, auth } from '../../utils/firebaseConfig';
import { colors } from '../../utils/colors';

const BookingScreen = ({ route, navigation }) => {
  const { therapistId, therapistName } = route.params;

  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('Select a Time Slot');
  const [sessionType, setSessionType] = useState('In-Person');
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
      Alert.alert('Missing Information', 'Please select a date and time slot.');
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Authentication Error', 'Please log in to book an appointment.');
        return;
      }

     
    const userDoc = await db.collection('users').doc(user.uid).get();
    let userName = 'Anonymous User';
    if (userDoc.exists && userDoc.data().name) {
      userName = userDoc.data().name; 
    }
  
      // appointment data
      const appointmentData = {
        therapistId,
        therapistName,
        userId: user.uid, 
        userName, 
        date: selectedDate,
        time: selectedTime,
        sessionType,
        status: 'Pending',
        createdAt: new Date(),
      };
      const appointmentId = db.collection('appointments').doc().id;
  
      //  user's appointments subcollection
      await db
        .collection('users')
        .doc(user.uid)
        .collection('appointments')
        .doc(appointmentId)
        .set(appointmentData);
  
      //therapist's appointments subcollection
      await db
        .collection('therapists')
        .doc(therapistId)
        .collection('appointments')
        .doc(appointmentId)
        .set(appointmentData);
  
      Alert.alert(
        'Appointment Confirmed',
        `Your appointment with ${therapistName} on ${selectedDate} at ${selectedTime} is confirmed.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('History'),
          },
        ]
      );
    } catch (error) {
      console.error('Error booking appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    }
  };
  
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
      
        <Text style={styles.heading}>Book an Appointment with        {therapistName}</Text>

        <Text style={styles.label}>Select a Date:</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: colors.primary },
          }}
          style={styles.calendar}
        />

        <TouchableOpacity style={styles.selector} onPress={() => setTimeModalVisible(true)}>
          <Text style={styles.selectorText}>{selectedTime}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>

        <Modal visible={timeModalVisible} animationType="fade" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.modalScroll}>
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
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
    </SafeAreaView>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalScroll: {
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
