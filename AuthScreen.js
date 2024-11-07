// AuthScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { auth } from './firebaseConfig'; // Ensure this points to your firebase configuration file
import { colors } from './colors'; // Ensure this points to your colors file

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate('Home'); // Navigate to home after successful sign-in
    } catch (error) {
      let customErrorMessage = "";
      switch (error.code) {
        case "auth/user-not-found":
          customErrorMessage = "No account found with this email. Please sign up.";
          break;
        case "auth/wrong-password":
          customErrorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          customErrorMessage = "Please enter a valid email address.";
          break;
        default:
          customErrorMessage = "An unexpected error occurred. Please try again.";
      }
      setErrorMessage(customErrorMessage);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')} // You can replace with your own background image
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Title/Heading */}
        <Text style={styles.appTitle}>Welcome To       Well Nest</Text>
        <Text style={styles.subtitle}>Mental Health Counselling App</Text>
        
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up navigation link */}
        <Text style={styles.link} onPress={() => navigation.navigate('Sign Up')}>
          Don't have an account? Sign Up
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'up',
    padding: 1,
   
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slight transparency with white background to help green pop
    borderRadius: 10,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50', // Healing green color for the title
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#81C784', // A lighter shade of green for the subtitle
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#388E3C', // Slightly darker shade of green for the sign-in title
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#A5D6A7', // Lighter green border for inputs
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff', // Light green background for inputs
  },
  error: {
    color: '#D32F2F', // Error text in red to stand out
    marginBottom: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50', // Main healing green color for the button
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 12,
    color: '#4CAF50', // Green color for the link
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default AuthScreen;
