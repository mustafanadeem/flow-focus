import { Redirect } from 'expo-router';

export default function Index() {
  // Temporarily redirecting directly to timer for development
  return <Redirect href="/(tabs)/timer" />;
}
