import React, { useState } from 'react';
import { Text, Pressable, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Theme } from '../../../constants';
import { styles } from './styles';
import { usePanelTheme } from '../panel-theme';

interface ThemeOptionProps {
  name: string;
  theme: Theme;
  isSelected: boolean;
  onPress: () => void;
}

export const ThemeOption = ({
  name,
  theme: themeConfig,
  isSelected,
  onPress,
}: ThemeOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const panelTheme = usePanelTheme();
  const colors = [...themeConfig.colors] as string[];
  const isWhiteTheme = colors.every((color) => color.toUpperCase() === '#FFFFFF');
  const isBlackTheme = colors.every((color) => color.toUpperCase() === '#000000');
  const swatchBorderColor = isWhiteTheme
    ? panelTheme.isDark
      ? 'rgba(255,255,255,0.16)'
      : 'rgba(30,20,10,0.10)'
    : isBlackTheme
      ? panelTheme.isDark
        ? 'rgba(255,255,255,0.16)'
        : 'rgba(17,17,17,0.12)'
      : 'transparent';

  return (
    <Pressable
      style={[
        styles.option,
        {
          backgroundColor: isHovered || isSelected ? panelTheme.hoverBackground : 'transparent',
        },
      ]}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      <View style={[styles.optionCircleFrame, { borderColor: swatchBorderColor }]}>
        <LinearGradient
          colors={themeConfig.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.optionCircle}
        />
      </View>
      <Text
        style={[
          styles.optionText,
          {
            color: isHovered || isSelected ? panelTheme.textPrimary : panelTheme.textSubtle,
          },
        ]}
      >
        {name}
      </Text>
    </Pressable>
  );
};
