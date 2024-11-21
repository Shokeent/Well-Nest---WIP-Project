import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';

const TimeSlotManagementScreen = ({ navigation }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Authentication Error', 'Please log in again.');
          navigation.navigate('AdminLogin');
          return;
        }

        const doc = await db.collection('therapists').doc(user.uid).get();
        if (doc.exists) {
          setTimeSlots(doc.data().availability || []);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        Alert.alert('Error', 'Failed to fetch time slots.');
      }
    };

    fetchTimeSlots();
  }, [navigation]);

  const addTimeSlot = async () => {
    if (!newTimeSlot) {
      Alert.alert('Input Error', 'Please enter a valid time slot.');
      return;
    }

    try {
      const user = auth.currentUser;
      const updatedSlots = [...timeSlots, newTimeSlot];

      await db.collection('therapists').doc(user.uid).update({
        availability: updatedSlots,
      });

      setTimeSlots(updatedSlots);
      setNewTimeSlot('');
    } catch (error) {
      console.error('Error adding time slot:', error);
      Alert.alert('Error', 'Failed to add time slot.');
    }
  };

  const deleteTimeSlot = async (slot) => {
    try {
      const user = auth.currentUser;
      const updatedSlots = timeSlots.filter((item) => item !== slot);

      await db.collection('therapists').doc(user.uid).update({
        availability: updatedSlots,
      });

      setTimeSlots(updatedSlots);
    } catch (error) {
      console.error('Error deleting time slot:', error);
      Alert.alert('Error', 'Failed to delete time slot.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <FlatList
      data={timeSlots}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Manage Time Slots</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter time slot (e.g., 10:00 AM - 11:00 AM)"
              value={newTimeSlot}
              onChangeText={setNewTimeSlot}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTimeSlot}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.timeSlotRow}>
          <Text style={styles.timeSlotText}>{item}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTimeSlot(item)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyMessage}>No time slots added yet.</Text>}
      contentContainerStyle={styles.container}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4CAF50',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  timeSlotText: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#e57373',
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TimeSlotManagementScreen;
