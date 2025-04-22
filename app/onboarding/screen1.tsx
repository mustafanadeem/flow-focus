import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen1() {
  const router = useRouter();

  const goToNextScreen = () => {
    router.push('./screen2');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/onboard1.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          When it comes{'\n'}to digital usage,{'\n'}self-control is{'\n'}
          important.
        </Text>
        <Text style={styles.description}>
          Flow Focus will help you save time and{'\n'}prevent distracting phone
          usage.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
        <Text style={styles.buttonText}>Continue</Text>
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
