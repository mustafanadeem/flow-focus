import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen3() {
  const router = useRouter();

  const goToNextScreen = () => {
    router.push('./screen4');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/onboard3.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          How Pause Exercise{'\n'}
          works:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>
            —Flow Focus helps you take pause before{'\n'}
            opening an app.
          </Text>
          <Text style={styles.bulletPoint}>
            —Take your time to reflect on whether{'\n'}
            you really want to open it.
          </Text>
          <Text style={styles.bulletPoint}>
            —Close the app or continue using it
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={goToNextScreen}>
        <Text style={styles.buttonText}>Next</Text>
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
  bulletPoints: {
    alignSelf: 'flex-start',
    gap: 20,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
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
