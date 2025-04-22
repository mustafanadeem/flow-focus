import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/colors';
import { Ionicons } from '@expo/vector-icons';
import AppBlocker from '@/services/AppBlocker';

export default function BlockingScreen() {
  const handleDisableFocus = () => {
    AppBlocker.disableBlocking();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="lock-closed" size={64} color={colors.primary} />
        <Text style={styles.title}>App Blocked</Text>
        <Text style={styles.description}>
          This app is currently blocked by Flow Focus. Disable Focus Mode to access this app.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleDisableFocus}
        >
          <Text style={styles.buttonText}>Disable Focus Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
}); 