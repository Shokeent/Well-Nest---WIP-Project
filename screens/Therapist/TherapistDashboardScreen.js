import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';

const TherapistDashboardScreen = ({ navigation }) => {
  const [therapistData, setTherapistData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Authentication Error', 'Please log in again.');
          navigation.navigate('AdminLogin');
          return;
        }

        const doc = await db.collection('therapists').doc(user.uid).get();
        if (doc.exists) {
          setTherapistData(doc.data());
        } else {
          Alert.alert('Error', 'Therapist data not found.');
        }
      } catch (error) {
        console.error('Error fetching therapist data:', error);
        Alert.alert('Error', 'Failed to fetch therapist data.');
      }
    };

    const fetchAppointments = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Authentication Error', 'Please log in again.');
          return;
        }

        const snapshot = await db
          .collection('therapists')
          .doc(user.uid)
          .collection('appointments')
          .get();

        const appointmentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        Alert.alert('Error', 'Failed to fetch appointments.');
      }
    };

    fetchTherapistData();
    fetchAppointments();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('AdminLogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigateToAppointmentScreen = (appointment) => {
    navigation.navigate('AppointmentsScreen', { appointment });
  };

  const renderHeader = () => (
    <>
      {therapistData && (
        <View style={styles.profile}>
          <Text style={styles.name}>{therapistData.name}</Text>
          <Text style={styles.info}>Specialization: {therapistData.specialization}</Text>
          <Text style={styles.info}>Email: {therapistData.email}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.manageSlotsButton}
        onPress={() => navigation.navigate('TimeSlotManagement')}
      >
        <Text style={styles.manageSlotsButtonText}>Manage Time Slots</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
    </>
  );

  const renderAppointment = ({ item }) => (
    <TouchableOpacity onPress={() => handleNavigateToAppointmentScreen(item)}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Date: {item.date}</Text>
        <Text style={styles.cardText}>Time: {item.time}</Text>
        <Text style={styles.cardText}>User: {item.userName}</Text>
        <Text style={styles.cardText}>Session Type: {item.sessionType}</Text>
        <Text style={styles.cardText}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderAppointment}
        ListEmptyComponent={<Text style={styles.noAppointments}>No upcoming appointments.</Text>}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  profile: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  manageSlotsButton: {
    backgroundColor: '#81C784',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  manageSlotsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F44336',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TherapistDashboardScreen;
