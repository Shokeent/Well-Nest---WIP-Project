import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { auth, db } from '../../utils/firebaseConfig';

const CreateTherapistScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');

  const handleSignUp = async () => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection('therapists').doc(user.uid).set({
        name,
        email,
        specialization,
        availability: [], 
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Therapist account created successfully!');
      navigation.navigate('AdminLogin'); 
    } catch (error) {
      console.error('Error creating therapist account:', error);
      Alert.alert('Sign Up Error', error.message);
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
        <Text style={styles.subtitle}>Therapist Sign Up Portal</Text>

        <View style={styles.form}>
          <Text style={styles.title}>Create Therapist Account</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
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
          <TextInput
            style={styles.input}
            placeholder="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('AdminLogin')}
          >
            <Text style={styles.linkText}>Already have an account? Login</Text>
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
    marginTop: 20,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default CreateTherapistScreen;
