import { View, Text, StyleSheet } from 'react-native';

export default function TimerPage() {
  return (
    <View style={styles.innerContainer}>
      <Text style={styles.text}>This is the timer page</Text>
      {/* You can add your actual timer logic here later! */}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});