import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
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
import { sessionService } from '@/services/sessionService';
import { SessionType } from '@/types/session';
import { useAuth } from '@/contexts/AuthContext';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TimerScreen() {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [showSettings, setShowSettings] = useState(false);
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [currentSessionType, setCurrentSessionType] =
    useState<SessionType>('focus');

  const circumference = 2 * Math.PI * 120;
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      setIsPaused(true);
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

  const toggleTimer = () => {
    if (!isRunning && !sessionStartTime) {
      setSessionStartTime(new Date());
      setIsPaused(false);
    } else if (isRunning) {
      setIsPaused(true);
    }
    setIsRunning(!isRunning);
  };

  const handleAccept = async () => {
    if (sessionStartTime && user) {
      try {
        const endTime = new Date();
        // Calculate actual duration in seconds
        const actualDurationInSeconds = Math.floor(
          (endTime.getTime() - sessionStartTime.getTime()) / 1000
        );

        await sessionService.createSession({
          type: currentSessionType,
          duration: actualDurationInSeconds,
          started_at: sessionStartTime.toISOString(),
          completed_at: endTime.toISOString(),
          user_id: user.id,
        });
      } catch (error) {
        console.error('Failed to save session:', error);
      }
    }
    // Reset all states to initial values
    setIsRunning(false);
    setIsPaused(false);
    setTime(focusDuration * 60);
    setSessionStartTime(null);
    // Reset the progress animation
    progress.value = withTiming(0, { duration: 300 });
  };

  const handleReject = () => {
    handleReset();
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(focusDuration * 60);
    setSessionStartTime(null);
  };

  const applySettings = (
    focus: number,
    shortBreak: number,
    longBreak: number
  ) => {
    setFocusDuration(focus);
    setShortBreakDuration(shortBreak);
    setLongBreakDuration(longBreak);
    setTime(focus * 60);
    setShowSettings(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Pomodoro Timer" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              {isRunning ? 'Focus Time' : 'Ready?'}
            </Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          {!isPaused ? (
            <>
              <Pressable
                style={[styles.resetButton, styles.iconButton]}
                onPress={handleReset}
              >
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
                  style={[styles.settingsButton, styles.iconButton]}
                  onPress={() => setShowSettings(true)}
                >
                  <Settings size={24} color={colors.textPrimary} />
                </Pressable>
              )}
              {isRunning && <View style={styles.iconButton} />}
            </>
          ) : (
            <>
              <Pressable
                style={[styles.acceptButton, styles.iconButton]}
                onPress={handleAccept}
              >
                <Check size={24} color={colors.success} />
              </Pressable>

              <Text style={styles.pausedText}>Save session?</Text>

              <Pressable
                style={[styles.rejectButton, styles.iconButton]}
                onPress={handleReject}
              >
                <X size={24} color={colors.error} />
              </Pressable>
            </>
          )}
        </View>
      </ScrollView>

      {showSettings && (
        <TimerSettings
          focusDuration={focusDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
          onApply={applySettings}
          onCancel={() => setShowSettings(false)}
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
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
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
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
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
    marginHorizontal: 30,
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
  resetButton: {},
  settingsButton: {},
  acceptButton: {
    backgroundColor: colors.cardBackground,
  },
  rejectButton: {
    backgroundColor: colors.cardBackground,
  },
  pausedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginHorizontal: 20,
  },
});
