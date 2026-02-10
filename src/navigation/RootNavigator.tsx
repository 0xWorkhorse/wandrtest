import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingScreen } from '../screens';
import { TabNavigator } from './TabNavigator';
import { ProfileScreen } from '../screens';

const Stack = createStackNavigator();

export function RootNavigator() {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  if (!hasOnboarded) {
    return (
      <NavigationContainer>
        <OnboardingScreen onComplete={() => setHasOnboarded(true)} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
