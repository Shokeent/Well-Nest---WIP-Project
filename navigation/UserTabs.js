import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import navigators and screens
import HomeStack from './HomeStack';
import FavoritesScreen from '../screens/User/FavoritesScreen';
import UserProfileScreen from '../screens/User/UserProfileScreen';
import HistoryScreen from '../screens/User/HistoryScreen';

const Tab = createBottomTabNavigator();

const UserTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Favorites') {
          iconName = 'heart-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        } else if (route.name === 'History') {
          iconName = 'time-outline';
        }

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

export default UserTabs;
