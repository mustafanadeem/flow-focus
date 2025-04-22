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
import { Mail, Lock } from 'lucide-react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signIn(email, password);
      router.replace('/onboarding/screen2');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your focus journey
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

        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <Link href="/auth/forgot-password" asChild>
          <Pressable>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
        </Link>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/auth/sign-up" asChild>
            <Pressable>
              <Text style={styles.footerLink}>Sign Up</Text>
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
  forgotPassword: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 16,
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
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footerLinkText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});
