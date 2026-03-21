import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
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
      <LinearGradient
        colors={themeConfig.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.optionCircle}
      />
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
