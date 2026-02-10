import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { Card, StatBadge } from '../components';

const LEADERBOARD = [
  { rank: 1, name: 'Sierra Peaks', points: 48200, badge: 'Trailblazer' },
  { rank: 2, name: 'Atlas Rover', points: 42100, badge: 'Explorer' },
  { rank: 3, name: 'Nomad Trail', points: 38900, badge: 'Wayfinder' },
  { rank: 4, name: 'You', points: 12450, badge: 'Pathfinder', isUser: true },
  { rank: 5, name: 'Dew Walker', points: 11800, badge: 'Wanderer' },
];

const PERKS = [
  {
    id: '1',
    title: 'Trail Mix Coffee Co.',
    description: 'Free coffee with 500 WANDR',
    cost: 500,
    icon: 'cafe-outline' as const,
    brand: 'Partner Perk',
  },
  {
    id: '2',
    title: 'Sunrise Gear Co.',
    description: '20% off with 2,000 WANDR',
    cost: 2000,
    icon: 'shirt-outline' as const,
    brand: 'Partner Perk',
  },
  {
    id: '3',
    title: 'National Parks Pass',
    description: 'Day pass with 5,000 WANDR',
    cost: 5000,
    icon: 'leaf-outline' as const,
    brand: 'Partner Perk',
  },
  {
    id: '4',
    title: 'Agent Pro Features',
    description: 'Unlock advanced AI with 1,000 WANDR',
    cost: 1000,
    icon: 'sparkles-outline' as const,
    brand: 'In-App',
  },
];

const ACTIVITY = [
  { id: '1', text: 'Morning walk — Fern Valley', points: '+120', time: 'Today, 9:30 AM', icon: 'footsteps-outline' as const },
  { id: '2', text: 'Adventure shared — verified', points: '+45 $AFK', time: 'Today, 10:15 AM', icon: 'camera-outline' as const },
  { id: '3', text: 'Community endorsement received', points: '+12 $AFK', time: 'Yesterday', icon: 'heart-outline' as const },
  { id: '4', text: 'Trail discovery: Cedar Loop', points: '+300', time: 'Yesterday', icon: 'trail-sign-outline' as const },
  { id: '5', text: 'Weekly explorer streak (7 days)', points: '+500', time: '2 days ago', icon: 'flame-outline' as const },
];

export function RewardsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with balance */}
        <LinearGradient colors={Colors.gradientForest} style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
          <Text style={styles.headerLabel}>YOUR REWARDS</Text>
          <Text style={styles.headerTitle}>Proof of Reality</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={styles.balanceIcon}>
                <Ionicons name="footsteps" size={20} color={Colors.accentLight} />
              </View>
              <Text style={styles.balanceValue}>12,450</Text>
              <Text style={styles.balanceLabel}>WANDR Points</Text>
            </View>

            <View style={styles.balanceDivider} />

            <View style={styles.balanceItem}>
              <View style={styles.balanceIcon}>
                <Ionicons name="diamond" size={20} color={Colors.accentLight} />
              </View>
              <Text style={styles.balanceValue}>347</Text>
              <Text style={styles.balanceLabel}>$AFK Earned</Text>
            </View>
          </View>

          {/* Progress to next tier */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Pathfinder → Explorer</Text>
              <Text style={styles.progressValue}>12,450 / 25,000</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '49.8%' }]} />
            </View>
          </View>
        </LinearGradient>

        {/* Daily stats */}
        <View style={styles.statsRow}>
          <StatBadge
            label="Steps Today"
            value="6,842"
            icon={<Ionicons name="footsteps" size={18} color={Colors.primary} />}
          />
          <StatBadge
            label="Streak"
            value="7 days"
            icon={<Ionicons name="flame" size={18} color={Colors.sunset} />}
            color={Colors.sunset}
          />
          <StatBadge
            label="Rank"
            value="#4"
            icon={<Ionicons name="trophy" size={18} color={Colors.accentDark} />}
            color={Colors.accentDark}
          />
        </View>

        {/* Partner perks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Redeem Perks</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md }}>
            {PERKS.map((perk) => (
              <TouchableOpacity key={perk.id} activeOpacity={0.8}>
                <Card style={styles.perkCard}>
                  <View style={styles.perkIconContainer}>
                    <Ionicons name={perk.icon} size={24} color={Colors.primary} />
                  </View>
                  <Text style={styles.perkBrand}>{perk.brand}</Text>
                  <Text style={styles.perkTitle}>{perk.title}</Text>
                  <Text style={styles.perkDesc}>{perk.description}</Text>
                  <View style={styles.perkCost}>
                    <Ionicons name="footsteps" size={12} color={Colors.primaryLight} />
                    <Text style={styles.perkCostText}>{perk.cost.toLocaleString()}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Leaderboard */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Leaderboard</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>This week</Text>
            </TouchableOpacity>
          </View>

          <Card>
            {LEADERBOARD.map((entry, index) => (
              <View
                key={entry.rank}
                style={[
                  styles.leaderRow,
                  entry.isUser && styles.leaderRowUser,
                  index < LEADERBOARD.length - 1 && styles.leaderRowBorder,
                ]}
              >
                <Text
                  style={[
                    styles.leaderRank,
                    entry.rank <= 3 && { color: Colors.accentDark },
                  ]}
                >
                  {entry.rank <= 3
                    ? ['', '1st', '2nd', '3rd'][entry.rank]
                    : `${entry.rank}th`}
                </Text>
                <View style={styles.leaderInfo}>
                  <Text
                    style={[styles.leaderName, entry.isUser && styles.leaderNameUser]}
                  >
                    {entry.name}
                  </Text>
                  <Text style={styles.leaderBadge}>{entry.badge}</Text>
                </View>
                <Text style={styles.leaderPoints}>
                  {entry.points.toLocaleString()}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          {ACTIVITY.map((item) => (
            <View key={item.id} style={styles.activityRow}>
              <View style={styles.activityIcon}>
                <Ionicons name={item.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <Text
                style={[
                  styles.activityPoints,
                  item.points.includes('$AFK') && { color: Colors.accent },
                ]}
              >
                {item.points}
              </Text>
            </View>
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
  header: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  headerLabel: {
    ...Typography.label,
    color: Colors.accentLight,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  balanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  balanceValue: {
    ...Typography.h2,
    color: Colors.white,
  },
  balanceLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  balanceDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: Spacing.md,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    ...Typography.smallBold,
    color: Colors.white,
  },
  progressValue: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accentLight,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
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
  perkCard: {
    width: 160,
    padding: Spacing.md,
  },
  perkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  perkBrand: {
    ...Typography.label,
    color: Colors.primaryLight,
    fontSize: 9,
    marginBottom: 2,
  },
  perkTitle: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
    fontSize: 14,
  },
  perkDesc: {
    ...Typography.caption,
    color: Colors.stone,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  perkCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  perkCostText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md - 2,
    paddingHorizontal: Spacing.sm,
  },
  leaderRowUser: {
    backgroundColor: Colors.primary + '08',
    borderRadius: BorderRadius.sm,
  },
  leaderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  leaderRank: {
    ...Typography.bodyBold,
    color: Colors.stone,
    width: 40,
    textAlign: 'center',
  },
  leaderInfo: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  leaderName: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
  },
  leaderNameUser: {
    color: Colors.primary,
  },
  leaderBadge: {
    ...Typography.caption,
    color: Colors.stone,
  },
  leaderPoints: {
    ...Typography.bodyBold,
    color: Colors.primaryLight,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activityText: {
    ...Typography.small,
    color: Colors.charcoal,
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.midGray,
    marginTop: 2,
  },
  activityPoints: {
    ...Typography.bodyBold,
    color: Colors.primary,
  },
});
