import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import TherapistListScreen from '../screens/User/TherapistListScreen';
import TherapistDetailScreen from '../screens/User/TherapistDetailScreen';
import BookingScreen from '../screens/User/BookingScreen';
import MapScreen from '../screens/User/MapScreen';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    {/* Therapist List Screen */}
    <Stack.Screen
      name="TherapistList"
      component={TherapistListScreen}
      options={{
        title: 'Therapists', 
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff', 
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18, 
        },
        headerLeft: () => null
      }}
    />

    {/* Therapist Detail Screen */}
    <Stack.Screen
      name="TherapistDetail"
      component={TherapistDetailScreen}
      options={{
        title: 'Therapist Details',
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    />

    {/* Booking Screen */}
    <Stack.Screen
      name="Booking"
      component={BookingScreen}
      options={{
        title: 'Book Appointment',
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    />

    {/* Map Screen */}
    <Stack.Screen
      name="Map"
      component={MapScreen}
      options={{
        title: 'Location',
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    />
  </Stack.Navigator>
);

export default HomeStack;
