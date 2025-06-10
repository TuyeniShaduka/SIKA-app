import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { logout, userInfo, isLoading } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      // Reset navigation stack completely before navigating to Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', error.message || 'Unable to logout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const userEmail = userInfo?.email || 'Tuyeni Shaduka   ';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {userInfo?.photoURL ? (
            <Image 
              source={{ uri: userInfo.photoURL }} 
              style={styles.profileImage}
              resizeMode="cover"
              onError={() => console.log("Error loading profile image")}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitial}>
                {userEmail.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.email}>{userEmail}</Text>
          <View style={styles.userStatus}>
            <Text style={styles.statusText}>
              {userEmail !== 'No email available' 
                ? "Currently logged in" 
                : "Guest session"}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep your existing styles


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFFEE',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profilePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});