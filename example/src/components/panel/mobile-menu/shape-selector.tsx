import React, { useCallback } from 'react';
import { View } from 'react-native';
import { PressableScale } from 'pressto';
import Svg, { Path } from 'react-native-svg';
import * as Burnt from '../../../utils/toast';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, Shapes } from '../../../states';
import type { BaseShapeOptions } from 'react-native-qrcode-skia';
import { Themes } from '../../../constants';
import { getPathFromShape } from '../../../utils/shape-path';
import { styles } from './styles';
import { usePanelTheme } from '../panel-theme';

const formatShapeName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

export const ShapeSelector = () => {
  const currentShape = useSelector(qrcodeState$.baseShape);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const themeColor = Themes[currentTheme].colors[0];
  const theme = usePanelTheme();

  const handleSelect = useCallback((shape: BaseShapeOptions) => {
    if (shape === qrcodeState$.baseShape.peek()) return;
    qrcodeState$.baseShape.set(shape);
    Burnt.toast({
      title: `Shape: ${formatShapeName(shape)}`,
      preset: 'none',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View style={styles.optionsRow}>
      {Shapes.map((shape) => {
        const isSelected = shape === currentShape;
        const shapePath = getPathFromShape(shape, 16);
        return (
          <PressableScale
            key={shape}
            onPress={() => handleSelect(shape)}
            style={[
              styles.shapeOption,
              {
                backgroundColor: isSelected ? themeColor : theme.buttonBackground,
              },
            ]}
          >
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Path d={shapePath} fill={theme.textPrimary} />
            </Svg>
          </PressableScale>
        );
      })}
    </View>
  );
};
