import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// screens
import TherapistDashboardScreen from '../screens/Therapist/TherapistDashboardScreen';
import AppointmentsScreen from '../screens/Therapist/AppointmentsScreen';
import TimeSlotManagementScreen from '../screens/Therapist/TimeSlotManagementScreen';
import SettingsScreen from '../screens/Therapist/SettingsScreen';

const Tab = createBottomTabNavigator();

const TherapistTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') iconName = 'home-outline';
        else if (route.name === 'Appointments') iconName = 'list-outline';
        else if (route.name === 'Time Slots') iconName = 'calendar-outline';
        else if (route.name === 'Settings') iconName = 'settings-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen
      name="Dashboard"
      component={TherapistDashboardScreen}
      options={{ headerShown: true }}
    />
    <Tab.Screen
      name="Appointments"
      component={AppointmentsScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Time Slots"
      component={TimeSlotManagementScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default TherapistTabs;
