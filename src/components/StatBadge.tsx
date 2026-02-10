import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface StatBadgeProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}

export function StatBadge({ label, value, icon, color = Colors.primary }: StatBadgeProps) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.row}>
        {icon}
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: {
    ...Typography.h2,
  },
  label: {
    ...Typography.caption,
    color: Colors.stone,
    marginTop: Spacing.xs,
  },
});
