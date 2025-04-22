import { Platform, Linking } from 'react-native';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Device from 'expo-device';

class AppBlocker {
  private static instance: AppBlocker;
  private isBlockingEnabled: boolean = false;
  private blockedApps: string[] = [];

  private constructor() {}

  static getInstance(): AppBlocker {
    if (!AppBlocker.instance) {
      AppBlocker.instance = new AppBlocker();
    }
    return AppBlocker.instance;
  }

  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        // Check if we have overlay permission
        const packageName = Application.applicationId;
        if (Platform.Version >= 23 && packageName) {
          const hasOverlayPermission = await IntentLauncher.startActivityAsync(
            'android.settings.action.MANAGE_OVERLAY_PERMISSION',
            {
              data: `package:${packageName}`,
            }
          );

          // Check if we have usage stats permission
          const hasUsageStatsPermission = await IntentLauncher.startActivityAsync(
            'android.settings.action.USAGE_ACCESS_SETTINGS',
            {
              data: `package:${packageName}`,
            }
          );

          return hasOverlayPermission && hasUsageStatsPermission;
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
      }
    }
    return false;
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const packageName = Application.applicationId;
        if (Platform.Version >= 23 && packageName) {
          // Request overlay permission
          await IntentLauncher.startActivityAsync(
            'android.settings.action.MANAGE_OVERLAY_PERMISSION',
            {
              data: `package:${packageName}`,
            }
          );

          // Request usage stats permission
          await IntentLauncher.startActivityAsync(
            'android.settings.action.USAGE_ACCESS_SETTINGS',
            {
              data: `package:${packageName}`,
            }
          );

          // Check if permissions were granted
          return await this.checkPermissions();
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        return false;
      }
    }
    return false;
  }

  async enableBlocking(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        // Check if permissions are granted
        const hasPermissions = await this.checkPermissions();
        if (!hasPermissions) {
          return false;
        }

        this.isBlockingEnabled = true;
        return true;
      } catch (error) {
        console.error('Error enabling blocking:', error);
        return false;
      }
    }
    return false;
  }

  disableBlocking() {
    this.isBlockingEnabled = false;
  }

  isBlockingActive(): boolean {
    return this.isBlockingEnabled;
  }

  setBlockedApps(apps: string[]) {
    this.blockedApps = apps;
  }

  isAppBlocked(packageName: string): boolean {
    return this.isBlockingEnabled && this.blockedApps.includes(packageName);
  }
}

export default AppBlocker.getInstance(); 