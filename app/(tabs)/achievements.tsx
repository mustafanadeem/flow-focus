import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { achievementService } from '@/services/achievementService';
import { Achievement } from '@/types/achievement';
import { useIsFocused } from '@react-navigation/native';

export default function AchievementsScreen() {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadAchievements();
    }
  }, [isFocused]);

  const loadAchievements = async () => {
    try {
      const data = await achievementService.getAchievements();
      setAchievements(data);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title="Achievements" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Achievements" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {achievements.map((achievement) => (
          <Card key={achievement.id} style={styles.achievementCard}>
            <View style={styles.achievementContent}>
              <Image
                source={{ uri: achievement.imageUrl }}
                style={[
                  styles.achievementImage,
                  !achievement.completed && styles.achievementImageLocked,
                ]}
              />
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (achievement.progress / achievement.requirement) *
                              100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress} / {achievement.requirement}
                  </Text>
                </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  achievementCard: {
    marginBottom: 16,
    padding: 16,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  achievementImageLocked: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    minWidth: 50,
    textAlign: 'right',
  },
});
