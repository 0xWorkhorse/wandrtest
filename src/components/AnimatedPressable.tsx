import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  /** Scale factor on press — lower = more pronounced. Default 0.97 */
  activeScale?: number;
  /** Haptic feedback style. Set to 'none' to disable. */
  haptic?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'menuitem';
  testID?: string;
}

export function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
  activeScale = 0.97,
  haptic = 'light',
  accessibilityLabel,
  accessibilityRole = 'button',
  testID,
}: AnimatedPressableProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: activeScale,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleValue, activeScale]);

  const animateOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  }, [scaleValue]);

  const handlePress = useCallback(() => {
    if (haptic !== 'none' && Platform.OS !== 'web') {
      if (haptic === 'selection') {
        Haptics.selectionAsync();
      } else {
        const map = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy,
        } as const;
        Haptics.impactAsync(map[haptic]);
      }
    }
    onPress?.();
  }, [haptic, onPress]);

  return (
    <Pressable
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      testID={testID}
    >
      <Animated.View
        style={[
          style,
          { transform: [{ scale: scaleValue }] },
          disabled && { opacity: 0.5 },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
