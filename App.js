import React, { useEffect } from 'react';
import { StyleSheet, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import SignUpScreen from './SignupScreen';
import AuthScreen from './AuthScreen';
import TherapistListScreen from './TherapistListScreen';
import BookingScreen from './BookingScreen';
import ProfileScreen from './ProfileScreen';
import MapScreen from './MapScreen';
import { auth, db } from './firebaseConfig';

const Stack = createStackNavigator();

const App = () => {
  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      // Request permissions for push notifications
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
      
      // Get the Expo push token
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);

      // Save the token to Firestore for the current user
      const user = auth.currentUser;
      if (user) {
        await db.collection('users').doc(user.uid).update({
          pushToken: token,
        });
      }
    } else {
      // // Alert if not using a physical device
      // Alert.alert('Push Notifications', 'Must use a physical device for Push Notifications');
    }

    // Set notification channel for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  // Register for push notifications when the app loads
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Well Nest">
        <Stack.Screen name="Well Nest" component={AuthScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
        <Stack.Screen name="Home" component={TherapistListScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
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
