import { Platform } from 'react-native';
import * as Application from 'expo-application';

interface FocusServiceState {
  isFocusModeEnabled: boolean;
  hasPermissions: boolean;
}

class FocusService {
  private state: FocusServiceState = {
    isFocusModeEnabled: false,
    hasPermissions: false,
  };

  private listeners: Set<(state: FocusServiceState) => void> = new Set();

  constructor() {
    // Initialize the service
    this.checkPermissions();
  }

  private async checkPermissions(): Promise<void> {
    // In a real implementation, this would check actual permissions
    // For now, we'll just simulate it
    this.state.hasPermissions = true;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: FocusServiceState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setFocusModeEnabled(enabled: boolean): void {
    if (!this.state.hasPermissions) {
      console.warn('Cannot enable focus mode without permissions');
      return;
    }
    this.state.isFocusModeEnabled = enabled;
    this.notifyListeners();
  }

  public getCurrentAppName(): string {
    // In a real implementation, this would get the actual foreground app name
    // For now, we'll just return the current app name
    return Platform.select({
      ios: Application.applicationName ?? 'Unknown App',
      android: Application.applicationName ?? 'Unknown App',
      default: 'Unknown App',
    });
  }

  public shouldShowOverlay(appName: string): boolean {
    // In a real implementation, this would check if the app is in the focus list
    // For now, we'll just return true if focus mode is enabled
    return this.state.isFocusModeEnabled && this.state.hasPermissions;
  }
}

export const focusService = new FocusService();
export type { FocusServiceState }; 