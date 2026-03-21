import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDropdownClose } from '../hover-dropdown';
import { usePanelTheme } from '../panel-theme';
import type { GradientType } from '../../../states';
import { getGradientLabel, getGradientDirection } from './utils';
import { styles } from './styles';

type GradientOptionProps = {
  gradient: GradientType;
  isSelected: boolean;
  onSelect: () => void;
};

export const GradientOption = ({
  gradient,
  isSelected,
  onSelect,
}: GradientOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const closeDropdown = useDropdownClose();
  const direction = getGradientDirection(gradient);
  const theme = usePanelTheme();

  const handlePress = () => {
    onSelect();
    closeDropdown?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.option,
        {
          backgroundColor: isHovered || isSelected ? theme.hoverBackground : 'transparent',
        },
      ]}
    >
      <View style={styles.preview}>
        <LinearGradient
          colors={theme.isDark ? ['#ffffff', 'rgba(255,255,255,0.2)'] : ['#111111', 'rgba(17,17,17,0.15)']}
          start={direction.start}
          end={direction.end}
          style={styles.gradientFill}
        />
      </View>
      <Text
        style={[
          styles.optionText,
          {
            color: isHovered || isSelected ? theme.textPrimary : theme.textSubtle,
          },
        ]}
      >
        {getGradientLabel(gradient)}
      </Text>
    </Pressable>
  );
};
