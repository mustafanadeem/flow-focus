import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Bell, VolumeX } from 'lucide-react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { Circle, Svg } from 'react-native-svg';
import Header from '@/components/Header';
import Card from '@/components/Card';
import TimerSettings from '@/components/TimerSettings';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function TimerScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [focusDuration, setFocusDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
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
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Handle timer completion
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    progress.value = withTiming(1 - time / (focusDuration * 60), { duration: 300 });
  }, [time, focusDuration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(focusDuration * 60);
  };
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const applySettings = (focus: number, shortBreak: number, longBreak: number) => {
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
          <Pressable style={[styles.resetButton, styles.iconButton]} onPress={handleReset}>
            <RotateCcw size={24} color={colors.textPrimary} />
          </Pressable>
          
          <Pressable style={styles.playButton} onPress={toggleTimer}>
            {isRunning ? (
              <Pause size={32} color="#fff" />
            ) : (
              <Play size={32} color="#fff" />
            )}
          </Pressable>
          
          <Pressable 
            style={[styles.settingsButton, styles.iconButton]} 
            onPress={() => setShowSettings(true)}
          >
            <Text style={styles.settingsButtonText}>Settings</Text>
          </Pressable>
        </View>
        
        <Card style={styles.optionsCard}>
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Sound</Text>
            <Pressable 
              style={styles.optionButton} 
              onPress={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <Volume2 size={20} color={colors.primary} />
              ) : (
                <VolumeX size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.optionRow}>
            <Text style={styles.optionLabel}>Notifications</Text>
            <Pressable 
              style={styles.optionButton}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <Bell 
                size={20} 
                color={notificationsEnabled ? colors.primary : colors.textSecondary} 
              />
            </Pressable>
          </View>
        </Card>
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
  settingsButton: {
    width: 'auto',
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackground,
  },
  settingsButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  optionsCard: {
    width: '100%',
    padding: 8,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  optionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  optionButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
});