import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Home Page</Text>
      
      <View style={styles.navContainer}>
        {/* Matches loginPage.tsx */}
        <Link href="/loginPage" style={styles.link}>Go to Login</Link>
        
        {/* Matches app/tools/index.tsx */}
        <Link href="/tools" style={styles.link}>Go to Tools</Link>
        
        {/* Matches menuPlanerPage.tsx (Note the single 'n') */}
        <Link href="/menuPlanerPage" style={styles.link}>Go to Menu Planner</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  navContainer: { gap: 15 },
  link: { fontSize: 18, color: 'blue', textDecorationLine: 'underline' },
});