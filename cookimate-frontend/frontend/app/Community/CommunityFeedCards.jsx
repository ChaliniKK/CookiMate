import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';

//fake data to test the front-end 
const COMMUNITY_FEED = [
  {
    postId: 'p_001',      // Unique ID for the post
    userId: 'u_101',      
    userName: 'wenuka', 
    image: 'https://example.com/pasta.jpg',
    caption: 'Secret family lasagna recipe! 🍝',
    likes: 124,
    comments: [
      { 
        commentId: 'c_001', 
        userId: 'u_102', 
        userName: 'BakerJane', 
        text: 'Looks delicious!' 
      },
      { 
        commentId: 'c_002', 
        userId: 'u_104', 
        userName: 'SpicySam', 
        text: 'Needs more garlic!' 
      }
    ]
  },
  {
    postId: 'p_002',
    userId: 'u_102',
    userName: 'kithnula',
    image: 'https://example.com/bread.jpg',
    caption: 'Fresh sourdough right out of the oven. 🥖',
    likes: 89,
    comments: []
  }
];

const CommunityFeedCards = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
 
 
  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 0) {
      const results = COMMUNITY_FEED.filter(user => 
        user.userName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  };



  return (
    <View style={styles.container}>
      
     
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={search}
          onChangeText={handleSearch}
        />
        
       
        {filteredUsers.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSearch(''); 
                    setFilteredUsers([]);
                    router.push(`/Community/${item.userName}`);
                  }}
                >
                

                
                  <Text style={styles.itemText}>{item.userName}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

     

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 50,
    backgroundColor: '#f5f5f5',
  },
  searchSection: {
    zIndex: 10, // Keeps the dropdown on top of everything
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdown: {
    position: 'absolute', // Makes it "float"
    top: 55,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  
});

export default CommunityFeedCards;