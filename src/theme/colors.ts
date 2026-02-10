/**
 * WandrLust color palette — nature-inspired, presence-focused.
 */

export const Colors = {
  // Core brand
  primary: '#1B4332',       // Deep forest green
  primaryLight: '#2D6A4F',  // Lighter forest
  primaryDark: '#081C15',   // Darkest green
  accent: '#D4A373',        // Warm earth / sand
  accentLight: '#E9C46A',   // Golden hour
  accentDark: '#BC6C25',    // Deep amber

  // Nature palette
  moss: '#52796F',
  sage: '#84A98C',
  sky: '#4A90D9',
  sunset: '#E76F51',
  stone: '#6B705C',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  cream: '#FAF3E0',
  lightGray: '#E9ECEF',
  midGray: '#ADB5BD',
  darkGray: '#495057',
  charcoal: '#2B2D42',
  nearBlack: '#1A1A2E',
  black: '#000000',

  // Functional
  success: '#40916C',
  warning: '#E9C46A',
  error: '#E63946',
  info: '#4A90D9',

  // Transparency
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  cardShadow: 'rgba(27, 67, 50, 0.08)',

  // Gradients (defined as tuples for LinearGradient)
  gradientForest: ['#081C15', '#1B4332', '#2D6A4F'] as [string, string, string],
  gradientSunset: ['#E76F51', '#D4A373', '#E9C46A'] as [string, string, string],
  gradientGold: ['#D4A373', '#E9C46A'] as [string, string],
  gradientNight: ['#1A1A2E', '#16213E', '#0F3460'] as [string, string, string],
};
