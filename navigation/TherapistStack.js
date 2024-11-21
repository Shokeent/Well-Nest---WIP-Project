import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import therapist-specific screens
import TherapistDashboardScreen from '../screens/Therapist/TherapistDashboardScreen';
import TimeSlotManagementScreen from '../screens/Therapist/TimeSlotManagementScreen';
import AppointmentsScreen from '../screens/Therapist/AppointmentsScreen';
import SettingsScreen from '../screens/Therapist/SettingsScreen';

const Stack = createStackNavigator();

const TherapistStack = () => (
  <Stack.Navigator>
    {/* Therapist Dashboard */}
    <Stack.Screen
      name="TherapistDashboard"
      component={TherapistDashboardScreen}
      options={{
        title: 'Dashboard',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    />

    {/* Time Slot Management */}
    <Stack.Screen
      name="TimeSlotManagement"
      component={TimeSlotManagementScreen}
      options={{
        title: 'Manage Time Slots',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    />

    {/* Appointments */}
    <Stack.Screen
      name="Appointments"
      component={AppointmentsScreen}
      options={{
        title: 'Appointments',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    />

    {/* Settings */}
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        title: 'Settings',
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      }}
    />
  </Stack.Navigator>
);

export default TherapistStack;
