import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing
} from "react-native";
import { globalStyle } from "../globalStyleSheet.style";

const { width } = Dimensions.get("window");

// --- DATA ---
const COMMUNITY_FEED = [
  {
    postId: "p_001",
    userName: "wenuka",
    userProfilePic: "https://res.cloudinary.com/cookimate-images/image/upload/v1770965637/profile_pic3_jgp0tk.png",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
    caption: "Secret family lasagna recipe! 🍝 #cooking #chef",
    likes: 124,
    comments: [
      { commentId: "c_001", userName: "BakerJane", text: "Looks delicious!" },
      { commentId: "c_002", userName: "SpicySam", text: "Needs more garlic!" },
       { commentId: "c_003", userName: "BakerJane", text: "Looks delicious!" },
       { commentId: "c_004", userName: "SpicySam", text: "Needs more garlic!" },
       
    ],
  },
  {
    postId: "p_002",
    userName: "kithnula",
    userProfilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    caption: "Fresh sourdough right out of the oven. 🥖",
    likes: 89,
    comments: [],
  },
];

const User_info = [
  { firebaseUid: "uid_1", username: "chef_mario", profilePic: "https://res.cloudinary.com/cookimate-images/image/upload/v1770965637/profile_pic3_jgp0tk.png" },
  { firebaseUid: "uid_2", username: "baker_jane", profilePic: "https://randomuser.me/api/portraits/women/1.jpg" },
  { firebaseUid: "uid_3", username: "healthy_eats", profilePic: "https://randomuser.me/api/portraits/men/44.jpg" },
];

// --- SUB-COMPONENT: POST CARD ---
const PostCard = ({ item }) => {
  const [showComments, setShowComments] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Animation logic
  const animatedValue = useRef(new Animated.Value(0)).current;
  const hasComments = item.comments && item.comments.length > 0;

  useEffect(() => {
    if (showComments) {
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [showComments]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0], 
  });

  return (
    <View style={styles.cardContainer}>
      
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => hasComments && setShowComments(!showComments)}
      >
        <Image source={{ uri: item.image }} style={styles.postImage} />
        
        <TouchableOpacity style={styles.followBtn} onPress={() => alert('Followed!')}>
          <Text style={styles.followBtnText}>Follow</Text>
        </TouchableOpacity>

        {/* Animated Floating Comments Overlay */}
        {showComments && hasComments && (
          <Animated.View 
            style={[
              styles.floatingComments, 
              { 
                opacity: animatedValue, 
                transform: [{ translateY }] 
              }
            ]}
          >
            <Text style={styles.floatingHeader}>Tap image to hide</Text>
            {item.comments.map((c) => (
              <View key={c.commentId} style={styles.individualCommentBubble}>
                <Text style={styles.commentUser}>@{c.userName}</Text>
                <Text style={styles.commentTextContent}>{c.text}</Text>
              </View>
            ))}
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* 2. User Info & Comment Toggle Row */}
      <View style={styles.cardHeaderRow}>
        <View style={styles.userInfoSmall}>
          <Image source={{ uri: item.userProfilePic }} style={styles.miniProfilePic} />
          <Text style={styles.userNameText}>{item.userName}</Text>
        </View>

        <TouchableOpacity onPress={() => setIsCommenting(!isCommenting)}>
          <Text style={[styles.commentBtnIcon, { color: '#da883b', fontWeight: 'bold' }]}>
            {isCommenting ? "Back" : "Add comment"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 3. Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.captionText}>{item.caption}</Text>
      </View>

      {/* 4. Conditional Comment Input */}
      {isCommenting && (
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.inputBox}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            autoFocus
          />
          <TouchableOpacity onPress={() => {
            alert(`Commented: ${commentText}`);
            setIsCommenting(false);
            setCommentText("");
          }}>
            <Text style={styles.postBtnText}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- MAIN PAGE ---
const CommunityFeedCards = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 0) {
      const results = User_info.filter((user) =>
        user.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[globalStyle.container, styles.container]}
    >
      <View style={styles.searchAndAddContainer}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={search}
            placeholderTextColor="#999"
            onChangeText={handleSearch}
          />
          {filteredUsers.length > 0 && (
            <View style={styles.dropdown}>
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.firebaseUid}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSearch("");
                      setFilteredUsers([]);
                      router.push(`/Community/${item.username}`);
                    }}
                  >
                    <View style={styles.userInfoRow}>
                      <Image source={{ uri: item.profilePic }} style={styles.profileThumbnail} />
                      <Text style={styles.itemText}>{item.username}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => alert("Navigate to Add Post")}>
          <Text style={styles.addButtonText}>Add post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={COMMUNITY_FEED}
        keyExtractor={(item) => item.postId}
        renderItem={({ item }) => <PostCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </KeyboardAvoidingView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 15, 
    marginTop: 10, 
    backgroundColor: "#f5f5f5" 
  },
  searchAndAddContainer: { 
    flexDirection: "row", 
    gap: 10, 
    zIndex: 10, 
    marginBottom: 20 
  },
  searchSection: { 
    flex: 3.5, 
    position: "relative" 
  },
  addButton: { 
    flex: 1, 
    height: 50, 
    backgroundColor: "#9ada3b", 
    borderRadius: 12, 
    justifyContent: "center", 
    alignItems: "center", 
    elevation: 3 
  },
  addButtonText: { 
    color: "#3f3b3b", 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
  searchInput: { 
    height: 50, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    borderWidth: 1, 
    borderColor: "#eee" 
  },
  cardContainer: {
    backgroundColor: "#fff", 
    borderRadius: 20, 
    marginBottom: 25, 
    overflow: "hidden", 
    elevation: 5, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8,
  },
  postImage: { 
    width: "100%", 
    height: 320 
  },
  followBtn: {
    position: "absolute", 
    top: 15, 
    right: 15, 
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 18, 
    paddingVertical: 6, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.3)'
  },
  followBtnText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 12 
  },
  
  // Animated Comments UI
  floatingComments: {
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)", 
    padding: 15,
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    maxHeight: 250,
  },
  floatingHeader: {
    color: '#9ada3b', 
    fontSize: 10, 
    fontWeight: '800', 
    textAlign: 'center',
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 12 
  },
  individualCommentBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.95)", 
    borderRadius: 15,
    borderTopLeftRadius: 4, 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    marginBottom: 8, 
    alignSelf: 'flex-start', 
    maxWidth: '85%',
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2, 
    shadowRadius: 2,
  },
  commentUser: { 
    fontSize: 11, 
    fontWeight: "bold", 
    color: "#f77829", 
    marginBottom: 2 
  },
  commentTextContent: { 
    fontSize: 13, 
    color: "#333", 
    lineHeight: 16 
  },

  cardHeaderRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 12 
  },
  userInfoSmall: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  miniProfilePic: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    marginRight: 10, 
    borderWidth: 2, 
    borderColor: '#ea390c' 
  },
  userNameText: { 
    fontWeight: "700", 
    fontSize: 15, 
    color: '#222' 
  },
  commentBtnIcon: { 
    fontSize: 13 
  },
  captionContainer: { 
    paddingHorizontal: 12, 
    paddingBottom: 15 
  },
  captionText: { 
    fontSize: 14, 
    color: "#555", 
    lineHeight: 18 
  },
  commentInputRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 12, 
    borderTopWidth: 1, 
    borderTopColor: "#f0f0f0" 
  },
  inputBox: { 
    flex: 1, 
    height: 40, 
    backgroundColor: "#f0f0f0", 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    marginRight: 10 
  },
  postBtnText: { 
    color: "#da8d3b", 
    fontWeight: "800" 
  },

  dropdown: { 
    position: "absolute", 
    top: 55, 
    left: 0, 
    right: 0, 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    elevation: 10, 
    zIndex: 100, 
    maxHeight: 250, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  dropdownItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#f9f9f9" 
  },
  userInfoRow: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  profileThumbnail: { 
    width: 35, 
    height: 35, 
    borderRadius: 17.5, 
    marginRight: 12 
  },
  itemText: { 
    fontSize: 16, 
    color: "#333", 
    fontWeight: '500' 
  },
});

export default CommunityFeedCards;