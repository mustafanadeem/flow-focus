import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/styles/colors';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.cardBackground,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
});