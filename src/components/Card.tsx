import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'flat' | 'outlined';
}

export function Card({ children, style, variant = 'elevated' }: CardProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: Colors.white,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  flat: {
    backgroundColor: Colors.offWhite,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
});
