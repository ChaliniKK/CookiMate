import { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase'; 
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '1034952464978-m0k1p6th6qpfjn871094egiq9mo2fojs.apps.googleusercontent.com',
    androidClientId: '1034952464978-vbbk2htt4omp04sn9o07q2h4tip3gm60.apps.googleusercontent.com',
    webClientId: '1034952464978-q5qrvmmbugj75m0e07s9q8vincr6upm7.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      
      // Sign in to Firebase with the Google Credential
      signInWithCredential(auth, credential)
        .then(() => {

          router.replace('/'); 
        })
        .catch((error) => {
          console.error("Google Login Error:", error);
          alert("Google Login failed!");
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.orText}>──── Or sign in with ────</Text>
      
      <TouchableOpacity 
        style={styles.googleButton} 
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Ionicons name="logo-google" size={20} color="black" style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  orText: {
    color: '#666',
    marginBottom: 15,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    height: 44,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 15,
  },
});