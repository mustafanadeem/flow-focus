import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationDuration: 250,
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
