import React, { useEffect } from 'react';
import { StyleSheet, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

import SignUpScreen from './SignupScreen';
import AuthScreen from './AuthScreen';
import TherapistListScreen from './TherapistListScreen';
import BookingScreen from './BookingScreen';
import TherapistDetailScreen from './TherapistDetailScreen';
import UserProfileScreen from './UserProfileScreen';
import MapScreen from './MapScreen';
import FavoritesScreen from './FavoritesScreen';
import HistoryScreen from './HistoryScreen';
import AdminLoginScreen from './AdminLoginScreen';
import CreateTherapistScreen from './CreateTherapistScreen'; 
import { auth, db } from './firebaseConfig';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerBackTitleVisible: false }}>
    <Stack.Screen 
      name="Therapists" 
      component={TherapistListScreen} 
      options={{ title: 'Therapists' }} 
    />
    <Stack.Screen 
      name="TherapistDetail" 
      component={TherapistDetailScreen} 
      options={{ title: 'Therapist Details' }} 
    />
    <Stack.Screen name="Booking" component={BookingScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home-outline';
        else if (route.name === 'Favorites') iconName = 'heart-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';
        else if (route.name === 'History') iconName = 'time-outline';

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4CAF50',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
    <Tab.Screen name="Profile" component={UserProfileScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
  </Tab.Navigator>
);

const App = () => {
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Permission denied', 'Failed to get push token for push notifications!');
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Push token:', token);

        const user = auth.currentUser;
        if (user) {
          await db.collection('users').doc(user.uid).update({
            pushToken: token,
          });
        }
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
        {/* User and Therapist Authentication */}
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        
        {/* Therapist Admin Flow */}
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="CreateTherapist" component={CreateTherapistScreen} />

        {/* User App Flow */}
        <Stack.Screen name="AppTabs" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
