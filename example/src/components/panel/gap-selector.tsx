import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapSizes, type GapSize } from '../../states';
import { Themes } from '../../constants';
import {
  Spacing,
  Sizes,
  BorderRadius,
} from '../../design-tokens';
import { usePanelTheme } from './panel-theme';

const getContrastTextColor = (background: string) => {
  const rgbMatch = background.match(/\d+(\.\d+)?/g);
  let r = 0;
  let g = 0;
  let b = 0;

  if (rgbMatch && rgbMatch.length >= 3) {
    const rgb = rgbMatch.slice(0, 3).map(Number);
    r = rgb[0] ?? 0;
    g = rgb[1] ?? 0;
    b = rgb[2] ?? 0;
  } else if (background.startsWith('#')) {
    const hex = background.slice(1);
    const normalized = hex.length === 3
      ? hex.split('').map((char) => char + char).join('')
      : hex.slice(0, 6);
    r = parseInt(normalized.slice(0, 2), 16);
    g = parseInt(normalized.slice(2, 4), 16);
    b = parseInt(normalized.slice(4, 6), 16);
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#111111' : '#FFFFFF';
};

type GapSelectorProps = {
  showLabel?: boolean;
};

export const GapSelector = ({ showLabel = true }: GapSelectorProps) => {
  const currentValue = useSelector(qrcodeState$.gap);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentThemeName];
  const panelTheme = usePanelTheme();

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>Gap</Text>}
      <View style={styles.selector}>
        {GapSizes.map((size) => (
          <GapButton
            key={size}
            size={size}
            isActive={currentValue === size}
            activeColor={theme.colors[0]}
            panelTheme={panelTheme}
            onPress={() => qrcodeState$.gap.set(size)}
          />
        ))}
      </View>
    </View>
  );
};

type GapButtonProps = {
  size: GapSize;
  isActive: boolean;
  activeColor: string;
  panelTheme: ReturnType<typeof usePanelTheme>;
  onPress: () => void;
};

const GapButton = ({
  size,
  isActive,
  activeColor,
  panelTheme,
  onPress,
}: GapButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.button,
        isActive && { backgroundColor: activeColor },
        !isActive && isHovered && styles.buttonHovered,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          !isActive && isHovered && styles.buttonTextHovered,
          {
            color: isActive
              ? getContrastTextColor(activeColor)
              : panelTheme.textSubtle,
            fontWeight: isActive ? '700' : '600',
          },
        ]}
      >
        {size}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    gap: Spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  selector: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    padding: 3,
  },
  button: {
    paddingHorizontal: Spacing.md,
    height: 26,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHovered: {
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonTextHovered: {
  },
});
