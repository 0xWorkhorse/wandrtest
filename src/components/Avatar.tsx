import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';

const AVATAR_COLORS = [
  Colors.primary,
  Colors.primaryLight,
  Colors.moss,
  Colors.sage,
  Colors.sky,
  Colors.sunset,
  Colors.stone,
  Colors.accent,
  Colors.accentDark,
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
}

export function Avatar({ uri, name, size = 44 }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const bgColor = name
    ? AVATAR_COLORS[hashName(name) % AVATAR_COLORS.length]
    : Colors.primaryLight;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
      accessibilityLabel={name ? `Avatar for ${name}` : 'Avatar'}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    color: Colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
