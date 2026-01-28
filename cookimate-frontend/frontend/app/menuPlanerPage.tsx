import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function MenuPlannerPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Menu Planner page</Text>
      
      {/* Link back Home */}
      <Link href="/" style={styles.link}>
        Back to Home Page
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  link: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});