import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground, Alert, SafeAreaView } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';
import { colors } from '../../utils/colors';

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
      <ImageBackground
        source={require('../../assets/background.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            renderItem={renderAppointment}
            ListEmptyComponent={<Text style={styles.noAppointments}>No upcoming appointments.</Text>}
            contentContainerStyle={styles.container}
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
    padding: 20,
  },
  container: {
    paddingBottom: 20,
  },
  profile: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: colors.accent,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  info: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
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
    borderRadius: 8,
    elevation: 1,
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
    marginTop: 20,
  },
  manageSlotsButton: {
    backgroundColor: colors.secondary,
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
});

export default TherapistDashboardScreen;
