import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import { colors } from '@/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import Card from '@/components/Card';

export default function FocusScreen() {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [notificationsBlocked, setNotificationsBlocked] = useState(false);
  const [socialBlocked, setSocialBlocked] = useState(false);
  const [hideStats, setHideStats] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Focus Mode" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.mainCard}>
          <Text style={styles.cardTitle}>Eliminate Distractions</Text>
          <Text style={styles.cardDescription}>
            Enable Focus Mode to block distractions and stay in the zone.
          </Text>
          
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Enable Focus Mode</Text>
            <Switch
              value={focusModeEnabled}
              onValueChange={setFocusModeEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Customization</Text>
        
        <Card style={styles.optionCard}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Block notifications</Text>
            <Switch
              value={notificationsBlocked}
              onValueChange={setNotificationsBlocked}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>
        
        <Card style={styles.optionCard}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Block social media</Text>
            <Switch
              value={socialBlocked}
              onValueChange={setSocialBlocked}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>
        
        <Card style={styles.optionCard}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Hide statistics</Text>
            <Switch
              value={hideStats}
              onValueChange={setHideStats}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </Card>
        
        <Text style={styles.disclaimer}>
          Focus Mode helps you stay productive by minimizing distractions. 
          When active, certain app features will be temporarily restricted.
        </Text>
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
  mainCard: {
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 16,
    marginLeft: 8,
  },
  optionCard: {
    padding: 16,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
  },
});