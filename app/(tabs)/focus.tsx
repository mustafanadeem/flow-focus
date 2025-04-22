import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Card from '@/components/Card';

export default function FocusScreen() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showBlockScreen, setShowBlockScreen] = useState(false);
  const [notificationsBlocked, setNotificationsBlocked] = useState(false);
  const [socialBlocked, setSocialBlocked] = useState(false);
  const [hideStats, setHideStats] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This would be replaced with actual app blocking logic
    if (isFocusMode) {
      // Start monitoring app usage
      // This is a placeholder for the actual implementation
      const interval = setInterval(() => {
        // Check if any blocked app is being used
        // If yes, show the block screen
        setShowBlockScreen(true);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isFocusMode]);

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
    if (!isFocusMode) {
      Alert.alert(
        'Focus Mode Enabled',
        'Your distracting apps will now be blocked. You can disable focus mode to use them again.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Focus Mode Disabled',
        'You can now access your apps again.',
        [{ text: 'OK' }]
      );
    }
  };

  const BlockScreen = () => (
    <Modal
      visible={showBlockScreen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowBlockScreen(false)}
    >
      <View style={styles.blockScreenContainer}>
        <View style={styles.blockScreenContent}>
          <Ionicons name="lock-closed" size={64} color="#000" />
          <Text style={styles.blockScreenTitle}>App Blocked</Text>
          <Text style={styles.blockScreenText}>
            This app is currently blocked by Flow Focus. Disable focus mode to use it.
          </Text>
          <TouchableOpacity
            style={styles.disableFocusButton}
            onPress={() => {
              setIsFocusMode(false);
              setShowBlockScreen(false);
            }}
          >
            <Text style={styles.disableFocusButtonText}>Disable Focus Mode</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Focus Mode" />
      
      <View style={styles.content}>
        <Text style={styles.description}>
          When enabled, Focus Mode will block distracting apps and help you stay productive.
        </Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="time-outline" size={24} color="#000" />
            <Text style={styles.featureText}>Pause before opening apps</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            <Text style={styles.featureText}>Get reminders to stay focused</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#000" />
            <Text style={styles.featureText}>Track your screen time</Text>
          </View>
        </View>
      </View>

      <BlockScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  featuresList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textPrimary,
  },
  blockScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockScreenContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  blockScreenTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  blockScreenText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  disableFocusButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  disableFocusButtonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});