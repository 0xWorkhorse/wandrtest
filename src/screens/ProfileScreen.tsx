import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { Avatar, Card } from '../components';

const ONBOARDED_KEY = '@wandrlust/onboarded';

const ADVENTURE_GALLERY = [
  { id: '1', color: Colors.primary, icon: 'trail-sign' as const, label: 'Fern Valley' },
  { id: '2', color: Colors.sunset, icon: 'sunny' as const, label: 'Sunset Point' },
  { id: '3', color: Colors.sage, icon: 'leaf' as const, label: 'Cedar Loop' },
  { id: '4', color: Colors.sky, icon: 'water' as const, label: 'River Bend' },
  { id: '5', color: Colors.accent, icon: 'cafe' as const, label: 'Mossy Stone' },
  { id: '6', color: Colors.moss, icon: 'eye' as const, label: 'Eagle Ridge' },
];

const BADGES = [
  { id: '1', icon: 'flame' as const, label: 'Week Streak', color: Colors.sunset },
  { id: '2', icon: 'trail-sign' as const, label: 'Pathfinder', color: Colors.primary },
  { id: '3', icon: 'star' as const, label: 'First Post', color: Colors.accentLight },
  { id: '4', icon: 'people' as const, label: 'Community', color: Colors.sky },
  { id: '5', icon: 'footsteps' as const, label: '10k Steps', color: Colors.sage },
];

const SETTINGS_ITEMS = [
  { id: '1', icon: 'sparkles-outline' as const, label: 'Agent Preferences', chevron: true },
  { id: '2', icon: 'notifications-outline' as const, label: 'Notifications', chevron: true },
  { id: '3', icon: 'shield-checkmark-outline' as const, label: 'Privacy & Data', chevron: true },
  { id: '4', icon: 'wallet-outline' as const, label: 'Wallet & Tokens', chevron: true },
  { id: '5', icon: 'help-circle-outline' as const, label: 'Help & Support', chevron: true },
  { id: '6', icon: 'information-circle-outline' as const, label: 'About WandrLust', chevron: true },
];

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    const doLogout = async () => {
      await AsyncStorage.removeItem(ONBOARDED_KEY);
      // Trigger a reload to show onboarding again
      if (Platform.OS === 'web') {
        window.location.reload();
      } else {
        // On native, expo-updates or a state reset would handle this.
        // For now, navigate back and the RootNavigator will re-check.
        await AsyncStorage.clear();
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      }
    };

    if (Platform.OS === 'web') {
      doLogout();
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <LinearGradient colors={Colors.gradientForest} style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 12 }]}>
          <View style={styles.headerTop}>
            {navigation.canGoBack() ? (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={22} color={Colors.white} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Ionicons name="share-outline" size={22} color={Colors.white} />
              </TouchableOpacity>
            )}
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <Avatar name="You" size={80} />
            <Text style={styles.profileName}>Explorer</Text>
            <Text style={styles.profileHandle}>@wandrlust_explorer</Text>

            <View style={styles.profileBio}>
              <Text style={styles.bioText}>
                Finding presence in every path. Founding Tester.
              </Text>
            </View>
          </View>

          {/* Profile stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Adventures</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Token balances */}
        <View style={styles.tokenRow}>
          <Card style={styles.tokenCard}>
            <Ionicons name="footsteps" size={20} color={Colors.primary} />
            <Text style={styles.tokenValue}>12,450</Text>
            <Text style={styles.tokenLabel}>WANDR</Text>
          </Card>
          <Card style={styles.tokenCard}>
            <Ionicons name="diamond" size={20} color={Colors.accent} />
            <Text style={styles.tokenValue}>347</Text>
            <Text style={styles.tokenLabel}>$AFK</Text>
          </Card>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.md }}>
            {BADGES.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
                  <Ionicons name={badge.icon} size={22} color={badge.color} />
                </View>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Adventure gallery */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Adventure Gallery</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gallery}>
            {ADVENTURE_GALLERY.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.galleryItem, { backgroundColor: item.color + '20' }]}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon} size={28} color={item.color} />
                <Text style={[styles.galleryLabel, { color: item.color }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.settingsCard}>
            {SETTINGS_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingsItem,
                  index < SETTINGS_ITEMS.length - 1 && styles.settingsItemBorder,
                ]}
              >
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.midGray} />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Founding tester badge */}
        <View style={styles.section}>
          <Card style={styles.founderCard} variant="outlined">
            <View style={styles.founderRow}>
              <View style={styles.founderIcon}>
                <Ionicons name="planet-outline" size={24} color={Colors.accentLight} />
              </View>
              <View style={styles.founderInfo}>
                <Text style={styles.founderTitle}>Founding Tester</Text>
                <Text style={styles.founderDesc}>
                  You're among the first explorers shaping the WandrLust Agent. GRFFs honour the
                  earliest members of the Outverse.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

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
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  profileName: {
    ...Typography.h2,
    color: Colors.white,
    marginTop: Spacing.md,
  },
  profileHandle: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.6)',
  },
  profileBio: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xxl,
  },
  bioText: {
    ...Typography.small,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h3,
    color: Colors.white,
  },
  statLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tokenRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  tokenCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  tokenValue: {
    ...Typography.h2,
    color: Colors.charcoal,
    marginTop: Spacing.sm,
  },
  tokenLabel: {
    ...Typography.label,
    color: Colors.stone,
    marginTop: 2,
    fontSize: 10,
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
  badgeItem: {
    alignItems: 'center',
    width: 72,
  },
  badgeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    ...Typography.caption,
    color: Colors.darkGray,
    marginTop: 4,
    textAlign: 'center',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  galleryItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: 4,
  },
  settingsCard: {
    padding: 0,
    marginTop: Spacing.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  settingsLabel: {
    ...Typography.body,
    color: Colors.charcoal,
    flex: 1,
  },
  founderCard: {
    borderColor: Colors.accentLight + '40',
    backgroundColor: Colors.accentLight + '08',
  },
  founderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  founderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  founderInfo: {
    flex: 1,
  },
  founderTitle: {
    ...Typography.bodyBold,
    color: Colors.charcoal,
  },
  founderDesc: {
    ...Typography.small,
    color: Colors.stone,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  logoutText: {
    ...Typography.bodyBold,
    color: Colors.error,
  },
});
