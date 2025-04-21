import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Target, Calendar, TrendingUp } from 'lucide-react-native';
import Header from '@/components/Header';
import Card from '@/components/Card';
import StatsCard from '@/components/StatsCard';

export default function AnalyticsScreen() {
  const mockData = {
    todayMinutes: 95,
    weeklyMinutes: 540,
    completedSessions: 12,
    currentStreak: 4,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Your Progress" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsGrid}>
          <StatsCard
            title="Today"
            value={`${mockData.todayMinutes}m`}
            icon={<Clock size={20} color={colors.primary} />}
          />
          <StatsCard
            title="This Week"
            value={`${mockData.weeklyMinutes}m`}
            icon={<Calendar size={20} color={colors.secondary} />}
          />
          <StatsCard
            title="Sessions"
            value={mockData.completedSessions.toString()}
            icon={<Target size={20} color={colors.accent} />}
          />
          <StatsCard
            title="Streak"
            value={mockData.currentStreak.toString()}
            icon={<TrendingUp size={20} color={colors.success} />}
          />
        </View>
        
        <Text style={styles.sectionTitle}>Focus Overview</Text>
        
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>Weekly Focus Time</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.barContainer}>
              {[0.3, 0.5, 0.7, 0.4, 0.9, 0.6, 0.2].map((height, index) => (
                <View key={index} style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: 120 * height,
                        backgroundColor: index === 4 ? colors.primary : colors.primaryLight
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        
        <Card style={styles.sessionsCard}>
          {[
            { time: 'Today, 10:30 AM', duration: '25 min', type: 'Focus' },
            { time: 'Today, 9:45 AM', duration: '5 min', type: 'Break' },
            { time: 'Today, 9:15 AM', duration: '25 min', type: 'Focus' },
            { time: 'Yesterday, 3:30 PM', duration: '15 min', type: 'Long Break' },
          ].map((session, index) => (
            <View key={index}>
              <View style={styles.sessionRow}>
                <View>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionType}>{session.type}</Text>
                </View>
                <Text style={[
                  styles.sessionDuration,
                  {
                    color: session.type === 'Focus' 
                      ? colors.primary 
                      : session.type === 'Break' 
                        ? colors.accent
                        : colors.secondary
                  }
                ]}>
                  {session.duration}
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