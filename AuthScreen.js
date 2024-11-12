import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { auth } from './firebaseConfig'; 
import { colors } from './colors';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigation.navigate('AppTabs'); // Navigate to the main app tabs after successful sign-in
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
      source={require('./assets/background.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.appTitle}>Welcome to              Well Nest</Text>
        <Text style={styles.subtitle}>Mental Health Counselling App</Text>
        
        <View style={styles.form}>
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
          
          <Text style={styles.link} onPress={() => navigation.navigate('Sign Up')}>
            Don't have an account? Sign Up
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4CAF50', 
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#81C784', 
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#D32F2F',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#4CAF50',
    textDecorationLine: 'underline',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AuthScreen;
