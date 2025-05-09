import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    console.log('Password reset requested for:', email);
    // Add your password reset logic here
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Reset Password</Text>
        <Text style={styles.subheader}>Enter your email to receive a password reset link.</Text>

        {/* Email Input */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.resetButtonText}>SEND RESET LINK</Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Link href="/other-screen" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Log in</Text>
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
    backgroundColor: '#F7F6ED', // Warm cream background
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF', // White form container
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
    marginBottom: 30, // More space before button
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  resetButton: {
    backgroundColor: '#130160', // Dark blue button
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#666666', // Medium gray
  },
  linkText: {
    color: '#0193FF', // Blue link color
    fontWeight: '500',
  },
});