import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Target, Calendar, TrendingUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  format,
  startOfWeek,
  endOfWeek,
  isToday,
  isYesterday,
  eachDayOfInterval,
  isSameDay,
  differenceInDays,
  parseISO,
} from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';
import { onSessionUpdated } from '@/lib/eventEmitter';

type Session = {
  id: string;
  user_id: string;
  type: string;
  duration: number;
  created_at: string;
};

export default function AnalyticsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState({
    todayMinutes: 0,
    weeklyMinutes: 0,
    completedSessions: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const storedSessions = await AsyncStorage.getItem('sessions');
      const data = storedSessions ? JSON.parse(storedSessions) : [];
      setSessions(data);

      // Calculate stats
      const todaySessions = data.filter((session: Session) =>
        isToday(new Date(session.created_at))
      );

      const todayMinutes = todaySessions.reduce(
        (sum: number, session: Session) => sum + session.duration,
        0
      );

      const weeklyMinutes = data.reduce(
        (sum: number, session: Session) => sum + session.duration,
        0
      );

      const focusSessions = data.filter(
        (session: Session) => session.type === 'Focus'
      );

      setStats({
        todayMinutes,
        weeklyMinutes,
        completedSessions: focusSessions.length,
        currentStreak: calculateStreak(data),
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchSessions();
    }, [fetchSessions])
  );

  // Listen for session updates
  useEffect(() => {
    const subscription = onSessionUpdated(() => {
      fetchSessions();
    });

    return subscription;
  }, [fetchSessions]);

  const calculateStreak = (sessions: Session[]) => {
    if (!sessions.length) return 0;

    // Sort sessions by date, newest first
    const sortedSessions = [...sessions].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Get unique dates (in case there are multiple sessions per day)
    const uniqueDates = Array.from(
      new Set(
        sortedSessions.map((session) =>
          format(new Date(session.created_at), 'yyyy-MM-dd')
        )
      )
    );

    let currentStreak = 0;
    const today = new Date();
    let checkDate = today;

    // If no session today, check if there was one yesterday to continue the streak
    if (!uniqueDates.includes(format(today, 'yyyy-MM-dd'))) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (!uniqueDates.includes(format(yesterday, 'yyyy-MM-dd'))) {
        return 0; // Break the streak if no session yesterday and today
      }
      checkDate = yesterday; // Start checking from yesterday
    }

    // Count consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = format(checkDate, 'yyyy-MM-dd');
      if (uniqueDates.includes(currentDate)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break; // Break the streak when we find a gap
      }
    }

    return currentStreak;
  };

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today, ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, h:mm a');
  };

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

  const getWeeklyData = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Start from Monday
    const end = endOfWeek(today, { weekStartsOn: 1 });

    // Get all days of the week
    const weekDays = eachDayOfInterval({ start, end });

    // Calculate focus time for each day
    const dailyFocusTime = weekDays.map((day) => {
      const daySessions = sessions.filter(
        (session) =>
          isSameDay(new Date(session.created_at), day) &&
          session.type === 'Focus'
      );

      return {
        date: day,
        total: daySessions.reduce((sum, session) => sum + session.duration, 0),
      };
    });

    return dailyFocusTime;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Your Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Today"
            value={formatDuration(stats.todayMinutes)}
            icon={<Clock size={20} color={colors.primary} />}
          />
          <StatsCard
            title="This Week"
            value={formatDuration(stats.weeklyMinutes)}
            icon={<Calendar size={20} color={colors.secondary} />}
          />
          <StatsCard
            title="Sessions"
            value={stats.completedSessions.toString()}
            icon={<Target size={20} color={colors.accent} />}
          />
          <StatsCard
            title="Streak"
            value={stats.currentStreak.toString()}
            icon={<TrendingUp size={20} color={colors.success} />}
          />
        </View>

        <Text style={styles.sectionTitle}>Focus Overview</Text>

        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Focus Time</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.barContainer}>
              {getWeeklyData().map((day, index) => {
                const dayLabel = format(day.date, 'EEE').charAt(0);
                const isToday = isSameDay(day.date, new Date());

                // Find the maximum duration for scaling
                const maxDuration = Math.max(
                  ...getWeeklyData().map((d) => d.total),
                  3600 // Minimum scale of 1 hour to prevent tiny bars
                );

                // Calculate bar height (minimum 4 pixels, maximum 120 pixels)
                const height = day.total
                  ? Math.max(4, (day.total / maxDuration) * 120)
                  : 4;

                return (
                  <View key={index} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height,
                          backgroundColor: isToday
                            ? colors.primary
                            : colors.primaryLight,
                        },
                      ]}
                    />
                    <Text
                      style={[styles.barLabel, isToday && styles.todayLabel]}
                    >
                      {dayLabel}
                    </Text>
                    {day.total > 0 && (
                      <Text style={styles.barValue}>
                        {formatDuration(day.total)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Recent Sessions</Text>

        {loading ? (
          <Text style={styles.loading}>Loading sessions...</Text>
        ) : sessions.length === 0 ? (
          <Text style={styles.noSessions}>No sessions found</Text>
        ) : (
          <View style={styles.sessionsContainer}>
            {sessions.map((session) => (
              <View key={session.id} style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionType}>{session.type}</Text>
                  <Text style={styles.sessionDate}>
                    {format(new Date(session.created_at), 'MMM d, yyyy')}
                  </Text>
                </View>
                <Text style={styles.sessionDuration}>
                  {formatDuration(session.duration)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
    marginLeft: 8,
  },
  chartCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  chartPlaceholder: {
    height: 180, // Increased height to accommodate duration labels
    justifyContent: 'flex-end',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingBottom: 24, // Space for labels
  },
  barWrapper: {
    alignItems: 'center',
    width: '13%',
  },
  bar: {
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
  },
  barLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  todayLabel: {
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  barValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    position: 'absolute',
    top: -20,
    width: 40,
    textAlign: 'center',
  },
  sessionsContainer: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionType: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionDate: {
    color: '#666',
  },
  sessionDuration: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  noSessions: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});
