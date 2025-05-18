import { db } from '@/Firebase.Config';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

interface Job {
  id: string;
  title: string;
  company?: string;
  employer?: string;
  location?: string;
  salary?: string;
  type?: string;
  createdAt: any;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ remote: 0, fullTime: 0, freelance: 0 });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(20)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch job statistics
        const statsQuery = query(collection(db, 'jobStats'), limit(1));
        const statsSnapshot = await getDocs(statsQuery);
        if (!statsSnapshot.empty) {
          setStats(statsSnapshot.docs[0].data() as { remote: number; fullTime: number; freelance: number; });
        }

        // Fetch recent jobs
        const jobsQuery = query(
          collection(db, 'jobs'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(jobsQuery);
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Job));
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
        
        // Start animations after data loads
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
      }
    };

    fetchData();
  }, [cardScale, fadeAnim, slideUpAnim]);

  const JobStatsCards = () => {
    const statsData = [
      { value: stats.remote, label: 'Remote Job' },
      { value: stats.fullTime, label: 'Full Time' },
      { value: stats.freelance, label: 'Freelance' }
    ];

    return (
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        {statsData.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </Animated.View>
    );
  };

  const StatCard = ({ stat, index }: { stat: { value: number; label: string }; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        delay: index * 100,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }, [index, cardAnim]);

    return (
      <Animated.View
        style={[
          styles.statCard,
          {
            transform: [{ scale: cardAnim }],
            opacity: cardAnim
          }
        ]}
      >
        <Text style={styles.statNumber}>{stat.value.toLocaleString()}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </Animated.View>
    );
  };

  const JobListings = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#130160" style={{ marginTop: 20 }} />;
    }

    if (jobs.length === 0) {
      return (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>No jobs available at the moment</Text>
        </View>
      );
    }

    return (
      <>
        {jobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </>
    );
  };

  const JobCard = ({ job, index }: { job: Job; index: number }) => {
    const jobAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(jobAnim, {
        toValue: 1,
        delay: 300 + (index * 150),
        friction: 6,
        useNativeDriver: true,
      }).start();
    }, [index, jobAnim]);

    return (
      <Animated.View
        style={[
          styles.jobCard,
          {
            transform: [{
              translateY: jobAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }],
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
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Animated.View style={[
          styles.headerContainer,
          { transform: [{ translateY: slideUpAnim }] }
        ]}>
          <Text style={styles.welcomeText}>Hello</Text>
          <Text style={styles.userName}>{user?.displayName || 'User'}.</Text>
        </Animated.View>

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

        <Animated.View style={{
          transform: [{ scale: cardScale }],
          opacity: fadeAnim
        }}>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaText}>Find Your Job</Text>
          </TouchableOpacity>
        </Animated.View>

        <JobStatsCards />

        <Animated.Text style={[
          styles.sectionTitle,
          { 
            transform: [{ translateY: slideUpAnim }],
            opacity: fadeAnim
          }
        ]}>
          Recent Job List
        </Animated.Text>

        <JobListings />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F7F6ED', // Matching your warm cream background
  },
  contentContainer: {
    paddingBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    width: '30%',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#130160', // Dark blue primary color
  },
  statLabel: {
    fontSize: 14,
    color: '#666666', // Medium gray
  },
  noJobsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noJobsText: {
    fontSize: 16,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#130160',
    marginTop: 30,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ctaButton: {
    backgroundColor: '#130160', // Dark blue primary color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  applyButton: {
    backgroundColor: '#0193FF', // Blue accent color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    width: '80%',
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    padding: 15,
  },
  jobCompany: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#130160',
    marginBottom: 5,
  },
  jobEmployer: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0193FF', // Blue accent color
    marginBottom: 5,
  },
  jobType: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  jobApplyButton: {
    backgroundColor: '#130160',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  jobApplyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#130160',
  },
  userName: {
    fontSize: 24,
    color: '#130160',
  },
  statsBanner: {
    backgroundColor: '#130160',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  headerContainer: {
    padding: 20,
    alignItems: 'flex-start',
    marginTop: 20,
    width: '100%',
  },
});
