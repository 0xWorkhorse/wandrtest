import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

export function CaptureScreen() {
  const [mode, setMode] = useState<'photo' | 'video'>('photo');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Camera viewfinder placeholder */}
      <View style={styles.viewfinder}>
        <View style={styles.viewfinderOverlay}>
          <Ionicons name="camera" size={64} color="rgba(255,255,255,0.3)" />
          <Text style={styles.viewfinderText}>Camera Preview</Text>
          <Text style={styles.viewfinderSubtext}>Capture your adventure</Text>
        </View>

        {/* Proof of Reality indicator */}
        <View style={styles.proofIndicator}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
          <Text style={styles.proofText}>Proof-of-Reality Active</Text>
        </View>

        {/* Location tag */}
        <View style={styles.locationTag}>
          <Ionicons name="location" size={14} color={Colors.white} />
          <Text style={styles.locationText}>Fern Valley · 45.5231°N, 122.6765°W</Text>
        </View>

        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="flash-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="settings-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* AI suggestion overlay */}
        <View style={styles.agentSuggestion}>
          <View style={styles.agentSuggestionIcon}>
            <Ionicons name="sparkles" size={12} color={Colors.accentLight} />
          </View>
          <Text style={styles.agentSuggestionText}>
            Shift left for better composition — golden light incoming
          </Text>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomArea}>
        {/* Mode selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'photo' && styles.modeTabActive]}
            onPress={() => setMode('photo')}
          >
            <Text style={[styles.modeText, mode === 'photo' && styles.modeTextActive]}>
              PHOTO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'video' && styles.modeTabActive]}
            onPress={() => setMode('video')}
          >
            <Text style={[styles.modeText, mode === 'video' && styles.modeTextActive]}>
              VIDEO
            </Text>
          </TouchableOpacity>
        </View>

        {/* Capture controls */}
        <View style={styles.captureRow}>
          {/* Gallery shortcut */}
          <TouchableOpacity style={styles.galleryButton}>
            <View style={styles.galleryPreview}>
              <Ionicons name="images" size={20} color={Colors.white} />
            </View>
          </TouchableOpacity>

          {/* Capture button */}
          <TouchableOpacity style={styles.captureButton} activeOpacity={0.7}>
            <View style={styles.captureOuter}>
              <View
                style={[
                  styles.captureInner,
                  mode === 'video' && styles.captureInnerVideo,
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Flip camera */}
          <TouchableOpacity style={styles.flipButton}>
            <Ionicons name="camera-reverse-outline" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Points indicator */}
        <View style={styles.pointsIndicator}>
          <Ionicons name="footsteps" size={14} color={Colors.accentLight} />
          <Text style={styles.pointsText}>
            Sharing this moment could earn +50 WANDR · +5 $AFK
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  viewfinder: {
    flex: 1,
    backgroundColor: Colors.nearBlack,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  viewfinderOverlay: {
    alignItems: 'center',
  },
  viewfinderText: {
    ...Typography.h3,
    color: 'rgba(255,255,255,0.4)',
    marginTop: Spacing.md,
  },
  viewfinderSubtext: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.25)',
    marginTop: Spacing.xs,
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proofIndicator: {
    position: 'absolute',
    top: 116,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 6,
  },
  proofText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  locationTag: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 6,
  },
  locationText: {
    ...Typography.caption,
    color: Colors.white,
  },
  agentSuggestion: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 67, 50, 0.85)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md - 2,
    gap: Spacing.sm,
  },
  agentSuggestionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentSuggestionText: {
    ...Typography.small,
    color: Colors.white,
    flex: 1,
  },
  bottomArea: {
    backgroundColor: Colors.black,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  modeTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  modeTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
  },
  modeText: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.4)',
  },
  modeTextActive: {
    color: Colors.white,
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  galleryButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.white,
  },
  captureInnerVideo: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: Colors.error,
  },
  flipButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pointsText: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
});
