import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';

const AdminLoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);

      navigation.navigate('TherapistTabs', {
        screen: 'Dashboard', // Ensure this matches the name in TherapistTabs
      });

      // navigation.navigate('TherapistDashboard'); // Navigate to the therapist dashboard after login
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.appTitle}>Welcome to Well Nest</Text>
        <Text style={styles.subtitle}>Therapist Login Portal</Text>

        <View style={styles.form}>
          <Text style={styles.title}>Login as Therapist</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Navigate to Therapist Signup */}
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('CreateTherapist')}
          >
            <Text style={styles.linkText}>Don't have an account? Create One</Text>
          </TouchableOpacity>

          {/* Navigate back to Auth Screen */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.backButtonText}>Not a Therapist? Log in here</Text>
          </TouchableOpacity>
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
    marginBottom: 10,
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
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    alignItems: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminLoginScreen;
