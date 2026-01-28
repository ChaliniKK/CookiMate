import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Login Page</Text>
      
      <View style={styles.navContainer}>
        {/* Link to Signup */}
        <Link href="/signupPage" style={styles.link}>
          Don't have an account? Sign up
        </Link>
        
        {/* Link back Home */}
        <Link href="/" style={styles.homeLink}>
          Back to Home Page
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  navContainer: {
    alignItems: 'center',
    gap: 20,
  },
  link: {
    color: 'blue',
    fontSize: 16,
  },
  homeLink: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
  },
});