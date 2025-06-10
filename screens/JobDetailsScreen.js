import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';

export default function JobDetailsScreen({ route, navigation }) {
  const { job } = route.params;
  const { user } = useContext(AuthContext);
  const employerId = job.userId;

  // Check if current user is the job creator and an employer
  const isJobCreator = user && user.uid === employerId && user.role === 'employer';

  const handleEdit = () => {
    navigation.navigate('EditJob', { job });
  };

  const handleDelete = async () => {
    // Only allow if user is the job creator and an employer
    if (!isJobCreator) {
      Alert.alert('Permission Denied', 'You can only delete jobs that you have posted.');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this job listing?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the job listing from the jobListings collection
              await deleteDoc(doc(db, "jobListings", job.id));
              Alert.alert('Success', 'Job deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting job:', error);
              Alert.alert('Error', 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            {isJobCreator && user.role === 'employer' && (
              <>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Ionicons name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={24} color="#ff3b30" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Job Info */}
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobLocation}>{job.location}</Text>
          <View style={styles.jobMeta}>
            <Text style={styles.jobSalary}>{job.salary}</Text>
            <Text style={styles.jobType}>{job.type}</Text>
          </View>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.description}>{job.description}</Text>
          {job.requirements && (
            <>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <Text style={styles.description}>{job.requirements}</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1CBCB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobInfo: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  jobCompany: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 16,
    color: '#888',
    marginBottom: 15,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  jobType: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
});
