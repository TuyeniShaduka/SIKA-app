import React, { useState, useContext } from 'react';
import {
  View, Alert,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to SIKA!</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#007AFF' }}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1CBCB',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
    color: '#999',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
