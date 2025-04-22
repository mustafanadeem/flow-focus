import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen4() {
  const router = useRouter();

  const finishOnboarding = () => {
    router.push('/(tabs)/achievements');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={finishOnboarding}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.title}>4 Permission Missing</Text>
          <Text style={styles.description}>
            Flow Focus requires android's permissions to provide you statistics
            and blocking features. We do not collect or share any personally
            identifiable information and take your privacy very seriously.
          </Text>

          <View style={styles.permissionsList}>
            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="time-outline" size={24} color="#000" />
                </View>
                <Text style={styles.permissionTitle}>
                  Access App Usage Data
                </Text>
              </View>
              <Text style={styles.permissionDescription}>
                Required to detect when a distracting app is opened to block it.
                Also used to track screen time.
              </Text>
              <TouchableOpacity style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>
                  Grant Permission ≫
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="layers-outline" size={24} color="#000" />
                </View>
                <Text style={styles.permissionTitle}>
                  Display Over Other Apps
                </Text>
              </View>
              <Text style={styles.permissionDescription}>
                Required to display a block screen over your distracting apps.
              </Text>
              <TouchableOpacity style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>
                  Grant Permission ≫
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="settings-outline" size={24} color="#000" />
                </View>
                <Text style={styles.permissionTitle}>
                  Accessibility Service
                </Text>
              </View>
              <Text style={styles.permissionDescription}>
                Required to access website usage and provide more reliable app
                blocking.
              </Text>
              <TouchableOpacity style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>Allow</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.permissionItem}>
              <View style={styles.permissionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="battery-charging-outline"
                    size={24}
                    color="#000"
                  />
                </View>
                <Text style={styles.permissionTitle}>
                  Ignore Battery Optimization
                </Text>
              </View>
              <Text style={styles.permissionDescription}>
                Required for Flow Focus to block apps without being disabled.
              </Text>
              <TouchableOpacity style={styles.permissionButton}>
                <Text style={styles.permissionButtonText}>
                  Grant Permission ≫
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    gap: 24,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 24,
  },
  permissionsList: {
    gap: 16,
  },
  permissionItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  permissionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  permissionButton: {
    backgroundColor: '#000',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
