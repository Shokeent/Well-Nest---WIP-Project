import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// navigators
import UserTabs from './UserTabs'; 
import TherapistTabs from './TherapistTabs'; 
import TherapistStack from './TherapistStack'; 

// auth screens
import AuthScreen from '../screens/Auth/AuthScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import AdminLoginScreen from '../screens/Auth/AdminLoginScreen';
import CreateTherapistScreen from '../screens/Auth/CreateTherapistScreen';

// other screens
import TherapistDetailScreen from '../screens/User/TherapistDetailScreen'; 
import BookingScreen from '../screens/User/BookingScreen'; 
import MapScreen from '../screens/User/MapScreen'; 
import AppointmentsScreen from '../screens/Therapist/AppointmentsScreen';
const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth">
      {/* Authentication Screens */}
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          title: 'Sign Up',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="AdminLogin"
        component={AdminLoginScreen}
        options={{
          title: 'Therapist Login',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerLeft: null,
        }}
      />
      <Stack.Screen
        name="CreateTherapist"
        component={CreateTherapistScreen}
        options={{
          title: 'Create Therapist Account',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      />

      {/* User Navigation */}
      <Stack.Screen
        name="AppTabs"
        component={UserTabs}
        options={{
          headerShown: false,
        }}
      />

      {/* Therapist Navigation */}
      <Stack.Screen
        name="TherapistTabs"
        component={TherapistTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TherapistStack"
        component={TherapistStack}
        options={{
          headerShown: true,
        }}
      />

      {/* Other Screens */}
      <Stack.Screen
        name="TherapistDetail"
        component={TherapistDetailScreen}
        options={{
          title: 'Therapist Details',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          title: 'Book Appointment',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Map',
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      />

      <Stack.Screen
  name="AppointmentsScreen"
  component={AppointmentsScreen}
  options={{
    title: 'Appointments',
    headerStyle: { backgroundColor: '#4CAF50' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
  }}
/>
    </Stack.Navigator>
    
  </NavigationContainer>
);

export default AppNavigator;
