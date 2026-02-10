import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';
import { Avatar, Card, AnimatedPressable } from '../components';

type SpotParams = {
  SpotDetail: {
    id: string;
    name: string;
    distance: string;
    type: string;
    rating: number;
    wandrPoints: number;
    color: string;
  };
};

const SPOT_DESCRIPTIONS: Record<string, string> = {
  '1': 'A winding ridge trail through ancient Douglas fir, with misty valleys unfolding on each side. Best hiked in the early morning when the fog rolls through the canopy. The trail gains 340m over 4.8km with several lookout points along the way.',
  '2': 'A breathtaking overlook perched 820m above the valley floor. Arrive 30 minutes before sunset for the full golden-hour experience — your Agent will remind you. On clear days you can see three mountain ranges from the viewing platform.',
  '3': 'Tucked behind a vintage bookstore, this moss-covered stone cafe serves single-origin pour-overs and house-baked sourdough. A local favorite that most visitors walk right past. The courtyard garden is the real hidden gem.',
  '4': 'A protected nesting area for bald eagles, accessible via a quiet boardwalk through wetlands. Spring is peak season (March–May) with fledglings visible from the observation blind. Binoculars recommended — your Agent can suggest the best viewing times.',
  '5': 'A natural sandstone arch hidden in a slot canyon, only accessible during low-water months. The acoustics create a whispering effect that gives it its name. One of the highest-rated hidden gems in the region — few explorers have verified this spot.',
};

const SPOT_REVIEWS = [
  { id: 'r1', spotId: '1', user: 'Sierra Peaks', rating: 5, text: 'The fog at dawn made this feel otherworldly. Trail is well-marked.', timeAgo: '3d ago' },
  { id: 'r2', spotId: '1', user: 'Nomad Trail', rating: 5, text: 'Moderate difficulty. Pack layers — it gets cold at the ridge.', timeAgo: '1w ago' },
  { id: 'r3', spotId: '2', user: 'Atlas Rover', rating: 5, text: 'Best sunset I have seen this year. Agent timed it perfectly.', timeAgo: '2d ago' },
  { id: 'r4', spotId: '2', user: 'Dew Walker', rating: 4, text: 'Stunning views but can get crowded on weekends.', timeAgo: '5d ago' },
  { id: 'r5', spotId: '3', user: 'Trail Mix', rating: 5, text: 'The sourdough alone is worth the trip. So cozy.', timeAgo: '1d ago' },
  { id: 'r6', spotId: '3', user: 'Sierra Peaks', rating: 4, text: 'Small space, but the courtyard is magical. Great pour-over.', timeAgo: '4d ago' },
  { id: 'r7', spotId: '4', user: 'Atlas Rover', rating: 5, text: 'Saw two fledglings take their first flight. Unforgettable.', timeAgo: '1w ago' },
  { id: 'r8', spotId: '4', user: 'Dew Walker', rating: 4, text: 'Peaceful walk. Bring bug spray for the wetland section.', timeAgo: '2w ago' },
  { id: 'r9', spotId: '5', user: 'Nomad Trail', rating: 5, text: 'The whispering effect is real. One of my all-time favorites.', timeAgo: '3d ago' },
  { id: 'r10', spotId: '5', user: 'Summit Crew', rating: 5, text: 'Hard to find but absolutely worth it. Check water levels first.', timeAgo: '1w ago' },
];

const SPOT_DETAILS: Record<string, { difficulty: string; duration: string; elevation: string }> = {
  '1': { difficulty: 'Moderate', duration: '2–3 hrs', elevation: '340m gain' },
  '2': { difficulty: 'Easy', duration: '1 hr', elevation: '120m gain' },
  '3': { difficulty: 'Easy', duration: '30 min', elevation: 'Flat' },
  '4': { difficulty: 'Easy', duration: '1–2 hrs', elevation: '15m gain' },
  '5': { difficulty: 'Hard', duration: '3–4 hrs', elevation: '580m gain' },
};

function getIconForType(type: string): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'Trail': return 'trail-sign';
    case 'View': return 'eye';
    case 'Cafe': return 'cafe';
    case 'Wildlife': return 'leaf';
    default: return 'diamond';
  }
}

export function SpotDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<SpotParams, 'SpotDetail'>>();
  const insets = useSafeAreaInsets();
  const spot = route.params;
  const [adventureStarted, setAdventureStarted] = useState(false);

  const description = SPOT_DESCRIPTIONS[spot.id] || 'A unique adventure waiting to be explored.';
  const reviews = SPOT_REVIEWS.filter((r) => r.spotId === spot.id);
  const details = SPOT_DETAILS[spot.id] || { difficulty: '—', duration: '—', elevation: '—' };
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : spot.rating.toFixed(1);

  const handleStartAdventure = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAdventureStarted(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero header */}
        <LinearGradient
          colors={[spot.color, Colors.primaryDark]}
          style={[styles.hero, { paddingTop: Math.max(insets.top, 12) + 8 }]}
        >
          {/* Back + share buttons */}
          <View style={styles.heroNav}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
              <Ionicons name="share-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Icon + type badge */}
          <View style={styles.heroContent}>
            <View style={styles.heroIconWrap}>
              <Ionicons name={getIconForType(spot.type)} size={48} color={Colors.white} />
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{spot.type}</Text>
            </View>
            <Text style={styles.heroTitle}>{spot.name}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="navigate-outline" size={14} color={Colors.white + 'CC'} />
              <Text style={styles.heroMetaText}>{spot.distance} away</Text>
              <View style={styles.heroDot} />
              <Ionicons name="star" size={14} color={Colors.accentLight} />
              <Text style={styles.heroMetaText}>{avgRating}</Text>
              <View style={styles.heroDot} />
              <Text style={styles.heroMetaText}>{reviews.length} reviews</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="speedometer-outline" size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{details.difficulty}</Text>
            <Text style={styles.statLabel}>Difficulty</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{details.duration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{details.elevation}</Text>
            <Text style={styles.statLabel}>Elevation</Text>
          </View>
        </View>

        {/* Points you'd earn */}
        <Card style={styles.pointsCard}>
          <View style={styles.pointsRow}>
            <View style={styles.pointsLeft}>
              <Ionicons name="footsteps-outline" size={22} color={Colors.primary} />
              <View>
                <Text style={styles.pointsTitle}>Complete this adventure</Text>
                <Text style={styles.pointsSubtext}>Verified by Proof-of-Reality</Text>
              </View>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsValue}>+{spot.wandrPoints}</Text>
              <Text style={styles.pointsLabel}>WANDR</Text>
            </View>
          </View>
        </Card>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
          </View>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Avatar name={review.user} size={36} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < review.rating ? 'star' : 'star-outline'}
                        size={12}
                        color={Colors.accentLight}
                      />
                    ))}
                    <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {adventureStarted ? (
          <View style={styles.startedRow}>
            <View style={styles.startedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.startedText}>Adventure started!</Text>
            </View>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="map-outline" size={18} color={Colors.white} />
              <Text style={styles.navigateButtonText}>View Map</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <AnimatedPressable
            style={styles.startButton}
            activeScale={0.97}
            haptic="medium"
            onPress={handleStartAdventure}
          >
            <LinearGradient
              colors={[spot.color, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              <Ionicons name="compass" size={20} color={Colors.white} />
              <Text style={styles.startButtonText}>Start Adventure</Text>
              <Text style={styles.startButtonPoints}>+{spot.wandrPoints} WANDR</Text>
            </LinearGradient>
          </AnimatedPressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  hero: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  heroNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  typeBadgeText: {
    ...Typography.label,
    color: Colors.white,
  },
  heroTitle: {
    ...Typography.h1,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    ...Typography.small,
    color: Colors.white + 'CC',
  },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.white + '66',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginTop: -Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    ...Typography.smallBold,
    color: Colors.charcoal,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.midGray,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.lightGray,
  },
  pointsCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  pointsTitle: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
  },
  pointsSubtext: {
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
    ...Typography.bodyBold,
    color: Colors.primary,
  },
  pointsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryLight,
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  reviewCount: {
    ...Typography.caption,
    color: Colors.midGray,
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    ...Typography.body,
    color: Colors.darkGray,
    lineHeight: 24,
  },
  reviewItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  reviewUser: {
    ...Typography.smallBold,
    color: Colors.charcoal,
  },
  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  reviewTime: {
    ...Typography.caption,
    color: Colors.midGray,
    marginLeft: Spacing.sm,
  },
  reviewText: {
    ...Typography.body,
    color: Colors.darkGray,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    ...Shadows.lg,
  },
  startButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  startButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  startButtonPoints: {
    ...Typography.caption,
    color: Colors.white + 'BB',
    marginLeft: Spacing.xs,
  },
  startedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  startedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  startedText: {
    ...Typography.bodyBold,
    color: Colors.success,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  navigateButtonText: {
    ...Typography.smallBold,
    color: Colors.white,
  },
});
