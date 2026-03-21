import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GradientTypeOptions } from '../../../states';
import { HoverDropdown } from '../hover-dropdown';
import { usePanelTheme } from '../panel-theme';
import { GradientOption } from './gradient-option';
import { getGradientDirection } from './utils';
import { styles } from './styles';

export const GradientSelector = () => {
  const selectedGradient = useSelector(qrcodeState$.selectedGradient);
  const direction = getGradientDirection(selectedGradient);
  const theme = usePanelTheme();

  return (
    <HoverDropdown
      label="Gradient"
      trigger={
        <View style={styles.triggerPreview}>
          <LinearGradient
            colors={theme.isDark ? ['#ffffff', 'rgba(255,255,255,0.2)'] : ['#111111', 'rgba(17,17,17,0.15)']}
            start={direction.start}
            end={direction.end}
            style={styles.gradientFill}
          />
        </View>
      }
    >
      {GradientTypeOptions.map((gradient) => (
        <GradientOption
          key={gradient}
          gradient={gradient}
          isSelected={selectedGradient === gradient}
          onSelect={() => qrcodeState$.selectedGradient.set(gradient)}
        />
      ))}
    </HoverDropdown>
  );
};
