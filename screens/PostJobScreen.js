import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function PostJobScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [jobData, setJobData] = useState({
    title: '',
    location: '',
    salary: '',
    type: '',
    description: '',
    status: 'available',
  });

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handlePostJob = async () => {
    if (!jobData.title) {
      Alert.alert('Error', 'Please fill in at least the job title');
      return;
    }

    try {
      // Add the job listing to the jobListings collection
      await addDoc(collection(db, "jobListings"), {
        title: jobData.title,
        location: jobData.location,
        salary: jobData.salary,
        type: jobData.type,
        description: jobData.description,
        userId: user.uid,
        status: jobData.status,
      });

      Alert.alert(
        'Success',
        'Job posted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Error posting job:", error);
      Alert.alert('Error', 'Failed to post job. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {user && user.role === 'employer' ? (
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Post a New Job</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Job Title"
            value={jobData.title}
            onChangeText={(value) => handleInputChange('title', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Location"
            value={jobData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Salary Range"
            value={jobData.salary}
            onChangeText={(value) => handleInputChange('salary', value)}
          />


          <TextInput
            style={styles.input}
            placeholder="Job Type (Full-time, Part-time, etc.)"
            value={jobData.type}
            onChangeText={(value) => handleInputChange('type', value)}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Job Description (include Contact Details)"
            value={jobData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.postButton} onPress={handlePostJob}>
            <Text style={styles.postButtonText}>Post Job</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>
            You do not have permission to access this screen.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1CBCB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    paddingTop: 5,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 25,
  },
  postButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
