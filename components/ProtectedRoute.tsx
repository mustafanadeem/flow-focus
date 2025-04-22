import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!user && !inAuthGroup) {
      // Redirect to sign-in if not authenticated
      router.replace('/auth/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect to onboarding if authenticated and in auth group
      router.replace('/onboarding/screen2');
    }
  }, [user, loading, segments]);
}
