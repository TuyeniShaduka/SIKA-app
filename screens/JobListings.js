import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, Alert } from "react-native";
import { db } from "../firebase";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const JobListings = () => {
  const [jobListings, setJobListings] = useState([]);
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        let q;

        if (searchQuery) {
          q = query(
            collection(db, "jobListings"),
            or(
              where("title", ">=", searchQuery),
              where("title", "<=", searchQuery + "\uf8ff"),
              where("company", ">=", searchQuery),
              where("company", "<=", searchQuery + "\uf8ff"),
              where("description", ">=", searchQuery),
              where("description", "<=", searchQuery + "\uf8ff")
            )
          );
        } else if (user && user.role === "employer") {
          // Fetch job listings for the employer
          q = query(
            collection(db, "jobListings"),
            where("userId", "==", user.uid)
          );
        } else {
          // Fetch all available job listings
          q = query(
            collection(db, "jobListings"),
            where("status", "==", "available")
          );
        }

        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setJobListings(listings);
      } catch (error) {
        console.error("Error fetching job listings:", error);
      }
    };

    fetchJobListings();
  }, [user, searchQuery]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Listings</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for jobs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={jobListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text>{item.company}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default JobListings;

