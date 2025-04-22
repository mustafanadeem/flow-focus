import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/styles/colors';
import Header from '@/components/Header';
import AppBlocker from '@/services/AppBlocker';

export default function PermissionsScreen() {
  const handleRequestPermissions = async () => {
    const granted = await AppBlocker.requestPermissions();
    if (granted) {
      router.back();
    } else {
      Alert.alert(
        'Permissions Required',
        'Flow Focus needs these permissions to work properly. Please grant them in your device settings.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              // Open device settings
              // Note: You'll need to implement this based on your platform
              // For Android, you can use Linking.openSettings()
              // For iOS, you can use Linking.openURL('app-settings:')
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Permissions" />
      <View style={styles.content}>
        <Text style={styles.title}>Required Permissions</Text>
        <Text style={styles.description}>
          Flow Focus needs the following permissions to block distracting apps:
        </Text>
        <View style={styles.permissionList}>
          <Text style={styles.permissionItem}>• Overlay Permission</Text>
          <Text style={styles.permissionItem}>• Usage Stats Permission</Text>
        </View>
        <Button
          title="Grant Permissions"
          onPress={handleRequestPermissions}
          color={colors.primary}
        />
      </View>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  permissionList: {
    marginBottom: 32,
  },
  permissionItem: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 8,
  },
});
