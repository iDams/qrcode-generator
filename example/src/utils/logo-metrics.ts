import type { LogoSafeArea, LogoSize } from '../states';

type LogoMetrics = {
  visual: number;
  font: number;
};

const desktopMetrics: Record<LogoSize, LogoMetrics> = {
  xs: { visual: 40, font: 28 },
  sm: { visual: 48, font: 34 },
  md: { visual: 58, font: 42 },
  lg: { visual: 68, font: 48 },
};

const mobileMetrics: Record<LogoSize, LogoMetrics> = {
  xs: { visual: 34, font: 24 },
  sm: { visual: 42, font: 30 },
  md: { visual: 50, font: 38 },
  lg: { visual: 58, font: 42 },
};

const desktopSafeArea: Record<LogoSafeArea, number> = {
  xs: 56,
  sm: 68,
  md: 80,
  lg: 96,
};

const mobileSafeArea: Record<LogoSafeArea, number> = {
  xs: 50,
  sm: 60,
  md: 70,
  lg: 82,
};

export const getLogoVisualMetrics = (
  logoSize: LogoSize,
  isDesktop: boolean
): LogoMetrics => {
  return isDesktop ? desktopMetrics[logoSize] : mobileMetrics[logoSize];
};

export const getLogoSafeAreaSize = (
  logoSafeArea: LogoSafeArea,
  isDesktop: boolean
): number => {
  return isDesktop ? desktopSafeArea[logoSafeArea] : mobileSafeArea[logoSafeArea];
};
