import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from '@legendapp/state/react';
import { TimingPresets } from '../../animations';
import { ShapeDropdown } from './shape-dropdown';
import { EyeDropdown } from './eye-dropdown';
import { GapSelector } from './gap-selector';
import { ThemeDropdown } from './theme-dropdown';
import { GradientSelector } from './gradient-selector';
import { LogoDropdown } from './logo-dropdown';
import { ExportDropdown } from './export-dropdown';
import { URLButton } from './url-button';
import { MobileMenu } from './mobile-menu';
import { GitHubIcon, MenuIcon } from '../icons';
import { HoverPressable } from '../hover-pressable';
import { useResponsive } from '../../hooks/use-responsive';
import { isEmbedded } from '../../hooks/use-embedded';
import { qrcodeState$ } from '../../states';
import { Spacing, Sizes, BorderRadius } from '../../design-tokens';
import { PanelThemeProvider, getPanelTheme, usePanelTheme } from './panel-theme';

const PanelGroup = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.group, style]}>{children}</View>
);

const GitHubButton = () => {
  const theme = usePanelTheme();
  const onPress = useCallback(() => {
    Linking.openURL(
      'https://github.com/iDams/react-native-qrcode-skia'
    );
  }, []);

  return (
    <HoverPressable
      style={[
        styles.iconButton,
        { backgroundColor: theme.buttonBackground },
      ]}
      hoverStyle={[
        styles.iconButtonHovered,
        { backgroundColor: theme.activeBackground },
      ]}
      onPress={onPress}
    >
      <GitHubIcon color={theme.iconMuted} />
    </HoverPressable>
  );
};

interface PanelProps {
  onURLButtonPress: () => void;
  drawerProgress?: SharedValue<number>;
}

const EMBEDDED_BOTTOM_OFFSET = 120;

export const Panel = ({ onURLButtonPress, drawerProgress }: PanelProps) => {
  const insets = useSafeAreaInsets();
  const { isMobile, isReady } = useResponsive();
  const embeddedOffset = isEmbedded ? EMBEDDED_BOTTOM_OFFSET : 0;
  const [menuVisible, setMenuVisible] = useState(false);
  const panelAnimation = useSharedValue(1);
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  const isDark = pageTheme === 'dark';
  const theme = getPanelTheme(isDark);

  const panelStyle = useAnimatedStyle(() => ({
    opacity: panelAnimation.value,
    transform: [{ scale: 0.95 + panelAnimation.value * 0.05 }],
  }));

  const openMenu = useCallback(() => {
    panelAnimation.value = withTiming(0, TimingPresets.panelFade);
    setMenuVisible(true);
  }, [panelAnimation]);

  const closeMenu = useCallback(() => {
    panelAnimation.value = withTiming(1, TimingPresets.panelFade);
    setMenuVisible(false);
  }, [panelAnimation]);

  if (!isReady) {
    return null;
  }

  if (isMobile) {
    return (
      <PanelThemeProvider isDark={isDark}>
        <Animated.View
          entering={FadeIn}
          style={[
            styles.container,
            { bottom: Math.max(insets.bottom, 16) + embeddedOffset },
            panelStyle,
          ]}
        >
          <View
            style={[
              styles.mobilePanel,
              {
                backgroundColor: theme.panelBackground,
                borderColor: theme.panelBorder,
                shadowColor: theme.shadowColor,
              },
            ]}
          >
            <HoverPressable
              style={[
                styles.iconButton,
                { backgroundColor: theme.buttonBackground },
              ]}
              hoverStyle={[
                styles.iconButtonHovered,
                { backgroundColor: theme.activeBackground },
              ]}
              onPress={openMenu}
            >
              <MenuIcon color={theme.iconDefault} />
            </HoverPressable>
            <URLButton onPress={onURLButtonPress} />
            <View style={styles.mobileActions}>
              <ExportDropdown />
              <GitHubButton />
            </View>
          </View>
        </Animated.View>
        <MobileMenu
          visible={menuVisible}
          onClose={closeMenu}
          progress={drawerProgress}
        />
      </PanelThemeProvider>
    );
  }

  return (
    <PanelThemeProvider isDark={isDark}>
      <Animated.View
        entering={FadeIn}
        style={[styles.container, { bottom: Math.max(insets.bottom, 24) + embeddedOffset }]}
      >
        <View
          style={[
            styles.panel,
            {
              backgroundColor: theme.panelBackground,
              borderColor: theme.panelBorder,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          <PanelGroup style={[styles.urlGroup, { backgroundColor: theme.groupBackground, borderColor: theme.groupBorder }]}>
            <URLButton onPress={onURLButtonPress} />
          </PanelGroup>
          <PanelGroup style={[styles.editGroup, { backgroundColor: theme.groupBackground, borderColor: theme.groupBorder }]}>
            <ThemeDropdown />
            <GradientSelector />
            <ShapeDropdown value$={qrcodeState$.baseShape} />
            <EyeDropdown value$={qrcodeState$.eyePatternShape} />
            <GapSelector />
            <LogoDropdown />
          </PanelGroup>
          <PanelGroup style={[styles.actionGroup, { backgroundColor: theme.groupBackground, borderColor: theme.groupBorder }]}>
            <ExportDropdown />
            <GitHubButton />
          </PanelGroup>
        </View>
      </Animated.View>
    </PanelThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  panel: {
    minHeight: 68,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    shadowOpacity: 0.24,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
  },
  mobilePanel: {
    height: 56,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    marginHorizontal: Spacing.xl,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  urlGroup: {
    paddingRight: Spacing.lg,
  },
  editGroup: {
    flex: 1,
    justifyContent: 'center',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: Spacing.md,
    paddingLeft: Spacing.lg,
  },
  mobileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginLeft: 'auto',
  },
  iconButton: {
    width: Sizes.button,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonHovered: {},
});
