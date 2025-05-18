import { auth } from '@/Firebase.Config';
import { Link, router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Email Sent', 
        'Password reset link sent to your email. Please check your inbox.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (error) {
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is invalid.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = 'An unexpected error occurred.';
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          autoCorrect={false}
        />

        {/* Reset Button */}
        <TouchableOpacity 
          style={[styles.resetButton, isLoading && styles.disabledButton]} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.resetButtonText}>SEND RESET LINK</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Log in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

// Reuse the same styles from LoginScreen for consistency
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F7F6ED',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    marginVertical: 40,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444444',
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    fontSize: 14,
  },
  resetButton: {
    backgroundColor: '#130160',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666666',
    fontSize: 14,
  },
  linkText: {
    color: '#0193FF',
    fontWeight: '500',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#999999',
    opacity: 0.7,
  },
});
