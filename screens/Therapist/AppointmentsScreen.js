import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView, Alert } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';
import { parse, isAfter, format } from 'date-fns';
import { colors } from '../../utils/colors';

const AppointmentsScreen = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const therapist = auth.currentUser;
        if (!therapist) {
          Alert.alert('Authentication Error', 'Please log in again.');
          return;
        }

        const snapshot = await db
          .collection('therapists')
          .doc(therapist.uid)
          .collection('appointments')
          .get();

        const now = new Date();
        const upcoming = [];
        const past = [];

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const appointmentDate = parse(`${data.date} ${data.time}`, 'yyyy-MM-dd hh:mm a', new Date());

          if (isAfter(appointmentDate, now)) {
            upcoming.push({ id: doc.id, ...data });
          } else {
            past.push({ id: doc.id, ...data });
          }
        });

        upcoming.sort((a, b) => parse(`${a.date} ${a.time}`, 'yyyy-MM-dd hh:mm a', new Date()) -
          parse(`${b.date} ${b.time}`, 'yyyy-MM-dd hh:mm a', new Date()));
        past.sort((a, b) => parse(`${b.date} ${b.time}`, 'yyyy-MM-dd hh:mm a', new Date()) -
          parse(`${a.date} ${a.time}`, 'yyyy-MM-dd hh:mm a', new Date()));

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        Alert.alert('Error', 'Failed to fetch appointments.');
      }
    };

    fetchAppointments();
  }, []);

  const handleAction = async (appointmentId, action, userId) => {
    try {
      const therapistId = auth.currentUser?.uid;
      const newStatus = action === 'approve' ? 'Approved' : 'Cancelled';

      const therapistAppointmentRef = db
        .collection('therapists')
        .doc(therapistId)
        .collection('appointments')
        .doc(appointmentId);

      const userAppointmentRef = db
        .collection('users')
        .doc(userId)
        .collection('appointments')
        .doc(appointmentId);

      await therapistAppointmentRef.update({ status: newStatus });
      await userAppointmentRef.update({ status: newStatus });

      Alert.alert('Success', `Appointment ${newStatus.toLowerCase()} successfully!`);

      const snapshot = await db
        .collection('therapists')
        .doc(therapistId)
        .collection('appointments')
        .get();

      const now = new Date();
      const upcoming = [];
      const past = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const appointmentDate = parse(`${data.date} ${data.time}`, 'yyyy-MM-dd hh:mm a', new Date());

        if (isAfter(appointmentDate, now)) {
          upcoming.push({ id: doc.id, ...data });
        } else {
          past.push({ id: doc.id, ...data });
        }
      });

      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
    } catch (error) {
      console.error(`Error performing action (${action}):`, error);
      Alert.alert('Error', 'Failed to perform the action. Please try again.');
    }
  };

  const renderAppointment = (appointment, isUpcoming) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Date: {format(parse(appointment.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')}</Text>
      <Text style={styles.cardText}>Time: {appointment.time}</Text>
      <Text style={styles.cardText}>User: {appointment.userName}</Text>
      <Text style={styles.cardText}>Status: {appointment.status}</Text>
      {isUpcoming && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleAction(appointment.id, 'approve', appointment.userId)}
          >
            <Text style={styles.actionText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleAction(appointment.id, 'cancel', appointment.userId)}
          >
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <FlatList
            data={upcomingAppointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderAppointment(item, true)}
            ListEmptyComponent={<Text style={styles.noAppointments}>No upcoming appointments.</Text>}
          />

          <Text style={styles.sectionTitle}>Past Appointments</Text>
          <FlatList
            data={pastAppointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderAppointment(item, false)}
            ListEmptyComponent={<Text style={styles.noAppointments}>No past appointments.</Text>}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: colors.accent,
    borderRadius: 10,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  noAppointments: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginVertical: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AppointmentsScreen;
