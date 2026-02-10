import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { Card } from '../components';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'globe-outline' as const },
  { id: 'trails', label: 'Trails', icon: 'trail-sign-outline' as const },
  { id: 'cafes', label: 'Cafes', icon: 'cafe-outline' as const },
  { id: 'views', label: 'Views', icon: 'eye-outline' as const },
  { id: 'wildlife', label: 'Wildlife', icon: 'leaf-outline' as const },
  { id: 'hidden', label: 'Hidden Gems', icon: 'diamond-outline' as const },
];

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
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Map placeholder */}
      <View style={[styles.mapContainer, { height: height * 0.35 }]}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={Colors.sage} />
          <Text style={styles.mapText}>Interactive Map</Text>
          <Text style={styles.mapSubtext}>Discover nearby adventures</Text>

          {/* Fake map pins */}
          <View style={[styles.mapPin, { top: '30%', left: '25%' }]}>
            <Ionicons name="location" size={24} color={Colors.primary} />
          </View>
          <View style={[styles.mapPin, { top: '45%', left: '60%' }]}>
            <Ionicons name="location" size={24} color={Colors.sunset} />
          </View>
          <View style={[styles.mapPin, { top: '20%', left: '70%' }]}>
            <Ionicons name="location" size={24} color={Colors.accent} />
          </View>
          <View style={[styles.mapPin, { top: '55%', left: '35%' }]}>
            <Ionicons name="location" size={24} color={Colors.sage} />
          </View>

          {/* Current location */}
          <View style={[styles.currentLocation, { top: '50%', left: '48%' }]}>
            <View style={styles.currentLocationDot} />
            <View style={styles.currentLocationPulse} />
          </View>
        </View>

        {/* Search bar overlay */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.stone} />
          <Text style={styles.searchText}>Search adventures nearby...</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
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
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat.id)}
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
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby spots */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Adventures</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {NEARBY_SPOTS.map((spot) => (
            <TouchableOpacity key={spot.id} activeOpacity={0.7}>
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
                          : 'leaf'
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
            </TouchableOpacity>
          ))}
        </View>

        {/* Agent suggestions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Agent Suggestions</Text>
            <Ionicons name="sparkles" size={18} color={Colors.accent} />
          </View>

          {AGENT_SUGGESTIONS.map((suggestion) => (
            <TouchableOpacity key={suggestion.id} activeOpacity={0.7}>
              <Card style={styles.suggestionCard} variant="outlined">
                <View style={styles.suggestionRow}>
                  <View style={styles.suggestionIcon}>
                    <Ionicons name={suggestion.icon} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                  <Ionicons name="arrow-forward-circle" size={24} color={Colors.primaryLight} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
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
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchText: {
    ...Typography.body,
    color: Colors.midGray,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  filterButton: {
    padding: Spacing.xs,
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
    fontSize: 9,
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
