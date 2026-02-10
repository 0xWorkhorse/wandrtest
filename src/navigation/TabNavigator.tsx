import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '../theme';
import { AnimatedPressable } from '../components';
import {
  ExploreScreen,
  FeedScreen,
  AgentScreen,
  RewardsScreen,
  CaptureScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const BUILD_VERSION = '1.0.8';

function CaptureTabButton({ onPress }: { onPress?: (e: any) => void }) {
  return (
    <AnimatedPressable
      style={styles.captureButton}
      onPress={() => onPress?.(undefined)}
      activeScale={0.9}
      haptic="medium"
      accessibilityLabel="Capture adventure"
    >
      <LinearGradient
        colors={[Colors.primaryLight, Colors.primary]}
        style={styles.captureButtonInner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </LinearGradient>
    </AnimatedPressable>
  );
}

function TabIcon({
  name,
  focused,
  color,
  size,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  size: number;
}) {
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={name} size={size} color={color} />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

export function TabNavigator() {
  return (
    <View style={{ flex: 1 }}>
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.midGray,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="compass-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Adventures"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="globe-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Capture"
        component={CaptureScreen}
        options={{
          tabBarIcon: () => null,
          tabBarLabel: () => null,
          tabBarButton: (props) => <CaptureTabButton onPress={props.onPress} />,
        }}
      />
      <Tab.Screen
        name="Agent"
        component={AgentScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="sparkles-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="trophy-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
    <View style={styles.buildBadge} pointerEvents="none">
      <Text style={styles.buildText}>v{BUILD_VERSION}</Text>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Platform.select({ ios: 88, android: 64, default: 72 }),
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    ...Shadows.lg,
    paddingBottom: Platform.select({ ios: 24, android: 8, default: 12 }),
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: Platform.OS === 'web' ? 4 : 0,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
  captureButton: {
    top: -16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  buildBadge: {
    position: 'absolute',
    bottom: Platform.select({ ios: 94, android: 70, default: 78 }),
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  buildText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
});
