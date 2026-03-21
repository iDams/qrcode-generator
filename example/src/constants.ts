export const Themes = {
  mono: {
    colors: ['#000000', '#000000', '#000000'],
  },
  Imarco: {
    colors: ['#FFFFFF', '#BC002D', '#BC002D', '#FFC107'],
  },
  white: {
    colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
  },
  sand: {
    colors: ['#F7E2C7', '#D8B07A', '#A16D3B'],
  },
  forest: {
    colors: ['#5F8F71', '#2F5D50', '#13392E'],
  },
  breeze: {
    colors: ['#5CC8FF', '#A14DFF', '#FF69B4'],
  },
  candy: {
    colors: ['#A78BFA', '#F9A8D4', '#FDE68A'],
  },
  crimson: {
    colors: ['#FF6B6B', '#D63A5C', '#7A2E2E'],
  },
  falcon: {
    colors: ['#C7E9F4', '#9FB8D1', '#4E587A'],
  },
  meadow: {
    colors: ['#7EE081', '#A7D76E', '#3C8F54'],
  },
  midnight: {
    colors: ['#7CE7F2', '#4D8FD6', '#24304F'],
  },
  raindrop: {
    colors: ['#9ED4FF', '#5B8CFF', '#53D4FF'],
  },
  sunset: {
    colors: ['#FFD27D', '#FF8A3D', '#E94E77'],
  },
  aurora: {
    colors: ['#7AF5D6', '#7A8CFF', '#D66BFF'],
  },
  lagoon: {
    colors: ['#64D9D9', '#2FA7C4', '#1F4D7A'],
  },
  plum: {
    colors: ['#D59CFF', '#A155F7', '#5B2D8F'],
  },
  ember: {
    colors: ['#FFB15C', '#FF6A3D', '#B83344'],
  },
  citrus: {
    colors: ['#FFF08A', '#FFC94D', '#FF8F3D'],
  },
  custom: {
    colors: ['#FFFFFF', '#BC002D', '#FFC107'], // fallback
  },
} as const;

export type ThemeName = keyof typeof Themes;
export type Theme = (typeof Themes)[ThemeName];

// Feature Flags
export const FeatureFlags = {
  ENABLE_IMAGE_EXPORT: false,
} as const;
