import { observable } from '@legendapp/state';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Themes, type ThemeName } from '../constants';

export const Shapes: BaseShapeOptions[] = [
  'square',
  'circle',
  'rounded',
  'diamond',
  'triangle',
  'star',
];

export const GapSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type GapSize = (typeof GapSizes)[number];

export const GapValues: Record<GapSize, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

export const qrcodeState$ = observable<{
  qrUrl: string;
  baseShape: BaseShapeOptions;
  eyePatternShape: BaseShapeOptions;
  gap: GapSize;
  selectedGradient: GradientType;
  currentTheme: ThemeName;
  pageTheme: PageThemeName;
  selectedLogo: SelectedLogo;
  customLogoUri: string;
  copyTrigger: number;
  exportFormat: ExportFormat;
  exportSize: number;
  customColors: string[];
  isCustomColorModalVisible: boolean;
}>({
  qrUrl: 'https://imarcodev.com',
  baseShape: 'circle',
  eyePatternShape: 'rounded',
  gap: 'sm',
  selectedGradient: 'linear',
  currentTheme: 'Imarco',
  pageTheme: 'dark',
  selectedLogo: { type: 'custom', value: '' },
  customLogoUri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNCQzAwMkQiIHJ4PSIxMCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iJ05vdG8gU2FucyBKUCcsICdNZWlyeW8nLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjY1IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+CiAgICDjg57jg6vjgrMKICA8L3RleHQ+Cjwvc3ZnPgo=',
  copyTrigger: 0,
  exportFormat: 'png',
  exportSize: 1024,
  customColors: ['#FFFFFF', '#BC002D', '#FFC107'],
  isCustomColorModalVisible: false,
});

export const GradientTypeOptions = [
  'radial',
  'linear',
  'linear-vertical',
  'sweep',
  'conical',
] as const;
export type GradientType = (typeof GradientTypeOptions)[number];

export const PageThemeOptions = ['dark', 'light'] as const;
export type PageThemeName = (typeof PageThemeOptions)[number];

export const getCurrentTheme = () => {
  const themeName = qrcodeState$.currentTheme.get();
  return Themes[themeName];
};

export const LogoEmojis = ['', '🐶', '🐰', '🦊', '🐼', '🐨'];

export const LogoSamples: Array<{ id: string; type: LogoType; label: string; value?: string }> = [
  { id: 'none', type: 'none', label: 'none' },
  { id: 'emoji-dog', type: 'emoji', value: '🐶', label: 'dog' },
  { id: 'emoji-bunny', type: 'emoji', value: '🐰', label: 'bunny' },
  { id: 'emoji-fox', type: 'emoji', value: '🦊', label: 'fox' },
  { id: 'emoji-panda', type: 'emoji', value: '🐼', label: 'panda' },
  { id: 'emoji-koala', type: 'emoji', value: '🐨', label: 'koala' },
  { id: 'img-github-logo', type: 'image', value: 'github-logo', label: 'github' },
  { id: 'img-github-mark', type: 'image', value: 'github-mark', label: 'github mark' },
];

export type LogoSample = { id: string; type: LogoType; label: string; value?: string };

export type LogoType = 'none' | 'emoji' | 'image' | 'custom';

export type SelectedLogo = { type: LogoType; value: string };

export const ExportFormats = ['png', 'svg'] as const;
export type ExportFormat = (typeof ExportFormats)[number];

export const ExportSizes = [
  { id: 'small', label: '512px', value: 512 },
  { id: 'medium', label: '1024px', value: 1024 },
  { id: 'large', label: '2048px', value: 2048 },
  { id: 'xlarge', label: '4096px', value: 4096 },
] as const;
export type ExportSizeOption = (typeof ExportSizes)[number];
