import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <Link href="/other-screen" asChild>
      <TouchableOpacity style={styles.container} activeOpacity={0.9}>
        {/* Custom Image */}
        <Image 
          source={require('@/assets/images/welcome-image.png')} 
          style={styles.image}
          resizeMode="contain"
        />
        
        {/* Welcome Text */}
        <Text style={styles.title}>SIKA</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#130160',
    padding: 20,
  },
  image: {
    width: '80%',
    height: 200,
    marginBottom: 40,
    maxWidth: 300,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});