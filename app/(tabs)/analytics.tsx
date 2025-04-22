import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Target, Calendar, TrendingUp } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';
import { sessionService } from '@/services/sessionService';
import { Session } from '@/types/session';
import { format, isToday, isYesterday } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';

const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

export default function AnalyticsScreen() {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weeklyFocusTime, setWeeklyFocusTime] = useState<
    { date: string; total_duration: number }[]
  >([]);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    const subscription = supabase
      .channel('sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      const [recentSessions, weeklyData] = await Promise.all([
        sessionService.getRecentSessions(),
        sessionService.getWeeklyFocusTime(),
      ]);
      setSessions(recentSessions);
      setWeeklyFocusTime(weeklyData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSessionTime = (date: string) => {
    const sessionDate = new Date(date);
    if (isToday(sessionDate)) {
      return `Today, ${format(sessionDate, 'h:mm a')}`;
    }
    if (isYesterday(sessionDate)) {
      return `Yesterday, ${format(sessionDate, 'h:mm a')}`;
    }
    return format(sessionDate, 'MMM d, h:mm a');
  };

  const calculateStats = () => {
    const todaySeconds = sessions
      .filter((s) => isToday(new Date(s.completed_at)) && s.type === 'focus')
      .reduce((acc, s) => acc + s.duration, 0);

    const weeklySeconds = weeklyFocusTime.reduce(
      (acc, day) => acc + day.total_duration,
      0
    );

    const completedSessions = sessions.filter((s) => s.type === 'focus').length;

    const streak = weeklyFocusTime.filter(
      (day) => day.total_duration > 0
    ).length;

    return {
      todaySeconds,
      weeklySeconds,
      completedSessions,
      currentStreak: streak,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Your Progress" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Your Progress" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Today"
            value={formatDuration(stats.todaySeconds)}
            icon={<Clock size={20} color={colors.primary} />}
          />
          <StatsCard
            title="This Week"
            value={formatDuration(stats.weeklySeconds)}
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
              {weeklyFocusTime.map((day, index) => {
                const height = day.total_duration / 3600; // Convert seconds to hours
                const maxHeight = Math.max(
                  ...weeklyFocusTime.map((d) => d.total_duration / 3600)
                );
                const relativeHeight = (height / maxHeight) * 120;

                return (
                  <View key={index} style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: relativeHeight,
                          backgroundColor: isToday(new Date(day.date))
                            ? colors.primary
                            : colors.primaryLight,
                        },
                      ]}
                    />
                    <Text style={styles.barLabel}>
                      {format(new Date(day.date), 'E')[0]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Recent Sessions</Text>

        <Card style={styles.sessionsCard}>
          {sessions.slice(0, 4).map((session, index) => (
            <View key={session.id}>
              <View style={styles.sessionRow}>
                <View>
                  <Text style={styles.sessionTime}>
                    {formatSessionTime(session.completed_at)}
                  </Text>
                  <Text style={styles.sessionType}>
                    {session.type.charAt(0).toUpperCase() +
                      session.type.slice(1)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.sessionDuration,
                    {
                      color:
                        session.type === 'focus'
                          ? colors.primary
                          : session.type === 'break'
                          ? colors.accent
                          : colors.secondary,
                    },
                  ]}
                >
                  {formatDuration(session.duration)}
                </Text>
              </View>
              {index < 3 && <View style={styles.divider} />}
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  chartTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 160,
    justifyContent: 'flex-end',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
  },
  barWrapper: {
    alignItems: 'center',
    width: '12%',
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
  barLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  sessionsCard: {
    padding: 16,
    marginBottom: 24,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sessionTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sessionType: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
  sessionDuration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
