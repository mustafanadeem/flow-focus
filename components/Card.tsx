import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/styles/colors';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function Card({ children, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
});