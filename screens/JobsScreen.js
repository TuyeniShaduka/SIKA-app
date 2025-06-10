import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function JobsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch job listings
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        setLoading(true);
        let q = query(collection(db, "jobListings"), where("status", "==", "available"));

        const querySnapshot = await getDocs(q);
        let listings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          userId: doc.data().userId,
        }));

        // Client-side filtering if search query exists
        if (debouncedSearchQuery) {
          const searchLower = debouncedSearchQuery.toLowerCase();
          listings = listings.filter(job =>
            job.title.toLowerCase().includes(searchLower) ||
            (job.description && job.description.toLowerCase().includes(searchLower))
          );
        }

        setJobs(listings);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        Alert.alert("Error", "Failed to load job listings");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchJobListings();
  }, [debouncedSearchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    setDebouncedSearchQuery(searchQuery.trim()); // This will trigger the useEffect
  };

const renderJob = ({ item }) => {
    return (
      <View style={styles.jobCard}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('JobDetails', { job: { ...item, employerId: item.userId } })}
        >
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobLocation}>{item.location}</Text>
          <View style={styles.jobDetails}>
            <Text style={styles.jobSalary}>{item.salary}</Text>
            <Text style={styles.jobType}>{item.type}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {loading && <ActivityIndicator size="small" color="#666" />}
        </View>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {debouncedSearchQuery ? "No jobs match your search" : "No jobs available"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1CBCB',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  jobCompany: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
});
