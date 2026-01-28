import { View, Text, StyleSheet } from 'react-native';

export default function ConverterPage() {
  return (
    <View style={styles.innerContainer}>
      <Text style={styles.text}>This is the converter page</Text>
      {/* You can add your unit conversion logic here later! */}
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