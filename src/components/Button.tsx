import React from 'react';
import {
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { AnimatedPressable } from './AnimatedPressable';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  accessibilityLabel,
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    ...(style ? [style] : []),
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    ...(textStyle ? [textStyle] : []),
  ];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      activeScale={0.96}
      haptic={variant === 'ghost' ? 'selection' : 'light'}
      accessibilityLabel={accessibilityLabel || title}
      style={buttonStyles}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },
  secondary: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  size_md: {
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.lg,
  },
  size_lg: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  text: {
    ...Typography.button,
  },
  text_primary: {
    color: Colors.white,
  },
  text_secondary: {
    color: Colors.primaryDark,
  },
  text_outline: {
    color: Colors.white,
  },
  text_ghost: {
    color: Colors.primary,
  },
  textSize_sm: {
    fontSize: 14,
  },
  textSize_md: {
    fontSize: 16,
  },
  textSize_lg: {
    fontSize: 18,
  },
});
