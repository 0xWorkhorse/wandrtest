import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  Platform,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { Avatar, Card, AnimatedPressable } from '../components';

const LIKED_KEY = '@wandrlust/liked_posts';
const BOOKMARKED_KEY = '@wandrlust/bookmarked_posts';
const COMMENTS_KEY = '@wandrlust/comments';

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

interface Comment {
  id: string;
  postId: string;
  user: string;
  text: string;
  timeAgo: string;
}

const SEED_COMMENTS: Comment[] = [
  { id: 'c1', postId: '1', user: 'Trail Mix', text: 'Incredible find! Adding this to my list.', timeAgo: '1h ago' },
  { id: 'c2', postId: '1', user: 'Nomad Trail', text: 'The PCT never disappoints.', timeAgo: '45m ago' },
  { id: 'c3', postId: '2', user: 'Dew Walker', text: 'Your Agent is on point! Mine suggested the same grove.', timeAgo: '3h ago' },
  { id: 'c4', postId: '2', user: 'Sierra Peaks', text: 'Bamboo groves hit different at dawn.', timeAgo: '2h ago' },
  { id: 'c5', postId: '3', user: 'Atlas Rover', text: '1200m gain is no joke. Major respect!', timeAgo: '20h ago' },
  { id: 'c6', postId: '4', user: 'Summit Crew', text: 'Portland has so many hidden gems.', timeAgo: '1h ago' },
];

export function FeedScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);
  const [commentModalPost, setCommentModalPost] = useState<Adventure | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(LIKED_KEY).then((value) => {
      if (value) setLikedPosts(new Set(JSON.parse(value)));
    });
    AsyncStorage.getItem(BOOKMARKED_KEY).then((value) => {
      if (value) setBookmarkedPosts(new Set(JSON.parse(value)));
    });
    AsyncStorage.getItem(COMMENTS_KEY).then((value) => {
      if (value) setComments([...SEED_COMMENTS, ...JSON.parse(value)]);
    });
  }, []);

  const toggleLike = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem(LIKED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleBookmark = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBookmarkedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem(BOOKMARKED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const handleShare = async (adventure: Adventure) => {
    try {
      await Share.share({
        message: `Check out this adventure by ${adventure.user.name} at ${adventure.location}! "${adventure.description.slice(0, 100)}..." — Shared via WandrLust`,
      });
    } catch {
      // user cancelled
    }
  };

  const openComments = (adventure: Adventure) => {
    setCommentModalPost(adventure);
    setCommentText('');
  };

  const submitComment = () => {
    if (!commentText.trim() || !commentModalPost) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId: commentModalPost.id,
      user: 'You',
      text: commentText.trim(),
      timeAgo: 'now',
    };
    setComments((prev) => {
      const next = [...prev, newComment];
      const userComments = next.filter((c) => c.user === 'You');
      AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(userComments));
      return next;
    });
    setCommentText('');
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getCommentsForPost = (postId: string) => comments.filter((c) => c.postId === postId);

  const likeAnimRefs = useRef<Record<string, Animated.Value>>({});
  const getLikeAnim = useCallback((id: string) => {
    if (!likeAnimRefs.current[id]) {
      likeAnimRefs.current[id] = new Animated.Value(1);
    }
    return likeAnimRefs.current[id];
  }, []);

  const animatedToggleLike = useCallback((id: string) => {
    const anim = getLikeAnim(id);
    toggleLike(id);
    Animated.sequence([
      Animated.spring(anim, { toValue: 1.4, useNativeDriver: true, speed: 50 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 8 }),
    ]).start();
  }, [getLikeAnim, toggleLike]);

  const renderAdventure = (adventure: Adventure) => {
    const isLiked = likedPosts.has(adventure.id);
    const isBookmarked = bookmarkedPosts.has(adventure.id);

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
          <AnimatedPressable
            style={styles.actionButton}
            onPress={() => animatedToggleLike(adventure.id)}
            haptic="none"
            activeScale={0.9}
          >
            <Animated.View style={{ transform: [{ scale: getLikeAnim(adventure.id) }] }}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={isLiked ? Colors.error : Colors.darkGray}
              />
            </Animated.View>
            <Text style={[styles.actionText, isLiked && { color: Colors.error }]}>
              {adventure.likes + (isLiked ? 1 : 0)}
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.actionButton}
            onPress={() => openComments(adventure)}
            haptic="light"
            activeScale={0.9}
          >
            <Ionicons name="chatbubble-outline" size={20} color={Colors.darkGray} />
            <Text style={styles.actionText}>
              {adventure.comments + getCommentsForPost(adventure.id).filter((c) => c.user === 'You').length}
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.actionButton}
            onPress={() => handleShare(adventure)}
            haptic="light"
            activeScale={0.9}
          >
            <Ionicons name="arrow-redo-outline" size={20} color={Colors.darkGray} />
            <Text style={styles.actionText}>Share</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.actionButton}
            onPress={() => toggleBookmark(adventure.id)}
            haptic="none"
            activeScale={0.9}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? Colors.primary : Colors.darkGray}
            />
          </AnimatedPressable>
        </View>
      </Card>
    );
  };

  const postComments = commentModalPost ? getCommentsForPost(commentModalPost.id) : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
        <Text style={styles.headerTitle}>Adventures</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.charcoal} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar name="You" size={32} />
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
          <AnimatedPressable key={i} style={styles.storyItem} activeScale={0.95} haptic="selection">
            <LinearGradient
              colors={[Colors.accentLight, Colors.sunset, Colors.accent]}
              style={styles.storyGradientRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.storyRingInner}>
                <Avatar name={name} size={52} />
              </View>
            </LinearGradient>
            <Text style={styles.storyLabel} numberOfLines={1}>
              {name}
            </Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      {/* Feed */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.feed}>
        {FEED_DATA.map(renderAdventure)}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Comment Modal */}
      <Modal
        visible={!!commentModalPost}
        animationType="slide"
        transparent
        onRequestClose={() => setCommentModalPost(null)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setCommentModalPost(null)} />
          <View style={[styles.commentSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            {/* Sheet handle */}
            <View style={styles.sheetHandle} />
            <View style={styles.commentHeader}>
              <Text style={styles.commentHeaderTitle}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentModalPost(null)}>
                <Ionicons name="close" size={24} color={Colors.darkGray} />
              </TouchableOpacity>
            </View>

            {/* Comments list */}
            <FlatList
              data={postComments}
              keyExtractor={(item) => item.id}
              style={styles.commentList}
              ListEmptyComponent={
                <Text style={styles.emptyComments}>No comments yet. Be the first!</Text>
              }
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Avatar name={item.user} size={32} />
                  <View style={styles.commentContent}>
                    <View style={styles.commentNameRow}>
                      <Text style={styles.commentUser}>{item.user}</Text>
                      <Text style={styles.commentTime}>{item.timeAgo}</Text>
                    </View>
                    <Text style={styles.commentTextBody}>{item.text}</Text>
                  </View>
                </View>
              )}
            />

            {/* Input */}
            <View style={styles.commentInputRow}>
              <Avatar name="You" size={32} />
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor={Colors.midGray}
                value={commentText}
                onChangeText={setCommentText}
                onSubmitEditing={submitComment}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={submitComment}
                disabled={!commentText.trim()}
                style={[styles.sendButton, !commentText.trim() && { opacity: 0.4 }]}
              >
                <Ionicons name="send" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    overflow: 'hidden',
  },
  feed: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
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
  storyGradientRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRingInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
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
  // Comment modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  commentSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '70%',
    minHeight: 320,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    alignSelf: 'center',
    marginTop: Spacing.sm,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  commentHeaderTitle: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
  },
  commentList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  emptyComments: {
    ...Typography.body,
    color: Colors.midGray,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  commentUser: {
    ...Typography.smallBold,
    color: Colors.charcoal,
  },
  commentTime: {
    ...Typography.caption,
    color: Colors.midGray,
  },
  commentTextBody: {
    ...Typography.body,
    color: Colors.darkGray,
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    gap: Spacing.sm,
  },
  commentInput: {
    flex: 1,
    ...Typography.body,
    backgroundColor: Colors.offWhite,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.charcoal,
  },
  sendButton: {
    padding: Spacing.xs,
  },
});
