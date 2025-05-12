import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';

export default function DashboardScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Sequence animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Job Stats Cards Component (moved outside main return)
  const JobStatsCards = () => {
    return (
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        {['44.5k', '66.8k', '38.9k'].map((stat, index) => {
          const cardAnim = useRef(new Animated.Value(0)).current;
          
          useEffect(() => {
            Animated.spring(cardAnim, {
              toValue: 1,
              delay: index * 100,
              friction: 5,
              useNativeDriver: true,
            }).start();
          }, []);

          return (
            <Animated.View 
              key={index}
              style={[
                styles.statCard,
                { 
                  transform: [{ scale: cardAnim }],
                  opacity: cardAnim
                }
              ]}
            >
              <Text style={styles.statNumber}>{stat}</Text>
              <Text style={styles.statLabel}>
                {['Remote Job', 'Full Time', 'Freelance'][index]}
              </Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  };

  // Job Listings Component (moved outside main return)
  const JobListings = () => {
    return (
      <>
        {jobData.map((job, index) => {
          const jobAnim = useRef(new Animated.Value(0)).current;
          
          useEffect(() => {
            Animated.spring(jobAnim, {
              toValue: 1,
              delay: 300 + (index * 150),
              friction: 6,
              useNativeDriver: true,
            }).start();
          }, []);

          return (
            <Animated.View 
              key={index}
              style={[
                styles.jobCard,
                { 
                  transform: [{ translateY: jobAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  }) }],
                  opacity: jobAnim
                }
              ]}
            >
              <View style={styles.jobHeader}>
                {job.company && <Text style={styles.jobCompany}>{job.company}</Text>}
                <Text style={styles.jobTitle}>{job.title}</Text>
                {job.employer && <Text style={styles.jobEmployer}>{job.employer}</Text>}
                {job.location && <Text style={styles.jobLocation}>{job.location}</Text>}
                {job.salary && <Text style={styles.jobSalary}>{job.salary}</Text>}
                {job.type && <Text style={styles.jobType}>{job.type}</Text>}
                <TouchableOpacity style={styles.jobApplyButton}>
                  <Text style={styles.jobApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        })}
      </>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.screenContainer,
        { opacity: fadeAnim }
      ]}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Welcome Header - Animated */}
        <Animated.View style={[
          styles.headerContainer,
          { transform: [{ translateY: slideUpAnim }] }
        ]}>
          <Text style={styles.welcomeText}>Hello</Text>
          <Text style={styles.userName}>Lucas Kativa.</Text>
        </Animated.View>

        {/* Stats Banner - Animated */}
        <Animated.View style={[
          styles.statsBanner,
          { 
            transform: [{ translateY: slideUpAnim }, { scale: cardScale }],
            opacity: fadeAnim
          }
        ]}>
          <Text style={styles.statsText}>75% of our users find jobs</Text>
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* CTA Section - Animated */}
        <Animated.View style={{
          transform: [{ scale: cardScale }],
          opacity: fadeAnim
        }}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Find Your Job</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Job Stats Cards */}
        <JobStatsCards />

        {/* Recent Jobs Section */}
        <Animated.Text style={[
          styles.sectionTitle,
          { 
            transform: [{ translateY: slideUpAnim }],
            opacity: fadeAnim
          }
        ]}>
          Recent Job List
        </Animated.Text>

        {/* Job Listings */}
        <JobListings />
      </ScrollView>
    </Animated.View>
  );
}

// Sample job data
const jobData = [
  {
    company: 'MEA',
    title: 'Cleaner',
    employer: 'Meatco',
    location: 'Rundu, Namibia'
  },
  {
    salary: 'NS8K/Mo',
    title: 'Senior cleaner',
    type: 'Full time'
  }
];

// Complete StyleSheet
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F7F6ED',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#333333',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#130160',
  },
  statsBanner: {
    backgroundColor: '#130160',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statsText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
  },
  applyButton: {
    backgroundColor: '#0193FF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#130160',
    borderWidth: 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ctaText: {
    color: '#130160',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    color: '#130160',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  statLabel: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    marginBottom: 10,
  },
  jobCompany: {
    fontWeight: 'bold',
    color: '#130160',
    fontSize: 16,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 5,
  },
  jobEmployer: {
    color: '#666666',
    marginBottom: 5,
  },
  jobLocation: {
    color: '#666666',
    fontStyle: 'italic',
  },
  jobSalary: {
    color: '#0193FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  jobType: {
    color: '#666666',
    marginVertical: 5,
  },
  jobApplyButton: {
    backgroundColor: '#130160',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  jobApplyText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
 
