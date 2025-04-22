import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Card from '@/components/Card';

type Achievement = {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  imageUrl: string;
};

export default function AchievementsScreen() {
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Early Bird',
      description: 'Complete 5 focus sessions before 10 AM',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      imageUrl: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Complete at least one focus session for 7 consecutive days',
      progress: 4,
      maxProgress: 7,
      unlocked: false,
      imageUrl: 'https://images.pexels.com/photos/4065624/pexels-photo-4065624.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Focus Master',
      description: 'Complete 25 focus sessions',
      progress: 12,
      maxProgress: 25,
      unlocked: false,
      imageUrl: 'https://images.pexels.com/photos/954559/pexels-photo-954559.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Deep Worker',
      description: 'Complete 3 hours of focused work in a single day',
      progress: 3,
      maxProgress: 3,
      unlocked: true,
      imageUrl: 'https://images.pexels.com/photos/7256596/pexels-photo-7256596.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '5',
      title: 'Night Owl',
      description: 'Complete 5 focus sessions after 8 PM',
      progress: 2,
      maxProgress: 5,
      unlocked: false,
      imageUrl: 'https://images.pexels.com/photos/4048182/pexels-photo-4048182.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Achievements" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>20%</Text>
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
                    !achievement.unlocked && styles.achievementImageLocked
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
                          { width: `${(achievement.progress / achievement.maxProgress) * 100}%` }
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