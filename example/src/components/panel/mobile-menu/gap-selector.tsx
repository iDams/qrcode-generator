import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { PressableScale } from 'pressto';
import * as Burnt from '../../../utils/toast';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapSizes, type GapSize } from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';
import { usePanelTheme } from '../panel-theme';

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

export const GapSelector = () => {
  const currentGap = useSelector(qrcodeState$.gap);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const theme = Themes[currentTheme];
  const panelTheme = usePanelTheme();

  const handleSelect = useCallback((size: GapSize) => {
    if (size === qrcodeState$.gap.peek()) return;
    qrcodeState$.gap.set(size);
    Burnt.toast({
      title: `Gap: ${size.toUpperCase()}`,
      preset: 'none',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View style={styles.gapRow}>
      {GapSizes.map((size) => {
        const isSelected = size === currentGap;
        return (
          <PressableScale
            key={size}
            onPress={() => handleSelect(size)}
            style={[
              styles.gapOption,
              {
                backgroundColor: isSelected ? theme.colors[0] : panelTheme.buttonBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.gapText,
                {
                  color: isSelected
                    ? getContrastTextColor(theme.colors[0])
                    : panelTheme.textMuted,
                  fontWeight: isSelected ? '700' : '600',
                },
              ]}
            >
              {size}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
};
