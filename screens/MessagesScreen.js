import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen() {
  const messages = [
    {
      id: 1,
      name: 'John Developer',
      lastMessage: 'Hi, I\'m interested in your job posting...',
      timestamp: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      name: 'Sarah Designer',
      lastMessage: 'Thank you for considering my application.',
      timestamp: '1 day ago',
      unread: false,
    },
    {
      id: 3,
      name: 'Mike Writer',
      lastMessage: 'When can we schedule a call?',
      timestamp: '3 days ago',
      unread: false,
    },
  ];

  const renderMessage = ({ item }) => (
    <TouchableOpacity style={styles.messageItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1CBCB',
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
});