import React, { useState, useContext, useEffect } from 'react';
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
import { doc, updateDoc } from "firebase/firestore";

export default function EditJobScreen({ route, navigation }) {
  const { job } = route.params;
  const { user } = useContext(AuthContext);
  const employerId = job.userId;
  const [jobData, setJobData] = useState({
    title: '',
    location: '',
    salary: '',
    type: '',
    description: '',
    status: 'available',
  });

  // Check if current user is the job creator
  const isJobCreator = user && user.uid === employerId;

  useEffect(() => {
    // Populate form with existing job data
    if (job) {
      setJobData({
        title: job.title || '',
        location: job.location || '',
        salary: job.salary || '',
        type: job.type || '',
        description: job.description || '',
        status: job.status || 'available',
      });
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateJob = async () => {
    // Check if user has permission to edit this job
    if (!isJobCreator) {
      Alert.alert('Permission Denied', 'You can only edit jobs that you have posted.');
      return;
    }

    if (!jobData.title) {
      Alert.alert('Error', 'Please fill in at least the job title');
      return;
    }

    try {
      // Update the job listing in Firestore
      const jobRef = doc(db, "jobListings", job.id);
      await updateDoc(jobRef,  {
        title: jobData.title,
        location: jobData.location,
        salary: jobData.salary,
        type: jobData.type,
        description: jobData.description,
        status: jobData.status,
      });

      Alert.alert(
        'Success',
        'Job updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to job details with updated job data
              navigation.navigate('JobDetails', { 
                job: {
                  ...job,
                  ...jobData,
                  employerId
                }
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error updating job:", error);
      Alert.alert('Error', 'Failed to update job. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isJobCreator ? (
        <ScrollView style={styles.content}>
          <Text style={styles.title}>Edit Job</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Job Title *"
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
              placeholder="Job Description"
              value={jobData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateJob}>
              <Text style={styles.updateButtonText}>Update Job</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>
            You do not have permission to edit this job.
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
  updateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
