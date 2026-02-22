import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, TouchableOpacity, FlatList, Dimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

export default function CommunityUserProfile() {
  const { CommunityUserid } = useLocalSearchParams();
  const router = useRouter();

  const user = {
    name: CommunityUserid || "Guest Cook",
    handle: `@${CommunityUserid?.toString().toLowerCase().replace(/\s/g, '') || 'user'}`,
    bio: "Passionate home cook!",
    stats: { recipes: 24, followers: "1.2k", following: 150 },
    posts: [
      { id: '1', uri: 'https://www.halfbakedharvest.com/wp-content/uploads/2024/04/30-Minute-Honey-Garlic-Chicken-1.jpg' },
      { id: '2', uri: 'https://www.eatingwell.com/thmb/S2NGMEcgm11dtdBJ6Hwprwq-nVk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/eat-the-rainbow-chopped-salad-with-basil-mozzarella-beauty-185-278133-4000x2700-56879ac756cd46ea97944768847b7ea5.jpg' },
      { id: '3', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9TF3SqH4Bd9ubQzSBzTES6w1zoMH6-3nR9w&s' },
      { id: '4', uri: 'https://hips.hearstapps.com/hmg-prod/images/chocolate-pie-cookies-lead-66fc19fe1abd1.jpg?crop=0.6666666666666667xw:1xh;center,top' },
      { id: '5', uri: 'https://www.happyfoodstube.com/wp-content/uploads/2018/08/raspberry-oreo-no-bake-dessert-image-500x500.jpg' },
      { id: '6', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM6wseYxMw4o2bGtI1H54AT903NIK3BgTMJQ&s' },
    ]
  };

  const ProfileHeader = () => (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Back</Text>
      </Pressable>

      <Image 
        source={{ uri: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-unknown-social-media-user-photo-default-avatar-profile-icon-vector-unknown-social-media-user-184816085.jpg" }} 
        style={styles.profileAvatar}
      />

      <Text style={styles.userNameText}>{user.name}</Text>
      <Text style={styles.handleText}>{user.handle}</Text>
      <Text style={styles.idText}>ID: {CommunityUserid}</Text>
      
      <Text style={styles.bioText}>{user.bio}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.recipes}</Text>
          <Text style={styles.statLabel}>Recipes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.followers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.stats.following}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <Pressable style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={user.posts}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        ListHeaderComponent={ProfileHeader}
        renderItem={({ item }) => (
          <View style={styles.postImageContainer}>
            <Image 
              source={{ uri: item.uri }} 
              style={styles.postImage} 
            />
          </View>
        )}
      />      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  backBtn: {
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#B86D2A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  userNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1919',
  },
  handleText: {
    color: 'gray',
    fontSize: 14,
  },
  idText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  bioText: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#444',
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
  followButton: {
    backgroundColor: '#612D25',
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  followButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImageContainer: {
    padding: 1, 
  },
  postImage: {
    width: IMAGE_SIZE - 2,
    height: IMAGE_SIZE - 2,
  },
});