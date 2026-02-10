import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

interface GradientBackgroundProps {
  colors?: [string, string, ...string[]];
  style?: ViewStyle;
  children: React.ReactNode;
}

export function GradientBackground({
  colors = Colors.gradientForest,
  style,
  children,
}: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
