import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius } from '../theme';

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

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
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
  },
});
