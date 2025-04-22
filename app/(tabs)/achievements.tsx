import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  isToday,
  parseISO,
  differenceInMinutes,
  format,
  isBefore,
  isAfter,
} from 'date-fns';
import { onSessionUpdated } from '@/lib/eventEmitter';

type Achievement = {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  imageUrl: string;
  checkProgress: (sessions: Session[]) => number;
};

type Session = {
  id: string;
  type: string;
  duration: number;
  created_at: string;
};

export default function AchievementsScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const achievementsList: Achievement[] = [
    // Milestone Achievements
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first focus session',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/2740956/pexels-photo-2740956.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) =>
        Math.min(sessions.filter((s) => s.type === 'Focus').length, 1),
    },
    {
      id: '2',
      title: 'Focus Master',
      description: 'Complete 25 focus sessions',
      progress: 0,
      maxProgress: 25,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/954559/pexels-photo-954559.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) =>
        sessions.filter((s) => s.type === 'Focus').length,
    },
    {
      id: '3',
      title: 'Focus Legend',
      description: 'Complete 100 focus sessions',
      progress: 0,
      maxProgress: 100,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/5989925/pexels-photo-5989925.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) =>
        sessions.filter((s) => s.type === 'Focus').length,
    },
    // Time-based Achievements
    {
      id: '4',
      title: 'Early Bird',
      description: 'Complete 5 focus sessions before 10 AM',
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        return sessions.filter((s) => {
          const sessionDate = parseISO(s.created_at);
          const sessionTime = new Date(sessionDate).getHours();
          return s.type === 'Focus' && sessionTime < 10;
        }).length;
      },
    },
    {
      id: '5',
      title: 'Night Owl',
      description: 'Complete 5 focus sessions after 8 PM',
      progress: 0,
      maxProgress: 5,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/4048182/pexels-photo-4048182.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        return sessions.filter((s) => {
          const sessionDate = parseISO(s.created_at);
          const sessionTime = new Date(sessionDate).getHours();
          return s.type === 'Focus' && sessionTime >= 20;
        }).length;
      },
    },
    // Streak Achievements
    {
      id: '6',
      title: 'Getting Started',
      description: 'Complete focus sessions 3 days in a row',
      progress: 0,
      maxProgress: 3,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        let streak = 0;
        const uniqueDates = new Set(
          sessions.map((s) => format(parseISO(s.created_at), 'yyyy-MM-dd'))
        );
        let currentDate = new Date();

        for (let i = 0; i < 3; i++) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          if (uniqueDates.has(dateStr)) {
            streak++;
          } else {
            break;
          }
          currentDate.setDate(currentDate.getDate() - 1);
        }
        return streak;
      },
    },
    {
      id: '7',
      title: 'Consistency Champion',
      description: 'Complete focus sessions 7 days in a row',
      progress: 0,
      maxProgress: 7,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/4065624/pexels-photo-4065624.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        let streak = 0;
        const uniqueDates = new Set(
          sessions.map((s) => format(parseISO(s.created_at), 'yyyy-MM-dd'))
        );
        let currentDate = new Date();

        for (let i = 0; i < 7; i++) {
          const dateStr = format(currentDate, 'yyyy-MM-dd');
          if (uniqueDates.has(dateStr)) {
            streak++;
          } else {
            break;
          }
          currentDate.setDate(currentDate.getDate() - 1);
        }
        return streak;
      },
    },
    // Duration Achievements
    {
      id: '8',
      title: 'Deep Worker',
      description: 'Complete a 2-hour focus session',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/7256596/pexels-photo-7256596.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        const longSession = sessions.find(
          (s) => s.type === 'Focus' && s.duration >= 7200
        );
        return longSession ? 1 : 0;
      },
    },
    {
      id: '9',
      title: 'Time Master',
      description: 'Accumulate 24 hours of total focus time',
      progress: 0,
      maxProgress: 86400, // 24 hours in seconds
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/1095601/pexels-photo-1095601.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        return sessions
          .filter((s) => s.type === 'Focus')
          .reduce((total, session) => total + session.duration, 0);
      },
    },
    // Special Achievements
    {
      id: '10',
      title: 'Weekend Warrior',
      description: 'Complete 3 focus sessions on a weekend',
      progress: 0,
      maxProgress: 3,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        return sessions.filter((s) => {
          const sessionDate = parseISO(s.created_at);
          const day = sessionDate.getDay();
          return s.type === 'Focus' && (day === 0 || day === 6); // Sunday = 0, Saturday = 6
        }).length;
      },
    },
    {
      id: '11',
      title: 'Balance Master',
      description: 'Complete 3 focus sessions and take all breaks in between',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        let perfectDays = 0;
        const sessionsByDate = sessions.reduce<Record<string, Session[]>>(
          (acc, session) => {
            const date = format(parseISO(session.created_at), 'yyyy-MM-dd');
            if (!acc[date]) acc[date] = [];
            acc[date].push(session);
            return acc;
          },
          {}
        );

        Object.values(sessionsByDate).forEach((daySessions) => {
          const focusSessions = daySessions.filter(
            (s) => s.type === 'Focus'
          ).length;
          const breakSessions = daySessions.filter(
            (s) => s.type === 'Break' || s.type === 'Long Break'
          ).length;
          if (focusSessions >= 3 && breakSessions >= focusSessions - 1) {
            perfectDays = 1;
          }
        });

        return perfectDays;
      },
    },
    {
      id: '12',
      title: 'Focus Enthusiast',
      description: 'Use all focus session durations (25, 45, and 60 minutes)',
      progress: 0,
      maxProgress: 3,
      unlocked: false,
      imageUrl:
        'https://images.pexels.com/photos/3758104/pexels-photo-3758104.jpeg?auto=compress&cs=tinysrgb&w=400',
      checkProgress: (sessions) => {
        const durations = new Set(
          sessions
            .filter((s) => s.type === 'Focus')
            .map((s) => Math.round(s.duration / 60))
        ); // Convert seconds to minutes
        return durations.has(25) && durations.has(45) && durations.has(60)
          ? 3
          : durations.size;
      },
    },
  ];

  const fetchSessions = useCallback(async () => {
    try {
      const storedSessions = await AsyncStorage.getItem('sessions');
      const data = storedSessions ? JSON.parse(storedSessions) : [];
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }, []);

  const updateAchievements = useCallback(() => {
    const updatedAchievements = achievementsList.map((achievement) => {
      const currentProgress = achievement.checkProgress(sessions);
      return {
        ...achievement,
        progress: currentProgress,
        unlocked: currentProgress >= achievement.maxProgress,
      };
    });
    setAchievements(updatedAchievements);
  }, [sessions]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    updateAchievements();
  }, [sessions, updateAchievements]);

  // Listen for session updates
  useEffect(() => {
    const subscription = onSessionUpdated(() => {
      fetchSessions();
    });
    return subscription;
  }, [fetchSessions]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const inProgressCount = achievements.filter(
    (a) => !a.unlocked && a.progress > 0
  ).length;
  const completionPercentage = Math.round(
    (unlockedCount / achievements.length) * 100
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Achievements" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unlockedCount}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completionPercentage}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Achievements</Text>

        {achievements.map((achievement) => (
          <Card key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementContent}>
              <View style={styles.achievementImageContainer}>
                <Image
                  source={{ uri: achievement.imageUrl }}
                  style={[
                    styles.achievementImage,
                    !achievement.unlocked && styles.achievementImageLocked,
                  ]}
                />
                {!achievement.unlocked && (
                  <View style={styles.achievementLockOverlay} />
                )}
              </View>

              <View style={styles.achievementDetails}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>

                {!achievement.unlocked && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/{achievement.maxProgress}
                    </Text>
                  </View>
                )}

                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedText}>Unlocked</Text>
                  </View>
                )}
              </View>
            </View>
          </Card>
        ))}
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
  statsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
    marginLeft: 8,
  },
  achievementCard: {
    padding: 16,
    marginBottom: 12,
  },
  achievementContent: {
    flexDirection: 'row',
  },
  achievementImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  achievementImage: {
    width: '100%',
    height: '100%',
  },
  achievementImageLocked: {
    opacity: 0.5,
  },
  achievementLockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  achievementDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  unlockedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.success,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  unlockedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#fff',
  },
});
