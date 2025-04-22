import {
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  Pressable,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useState, useEffect } from 'react';
import { colors } from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import Header from '../../components/Header';
import Card from '../../components/Card';
import FocusOverlay from '../components/FocusOverlay';
import { focusService, type FocusServiceState } from '../services/FocusService';

export default function FocusScreen() {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [hasAccessibilityPermission, setHasAccessibilityPermission] =
    useState(false);
  const [hasBatteryPermission, setHasBatteryPermission] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentAppName, setCurrentAppName] = useState('');

  useEffect(() => {
    const unsubscribe = focusService.subscribe((state: FocusServiceState) => {
      setFocusModeEnabled(state.isFocusModeEnabled);
    });

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && focusModeEnabled && hasAllPermissions()) {
      const appName = focusService.getCurrentAppName();
      if (focusService.shouldShowOverlay(appName)) {
        setCurrentAppName(appName);
        setShowOverlay(true);
      }
    }
  };

  const hasAllPermissions = () => {
    return hasAccessibilityPermission && hasBatteryPermission;
  };

  const requestAccessibilityPermission = () => {
    if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync(
        'android.settings.ACCESSIBILITY_SETTINGS'
      );
    }
  };

  const requestBatteryOptimizationPermission = () => {
    if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync(
        'android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS'
      );
    }
  };

  const handleFocusModeToggle = (value: boolean) => {
    if (value && !hasAllPermissions()) {
      return;
    }
    focusService.setFocusModeEnabled(value);
    setFocusModeEnabled(value);
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
    // Implement app closing logic here
  };

  const handleOverlayContinue = () => {
    setShowOverlay(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Focus Mode" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.mainCard}>
          <Text style={styles.cardTitle}>Eliminate Distractions</Text>
          <Text style={styles.cardDescription}>
            Enable Focus Mode to block distractions and stay in the zone.
          </Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Enable Focus Mode</Text>
            <Switch
              value={focusModeEnabled}
              onValueChange={handleFocusModeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>

        {(!hasAccessibilityPermission || !hasBatteryPermission) && (
          <Card style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={24} color="#FFB020" />
              <Text style={styles.warningTitle}>Missing Permissions</Text>
            </View>
            <Text style={styles.warningDescription}>
              {!hasAccessibilityPermission && !hasBatteryPermission
                ? 'Flow Focus needs accessibility and battery optimization permissions to work effectively.'
                : !hasAccessibilityPermission
                ? 'Flow Focus needs accessibility permission to work effectively.'
                : 'Flow Focus needs battery optimization permission to work effectively.'}
            </Text>

            {!hasAccessibilityPermission && (
              <Pressable
                style={styles.permissionButton}
                onPress={requestAccessibilityPermission}
              >
                <Text style={styles.permissionButtonText}>
                  Enable Accessibility Service
                </Text>
              </Pressable>
            )}

            {!hasBatteryPermission && (
              <Pressable
                style={styles.permissionButton}
                onPress={requestBatteryOptimizationPermission}
              >
                <Text style={styles.permissionButtonText}>
                  Allow Battery Optimization
                </Text>
              </Pressable>
            )}
          </Card>
        )}

        <Text style={styles.disclaimer}>
          Focus Mode helps you stay productive by minimizing distractions. When
          active, certain app features will be temporarily restricted.
        </Text>
      </ScrollView>

      {showOverlay && (
        <FocusOverlay
          appName={currentAppName}
          onClose={handleOverlayClose}
          onContinue={handleOverlayContinue}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  mainCard: {
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  warningCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFF8E6',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFB020',
    marginLeft: 8,
  },
  warningDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#FFB020',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
  },
});
