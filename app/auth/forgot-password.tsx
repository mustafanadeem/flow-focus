import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { colors } from '@/styles/colors';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you instructions to reset your
          password
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? (
          <Text style={styles.successText}>
            Password reset instructions have been sent to your email
          </Text>
        ) : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <Link href="/auth/sign-in" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});
