import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    console.log('Logging in with:', { email, password });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Welcome Back</Text>
        <Text style={styles.subheader}>Log in using your email and password.</Text>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter User Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />

        {/* Remember Me & Forgot Password */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, rememberMe && styles.checkedBox]} />
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
          <Link href="/forgot-password" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Forgot Password ?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>You don't have an account yet? </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F7F6ED', // 👈 Warm cream background for entire screen
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF', // Pure white form container
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333', // Dark gray text
  },
  subheader: {
    fontSize: 16,
    color: '#666666', // Medium gray text
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444444', // Slightly darker gray
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EEEEEE', // Light gray border
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#FFFFFF', // White input background
    color: '#333333', // Dark text
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC', // Light gray border
    marginRight: 8,
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#130160', // Orange accent color
    borderColor: '#130160',
  },
  rememberText: {
    color: '#555555', // Medium gray
  },
  linkText: {
    color: '#0193FF', // Orange accent color
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#130160', // Orange button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666666', // Medium gray
  },
});
