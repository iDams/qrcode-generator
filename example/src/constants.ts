export const Themes = {
  mono: {
    colors: ['#333333', '#181818'],
  },
  Imarco: {
    colors: ['#E74674', '#BC002D', '#7B1E3B'],
  },
  white: {
    colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
  },
  sand: {
    colors: ['#EED5B6', '#AF8856'],
  },
  forest: {
    colors: ['#506853', '#213223'],
  },
  breeze: {
    colors: ['#CF2F98', '#6A3DEC'],
  },
  candy: {
    colors: ['#A58EFB', '#E9BFF8'],
  },
  crimson: {
    colors: ['#FF6363', '#733434'],
  },
  falcon: {
    colors: ['#BDE3EC', '#363654'],
  },
  meadow: {
    colors: ['#59D499', '#A0872D'],
  },
  midnight: {
    colors: ['#4CC8C8', '#202033'],
  },
  raindrop: {
    colors: ['#8EC7FB', '#1C55AA'],
  },
  sunset: {
    colors: ['#FFCF73', '#FF7A2F'],
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
