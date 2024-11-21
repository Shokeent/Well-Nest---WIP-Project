import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';
import { parse, isAfter, format } from 'date-fns'; // For date parsing and formatting

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

        // Fetch appointments from the therapist's subcollection
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

          // Parse the appointment date and time
          const appointmentDate = parse(`${data.date} ${data.time}`, 'yyyy-MM-dd hh:mm a', new Date());

          // Categorize appointments based on the current date and time
          if (isAfter(appointmentDate, now)) {
            upcoming.push({ id: doc.id, ...data });
          } else {
            past.push({ id: doc.id, ...data });
          }
        });

        // Sort appointments
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
      const therapistId = auth.currentUser.uid;
      const newStatus = action === 'approve' ? 'Approved' : 'Cancelled';

      // References to therapist's and user's appointments
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

      // Update status in both therapist and user appointments
      await therapistAppointmentRef.update({ status: newStatus });
      await userAppointmentRef.update({ status: newStatus });

      Alert.alert('Success', `Appointment ${newStatus.toLowerCase()} successfully!`);

      // Refresh appointments
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

      // Update the UI
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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    elevation: 1,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noAppointments: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
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
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AppointmentsScreen;
