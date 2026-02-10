import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  hero: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  smallBold: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: 0.5,
  },
};
