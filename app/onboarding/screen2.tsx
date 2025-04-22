import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen2() {
  const router = useRouter();

  const goToNextScreen = () => {
    router.push('./screen3');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/onboard2.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Let's get started</Text>
        <Text style={styles.subtitle}>
          First, we will start with the core feature —{'\n'}
          Pause Exercise
        </Text>
        <Text style={styles.description}>
          It helps preventing compulsive app{'\n'}
          opening and reducing undesired phone{'\n'}
          usage
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
