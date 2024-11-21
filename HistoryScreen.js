import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { db, auth } from './firebaseConfig';
import { colors } from './colors';

const HistoryScreen = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
 
        const appointmentsSnapshot = await db
          .collection('users')
          .doc(user.uid)
          .collection('appointments')
          .orderBy('createdAt', 'desc')
          .get();

        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.appointmentCard}>
      <Text style={styles.therapistName}>{item.therapistName}</Text>
      <Text style={styles.appointmentDetail}>Date: {item.date}</Text>
      <Text style={styles.appointmentDetail}>Time: {item.time}</Text>
      <Text style={styles.appointmentDetail}>Session Type: {item.sessionType}</Text>
      <Text style={styles.appointmentDetail}>Status: {item.status}</Text>
    </View>
  );

  if (appointments.length === 0) {
    return (
      <ImageBackground
        source={require('./assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No past appointments found.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Appointment History</Text>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  appointmentCard: {
    backgroundColor: colors.accent,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  appointmentDetail: {
    fontSize: 16,
    color: colors.text,
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

export default HistoryScreen;
