import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { colors } from '@/styles/colors';

interface FocusOverlayProps {
  appName: string;
  onClose: () => void;
  onContinue: () => void;
}

export default function FocusOverlay({
  appName,
  onClose,
  onContinue,
}: FocusOverlayProps) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.card}>
        <View style={styles.appIconContainer}>
          {/* App icon placeholder */}
          <View style={styles.appIcon} />
        </View>
        <Text style={styles.title}>
          Do you really need {appName} right now?
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close app</Text>
          </Pressable>
          <Pressable style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>Continue in app</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    alignItems: 'center',
  },
  appIconContainer: {
    marginBottom: 16,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  continueButtonText: {
    color: colors.textPrimary,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});
