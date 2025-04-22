import { StyleSheet, Text, View, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import { colors } from '@/styles/colors';
import { ChevronUp, ChevronDown, X } from 'lucide-react-native';
import Card from './Card';

type TimerSettingsProps = {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  onApply: (focus: number, shortBreak: number, longBreak: number) => void;
  onCancel: () => void;
};

export default function TimerSettings({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  onApply,
  onCancel,
}: TimerSettingsProps) {
  const [focus, setFocus] = useState(focusDuration);
  const [shortBreak, setShortBreak] = useState(shortBreakDuration);
  const [longBreak, setLongBreak] = useState(longBreakDuration);

  const increment = (value: number, setter: (value: number) => void, max: number = 60) => {
    if (value < max) {
      setter(value + 1);
    }
  };

  const decrement = (value: number, setter: (value: number) => void, min: number = 1) => {
    if (value > min) {
      setter(value - 1);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Timer Settings</Text>
            <Pressable style={styles.closeButton} onPress={onCancel}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Focus Duration</Text>
            <View style={styles.durationControls}>
              <Pressable 
                style={styles.durationButton}
                onPress={() => decrement(focus, setFocus)}
              >
                <ChevronDown size={20} color={colors.textSecondary} />
              </Pressable>
              
              <Text style={styles.durationValue}>{focus} min</Text>
              
              <Pressable 
                style={styles.durationButton}
                onPress={() => increment(focus, setFocus)}
              >
                <ChevronUp size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Short Break</Text>
            <View style={styles.durationControls}>
              <Pressable 
                style={styles.durationButton}
                onPress={() => decrement(shortBreak, setShortBreak)}
              >
                <ChevronDown size={20} color={colors.textSecondary} />
              </Pressable>
              
              <Text style={styles.durationValue}>{shortBreak} min</Text>
              
              <Pressable 
                style={styles.durationButton}
                onPress={() => increment(shortBreak, setShortBreak)}
              >
                <ChevronUp size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Long Break</Text>
            <View style={styles.durationControls}>
              <Pressable 
                style={styles.durationButton}
                onPress={() => decrement(longBreak, setLongBreak, 5)}
              >
                <ChevronDown size={20} color={colors.textSecondary} />
              </Pressable>
              
              <Text style={styles.durationValue}>{longBreak} min</Text>
              
              <Pressable 
                style={styles.durationButton}
                onPress={() => increment(longBreak, setLongBreak)}
              >
                <ChevronUp size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.applyButton]} 
              onPress={() => onApply(focus, shortBreak, longBreak)}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.textPrimary,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.textPrimary,
    width: 60,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    marginRight: 12,
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textPrimary,
  },
  applyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fff',
  },
});