import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db } from './firebase';

const AddJobListing = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddJobListing = () => {
    db.collection('jobListings')
      .add({
        title,
        description,
      })
      .then(() => {
        setTitle('');
        setDescription('');
        console.log('Job listing added!');
      })
      .catch((error) => {
        console.error('Error adding job listing:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Job Listing</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add Job Listing" onPress={handleAddJobListing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AddJobListing;
