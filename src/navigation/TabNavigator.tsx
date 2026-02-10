import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../theme';
import {
  ExploreScreen,
  FeedScreen,
  AgentScreen,
  RewardsScreen,
  ProfileScreen,
  CaptureScreen,
} from '../screens';

const Tab = createBottomTabNavigator();

function CaptureTabButton({ onPress }: { onPress?: (e: any) => void }) {
  return (
    <TouchableOpacity style={styles.captureButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.captureButtonInner}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );
}

export function TabNavigator() {
  return (
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Adventures"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: Platform.OS === 'ios' ? 88 : 64,
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
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
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
