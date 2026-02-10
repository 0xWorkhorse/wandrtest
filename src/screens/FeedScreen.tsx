import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { Avatar, Card } from '../components';

const { width } = Dimensions.get('window');

interface Adventure {
  id: string;
  user: { name: string; handle: string };
  location: string;
  timeAgo: string;
  description: string;
  imageColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  likes: number;
  comments: number;
  wandrPoints: number;
  afkEarned: number;
  verified: boolean;
}

const FEED_DATA: Adventure[] = [
  {
    id: '1',
    user: { name: 'Sierra Peaks', handle: '@sierrapeaks' },
    location: 'Pacific Crest Trail, OR',
    timeAgo: '2h ago',
    description:
      'Found this incredible hidden waterfall off the main trail. The mist was catching the afternoon light perfectly. Sometimes the best moments come when you wander off the beaten path.',
    imageColor: '#2D6A4F',
    icon: 'water-outline',
    likes: 234,
    comments: 18,
    wandrPoints: 450,
    afkEarned: 12,
    verified: true,
  },
  {
    id: '2',
    user: { name: 'Atlas Rover', handle: '@atlasrover' },
    location: 'Kyoto, Japan',
    timeAgo: '5h ago',
    description:
      'Morning walk through the bamboo grove before the crowds. My Agent nudged me to arrive 30 minutes earlier — worth every second of lost sleep.',
    imageColor: '#52796F',
    icon: 'leaf-outline',
    likes: 891,
    comments: 42,
    wandrPoints: 680,
    afkEarned: 28,
    verified: true,
  },
  {
    id: '3',
    user: { name: 'Nomad Trail', handle: '@nomadtrail' },
    location: 'Dolomites, Italy',
    timeAgo: '1d ago',
    description:
      'Summit at sunrise. 14km, 1200m elevation gain. The Proof-of-Reality layer verified every step. Nothing beats earned views.',
    imageColor: '#6B705C',
    icon: 'mountain-outline' as any,
    likes: 1523,
    comments: 87,
    wandrPoints: 1200,
    afkEarned: 45,
    verified: true,
  },
  {
    id: '4',
    user: { name: 'Dew Walker', handle: '@dewwalker' },
    location: 'Portland, OR',
    timeAgo: '3h ago',
    description:
      'Local exploration day. My Agent suggested this tiny coffee shop tucked behind a bookstore. Sometimes you don\'t need to fly somewhere to discover something new.',
    imageColor: '#D4A373',
    icon: 'cafe-outline',
    likes: 156,
    comments: 12,
    wandrPoints: 80,
    afkEarned: 3,
    verified: true,
  },
];

export function FeedScreen() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderAdventure = (adventure: Adventure) => {
    const isLiked = likedPosts.has(adventure.id);

    return (
      <Card key={adventure.id} style={styles.adventureCard}>
        {/* Header */}
        <View style={styles.adventureHeader}>
          <Avatar name={adventure.user.name} size={40} />
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{adventure.user.name}</Text>
              {adventure.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.locationText}>
              <Ionicons name="location-outline" size={11} color={Colors.stone} />{' '}
              {adventure.location} · {adventure.timeAgo}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color={Colors.midGray} />
          </TouchableOpacity>
        </View>

        {/* Image placeholder */}
        <View style={[styles.imagePlaceholder, { backgroundColor: adventure.imageColor + '30' }]}>
          <Ionicons name={adventure.icon} size={48} color={adventure.imageColor} />
          <View style={styles.proofBadge}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.white} />
            <Text style={styles.proofText}>Verified</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{adventure.description}</Text>

        {/* Rewards bar */}
        <View style={styles.rewardsBar}>
          <View style={styles.rewardItem}>
            <Ionicons name="footsteps-outline" size={14} color={Colors.primary} />
            <Text style={styles.rewardText}>{adventure.wandrPoints} WANDR</Text>
          </View>
          <View style={styles.rewardDivider} />
          <View style={styles.rewardItem}>
            <Ionicons name="diamond-outline" size={14} color={Colors.accent} />
            <Text style={styles.rewardText}>{adventure.afkEarned} $AFK</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(adventure.id)}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? Colors.error : Colors.darkGray}
            />
            <Text style={[styles.actionText, isLiked && { color: Colors.error }]}>
              {adventure.likes + (isLiked ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.darkGray} />
            <Text style={styles.actionText}>{adventure.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="arrow-redo-outline" size={20} color={Colors.darkGray} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adventures</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.charcoal} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Story-like top row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContent}
        style={styles.stories}
      >
        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.addStory}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.storyLabel}>Your Story</Text>
        </TouchableOpacity>
        {['Trail Mix', 'Summit Crew', 'Local Finds', 'Night Walks'].map((name, i) => (
          <TouchableOpacity key={i} style={styles.storyItem}>
            <View style={[styles.storyRing]}>
              <Avatar name={name} size={56} />
            </View>
            <Text style={styles.storyLabel} numberOfLines={1}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Feed */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {FEED_DATA.map(renderAdventure)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.charcoal,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerButton: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.sunset,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  stories: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  storiesContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  storyItem: {
    alignItems: 'center',
    width: 70,
  },
  addStory: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '08',
  },
  storyRing: {
    padding: 2,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  storyLabel: {
    ...Typography.caption,
    color: Colors.darkGray,
    marginTop: 4,
    textAlign: 'center',
  },
  adventureCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  adventureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  userInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
  },
  verifiedBadge: {},
  locationText: {
    ...Typography.caption,
    color: Colors.stone,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  proofBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  proofText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  description: {
    ...Typography.body,
    color: Colors.charcoal,
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  rewardsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    ...Typography.caption,
    color: Colors.stone,
    fontWeight: '600',
  },
  rewardDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.lightGray,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: Spacing.sm,
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...Typography.small,
    color: Colors.darkGray,
  },
});
