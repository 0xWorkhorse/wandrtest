import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  StatusBar,
  Platform,
  DimensionValue,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, TAB_BAR_HEIGHT } from '../theme';
import { Card, AnimatedPressable } from '../components';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'globe-outline' as const },
  { id: 'trails', label: 'Trails', icon: 'trail-sign-outline' as const },
  { id: 'cafes', label: 'Cafes', icon: 'cafe-outline' as const },
  { id: 'views', label: 'Views', icon: 'eye-outline' as const },
  { id: 'wildlife', label: 'Wildlife', icon: 'leaf-outline' as const },
  { id: 'hidden', label: 'Hidden Gems', icon: 'diamond-outline' as const },
];

const CATEGORY_TYPE_MAP: Record<string, string[]> = {
  all: [],
  trails: ['Trail'],
  cafes: ['Cafe'],
  views: ['View'],
  wildlife: ['Wildlife'],
  hidden: ['Hidden Gem'],
};

const NEARBY_SPOTS = [
  {
    id: '1',
    name: 'Misty Ridge Trail',
    distance: '1.2 km',
    type: 'Trail',
    rating: 4.8,
    wandrPoints: 120,
    image: null,
    color: Colors.primary,
  },
  {
    id: '2',
    name: 'Sunset Point Overlook',
    distance: '2.8 km',
    type: 'View',
    rating: 4.9,
    wandrPoints: 200,
    image: null,
    color: Colors.sunset,
  },
  {
    id: '3',
    name: 'The Mossy Stone Cafe',
    distance: '0.5 km',
    type: 'Cafe',
    rating: 4.6,
    wandrPoints: 50,
    image: null,
    color: Colors.accent,
  },
  {
    id: '4',
    name: 'Eagle Nesting Grounds',
    distance: '3.4 km',
    type: 'Wildlife',
    rating: 4.7,
    wandrPoints: 300,
    image: null,
    color: Colors.sage,
  },
  {
    id: '5',
    name: 'The Whispering Arch',
    distance: '4.1 km',
    type: 'Hidden Gem',
    rating: 5.0,
    wandrPoints: 500,
    image: null,
    color: Colors.accent,
  },
];

const AGENT_SUGGESTIONS = [
  {
    id: '1',
    text: 'A quieter path through Fern Valley is less crowded right now',
    icon: 'leaf-outline' as const,
  },
  {
    id: '2',
    text: 'Golden hour at Sunset Point in 47 minutes',
    icon: 'sunny-outline' as const,
  },
  {
    id: '3',
    text: 'New trail opened near your location: Cedar Loop',
    icon: 'trail-sign-outline' as const,
  },
];

export function ExploreScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<TextInput>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.8, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const selectCategory = (id: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setActiveCategory(id);
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredSpots = NEARBY_SPOTS.filter((spot) => {
    const matchesCategory =
      activeCategory === 'all' || (CATEGORY_TYPE_MAP[activeCategory] || []).includes(spot.type);
    const matchesSearch =
      !query ||
      spot.name.toLowerCase().includes(query) ||
      spot.type.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const filteredSuggestions = AGENT_SUGGESTIONS.filter(
    (s) => !query || s.text.toLowerCase().includes(query),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map placeholder */}
      <View style={[styles.mapContainer, { height: height * 0.35 }]}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={Colors.sage} />
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubtext}>Discover nearby adventures</Text>

          {/* Fake map pins — highlight ones matching search */}
          {NEARBY_SPOTS.map((spot, i) => {
            const positions: { top: DimensionValue; left: DimensionValue }[] = [
              { top: '30%', left: '25%' },
              { top: '45%', left: '60%' },
              { top: '20%', left: '70%' },
              { top: '55%', left: '35%' },
              { top: '38%', left: '50%' },
            ];
            const isMatch =
              query &&
              (spot.name.toLowerCase().includes(query) ||
                spot.type.toLowerCase().includes(query));
            return (
              <View key={spot.id} style={[styles.mapPin, positions[i]]}>
                <Ionicons
                  name="location"
                  size={isMatch ? 32 : 24}
                  color={isMatch ? Colors.error : spot.color}
                />
              </View>
            );
          })}

          {/* Current location */}
          <View style={[styles.currentLocation, { top: '50%', left: '48%' }]}>
            <View style={styles.currentLocationDot} />
            <Animated.View
              style={[
                styles.currentLocationPulse,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.8],
                    outputRange: [0.4, 0],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Search bar overlay */}
        <View style={[styles.searchBar, { top: Math.max(insets.top, 12) + 8 }]}>
          <Ionicons name="search" size={20} color={searchFocused ? Colors.primary : Colors.stone} />
          <TextInput
            ref={searchRef}
            style={styles.searchInput}
            placeholder="Search adventures nearby..."
            placeholderTextColor={Colors.midGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setSearchQuery('');
                searchRef.current?.blur();
              }}
            >
              <Ionicons name="close-circle" size={20} color={Colors.midGray} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.bottomSheet}
        showsVerticalScrollIndicator={false}
      >
        {/* Agent nudge */}
        <View style={styles.agentNudge}>
          <View style={styles.agentIcon}>
            <Ionicons name="sparkles" size={16} color={Colors.accentLight} />
          </View>
          <Text style={styles.agentText} numberOfLines={1}>
            {AGENT_SUGGESTIONS[0].text}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.midGray} />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <AnimatedPressable
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => selectCategory(cat.id)}
              haptic="none"
              activeScale={0.95}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={activeCategory === cat.id ? Colors.white : Colors.stone}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  activeCategory === cat.id && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        {/* Nearby spots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {query ? `Results for "${searchQuery}"` : 'Nearby Adventures'}
            </Text>
            {!query && (
              <TouchableOpacity>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredSpots.length === 0 && (
            <Card style={styles.emptyCard}>
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={32} color={Colors.midGray} />
                <Text style={styles.emptyTitle}>No adventures found</Text>
                <Text style={styles.emptySubtext}>
                  Try a different search or explore another category
                </Text>
              </View>
            </Card>
          )}

          {filteredSpots.map((spot) => (
            <AnimatedPressable
              key={spot.id}
              activeScale={0.98}
              haptic="light"
              onPress={() => navigation.navigate('SpotDetail', {
                id: spot.id,
                name: spot.name,
                distance: spot.distance,
                type: spot.type,
                rating: spot.rating,
                wandrPoints: spot.wandrPoints,
                color: spot.color,
              })}
            >
              <Card style={styles.spotCard}>
                <View style={styles.spotRow}>
                  <View style={[styles.spotImage, { backgroundColor: spot.color + '20' }]}>
                    <Ionicons
                      name={
                        spot.type === 'Trail'
                          ? 'trail-sign'
                          : spot.type === 'View'
                          ? 'eye'
                          : spot.type === 'Cafe'
                          ? 'cafe'
                          : spot.type === 'Wildlife'
                          ? 'leaf'
                          : 'diamond'
                      }
                      size={24}
                      color={spot.color}
                    />
                  </View>
                  <View style={styles.spotInfo}>
                    <Text style={styles.spotName}>{spot.name}</Text>
                    <View style={styles.spotMeta}>
                      <Ionicons name="navigate-outline" size={12} color={Colors.stone} />
                      <Text style={styles.spotDistance}>{spot.distance}</Text>
                      <Ionicons name="star" size={12} color={Colors.accentLight} />
                      <Text style={styles.spotRating}>{spot.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.pointsBadge}>
                    <Text style={styles.pointsValue}>+{spot.wandrPoints}</Text>
                    <Text style={styles.pointsLabel}>WANDR</Text>
                  </View>
                </View>
              </Card>
            </AnimatedPressable>
          ))}
        </View>

        {/* Agent suggestions */}
        {filteredSuggestions.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agent Suggestions</Text>
            <Ionicons name="sparkles" size={18} color={Colors.accent} />
          </View>

          {filteredSuggestions.map((suggestion) => (
            <AnimatedPressable key={suggestion.id} activeScale={0.98} haptic="light">
              <Card style={styles.suggestionCard} variant="outlined">
                <View style={styles.suggestionRow}>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name={suggestion.icon} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                  <Ionicons name="arrow-forward-circle" size={24} color={Colors.primaryLight} />
                </View>
              </Card>
            </AnimatedPressable>
          ))}
        </View>
        )}

        <View style={{ height: TAB_BAR_HEIGHT + Spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  mapContainer: {
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E8F0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    ...Typography.h3,
    color: Colors.moss,
    marginTop: Spacing.sm,
  },
  mapSubtext: {
    ...Typography.caption,
    color: Colors.stone,
  },
  mapPin: {
    position: 'absolute',
  },
  currentLocation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.sky,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  currentLocationPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
  },
  searchBar: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'web' ? Spacing.sm : Spacing.md - 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    ...Typography.body,
    color: Colors.charcoal,
    flex: 1,
    marginLeft: Spacing.sm,
    padding: 0,
  },
  filterButton: {
    padding: Spacing.xs,
  },
  emptyCard: {
    marginBottom: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.bodyBold,
    color: Colors.darkGray,
    marginTop: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.caption,
    color: Colors.midGray,
    marginTop: Spacing.xs,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -Spacing.md,
    paddingTop: Spacing.md,
  },
  agentNudge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark + '08',
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md - 2,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primaryLight + '15',
  },
  agentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  agentText: {
    ...Typography.small,
    color: Colors.charcoal,
    flex: 1,
  },
  categories: {
    marginBottom: Spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    gap: Spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryLabel: {
    ...Typography.smallBold,
    color: Colors.stone,
  },
  categoryLabelActive: {
    color: Colors.white,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.charcoal,
  },
  seeAll: {
    ...Typography.smallBold,
    color: Colors.primaryLight,
  },
  spotCard: {
    marginBottom: Spacing.sm,
  },
  spotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotImage: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  spotName: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
  },
  spotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  spotDistance: {
    ...Typography.caption,
    color: Colors.stone,
    marginRight: Spacing.sm,
  },
  spotRating: {
    ...Typography.caption,
    color: Colors.stone,
  },
  pointsBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  pointsValue: {
    ...Typography.smallBold,
    color: Colors.primary,
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryLight,
    letterSpacing: 0.5,
  },
  suggestionCard: {
    marginBottom: Spacing.sm,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  suggestionText: {
    ...Typography.small,
    color: Colors.charcoal,
    flex: 1,
    marginRight: Spacing.sm,
  },
});
