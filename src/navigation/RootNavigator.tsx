import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen, ProfileScreen, SpotDetailScreen } from '../screens';
import { TabNavigator } from './TabNavigator';
import { Colors } from '../theme';

const Stack = createNativeStackNavigator();
const ONBOARDED_KEY = '@wandrlust/onboarded';

export function RootNavigator() {
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDED_KEY).then((value) => {
      setHasOnboarded(value === 'true');
    });
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
    setHasOnboarded(true);
  };

  if (hasOnboarded === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primaryDark }}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    );
  }

  if (!hasOnboarded) {
    return (
      <NavigationContainer>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SpotDetail" component={SpotDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
