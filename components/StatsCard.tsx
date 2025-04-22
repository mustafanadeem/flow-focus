import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/styles/colors';
import Card from './Card';

type StatsCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  style?: ViewStyle;
};

export default function StatsCard({ title, value, icon, style }: StatsCardProps) {
  return (
    <Card style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
  },
});