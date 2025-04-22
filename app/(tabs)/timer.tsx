import React, {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Check,
  X,
} from 'lucide-react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import Header from '@/components/Header';
import TimerSettings from '@/components/TimerSettings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emitSessionUpdated } from '@/lib/eventEmitter';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${minutes}m`;
};

export default function TimerScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [showSettings, setShowSettings] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [wasRunning, setWasRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState<
    'Focus' | 'Break' | 'Long Break'
  >('Focus');
  const [elapsedTime, setElapsedTime] = useState(0);

  const circumference = 2 * Math.PI * 120;
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - progress.value),
    };
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    progress.value = withTiming(1 - time / (focusDuration * 60), {
      duration: 300,
    });
  }, [time, focusDuration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const saveSession = async (duration: number) => {
    try {
      const session = {
        id: Math.random().toString(36).substr(2, 9),
        type: sessionType,
        duration: duration,
        created_at: new Date().toISOString(),
      };

      const existingSessions = await AsyncStorage.getItem('sessions');
      const sessions = existingSessions ? JSON.parse(existingSessions) : [];

      sessions.unshift(session);

      await AsyncStorage.setItem('sessions', JSON.stringify(sessions));
      emitSessionUpdated();
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save your session');
    }
  };

  const handleSessionComplete = async () => {
    if (elapsedTime > 0) {
      await saveSession(elapsedTime);
    }
    setElapsedTime(0);
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(focusDuration * 60);
    setElapsedTime(0);
    setIsPaused(false);
  };

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      setIsPaused(true);
    } else {
      setIsRunning(true);
    }
  };

  const handlePausedSession = async (shouldSave: boolean) => {
    if (shouldSave && elapsedTime > 0) {
      await saveSession(elapsedTime);
    }
    handleReset();
  };

  const handleSettingsPress = useCallback(() => {
    if (!showSettings) {
      // Store current running state before opening settings
      setWasRunning(isRunning);
      setIsRunning(false);
    }
    setShowSettings(!showSettings);
  }, [showSettings, isRunning]);

  const handleSettingsClose = useCallback(() => {
    setShowSettings(false);
    // Restore previous running state if it was running
    if (wasRunning) {
      setIsRunning(true);
    }
  }, [wasRunning]);

  const applySettings = (
    focus: number,
    shortBreak: number,
    longBreak: number
  ) => {
    setFocusDuration(focus);
    setShortBreakDuration(shortBreak);
    setLongBreakDuration(longBreak);
    setTime(focus * 60);
    handleSettingsClose();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Pomodoro Timer" />

      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <Svg width={280} height={280} viewBox="0 0 280 280">
            {/* Background Circle */}
            <Circle
              cx="140"
              cy="140"
              r="120"
              stroke={colors.border}
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx="140"
              cy="140"
              r="120"
              stroke={colors.primary}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </Svg>

          <View style={styles.timerTextContainer}>
            <Text style={styles.timerText}>{formatTime(time)}</Text>
            <Text style={styles.timerLabel}>
              {isRunning ? 'Focus Time' : isPaused ? 'Paused' : 'Ready?'}
            </Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {isPaused ? (
            <>
              <Pressable
                style={[styles.iconButton, { backgroundColor: colors.success }]}
                onPress={() => handlePausedSession(true)}
              >
                <Check size={24} color="#fff" />
              </Pressable>

              <Pressable
                style={[styles.iconButton, { backgroundColor: colors.error }]}
                onPress={() => handlePausedSession(false)}
              >
                <X size={24} color="#fff" />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable style={styles.iconButton} onPress={handleReset}>
                <RotateCcw size={24} color={colors.textPrimary} />
              </Pressable>

              <Pressable style={styles.playButton} onPress={toggleTimer}>
                {isRunning ? (
                  <Pause size={32} color="#fff" />
                ) : (
                  <Play size={32} color="#fff" />
                )}
              </Pressable>

              {!isRunning && (
                <Pressable
                  style={styles.iconButton}
                  onPress={handleSettingsPress}
                >
                  <Settings size={24} color={colors.textPrimary} />
                </Pressable>
              )}
              {isRunning && <View style={styles.iconButton} />}
            </>
          )}
        </View>
      </View>

      {showSettings && (
        <TimerSettings
          focusDuration={focusDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
          onApply={applySettings}
          onCancel={handleSettingsClose}
          visible={showSettings}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100, // Add space for bottom tab bar
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: colors.textPrimary,
  },
  timerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 300,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    color: colors.error,
  },
  success: {
    color: colors.success,
  },
});
