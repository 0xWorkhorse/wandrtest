import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../theme';
import { Button } from '../components';

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  description: string;
  gradient: [string, string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'compass-outline',
    title: 'Explore the\nReal World',
    subtitle: 'WELCOME TO WANDRLUST',
    description:
      'Technology that protects presence, not steals it. Discover trails, hidden gems, and moments worth remembering.',
    gradient: ['#081C15', '#1B4332', '#2D6A4F'],
  },
  {
    id: '2',
    icon: 'sparkles-outline',
    title: 'Your AI\nAdventure Agent',
    subtitle: 'A QUIET SIXTH SENSE',
    description:
      'Your Agent suggests safer detours, quieter spots, better routes, and nearby discoveries — without pulling you into another feed.',
    gradient: ['#1A1A2E', '#16213E', '#0F3460'],
  },
  {
    id: '3',
    icon: 'footsteps-outline',
    title: 'Move. Earn.\nExplore.',
    subtitle: 'PROOF OF REALITY',
    description:
      'Your steps earn WANDR Points. Your shared moments earn $AFK through community endorsements. Real actions, real value.',
    gradient: ['#3C1642', '#6F2DBD', '#A663CC'],
  },
  {
    id: '4',
    icon: 'people-outline',
    title: 'Join the\nOutverse',
    subtitle: 'A GLOBAL COMMUNITY',
    description:
      'Share adventures, rise on leaderboards, and connect with explorers worldwide. No ads. No fake engagement. Just real exploration.',
    gradient: ['#1B4332', '#2D6A4F', '#52796F'],
  },
];

interface Props {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    } else {
      onComplete();
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
      >
        {slides.map((item) => (
          <LinearGradient
            key={item.id}
            colors={item.gradient}
            style={{ width, height }}
          >
            <View style={styles.slideContent}>
              <View style={styles.iconContainer}>
                <View style={styles.iconRing}>
                  <Ionicons name={item.icon} size={56} color={Colors.white} />
                </View>
              </View>

              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]}
              />
            );
          })}
        </View>

        <View style={styles.buttonRow}>
          {activeIndex < slides.length - 1 && (
            <Button title="Skip" variant="ghost" onPress={onComplete} textStyle={styles.skipText} />
          )}
          <Button
            title={activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            variant="secondary"
            size="lg"
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 160,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  subtitle: {
    ...Typography.label,
    color: Colors.accentLight,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.hero,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.75)',
    maxWidth: 300,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    color: 'rgba(255,255,255,0.6)',
  },
  nextButton: {
    minWidth: 160,
  },
});
