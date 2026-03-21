import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import { ChevronIcon } from '../../icons';
import { Themes, type ThemeName, type Theme } from '../../../constants';
import { qrcodeState$ } from '../../../states';
import { TimingPresets } from '../../../animations';
import { ThemeOption } from './theme-option';
import { styles } from './styles';
import { usePanelTheme } from '../panel-theme';

const formatThemeName = (name: ThemeName) => {
  if (name === 'mono') return 'Black';
  if (name === 'white') return 'White';
  if (name === 'custom') return 'Custom';
  return name;
};

export const ThemeDropdown = () => {
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const customColorsRaw = useSelector(qrcodeState$.customColors) as Array<
    string | undefined
  >;
  const customColors: string[] = customColorsRaw.filter(
    (color): color is string => typeof color === 'string'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isTapOpen, setIsTapOpen] = useState(false);
  const animation = useSharedValue(0);
  const theme = usePanelTheme();
  const normalizedCustomColors: string[] =
    customColors.length >= 2 ? customColors : ['#FFFFFF', '#BC002D'];

  const currentTheme = useMemo<Theme | { colors: string[] }>(() => {
    if (currentThemeName === 'custom') {
      return { colors: normalizedCustomColors };
    }
    return Themes[currentThemeName];
  }, [currentThemeName, normalizedCustomColors]);
  const currentColors = (currentTheme.colors as string[]).filter(
    (color): color is string => !!color
  );
  const isWhiteTheme = currentColors.every(
    (color) => color.toUpperCase() === '#FFFFFF'
  );
  const isBlackTheme = currentColors.every(
    (color) => color.toUpperCase() === '#000000'
  );
  const swatchBorderColor = isWhiteTheme
    ? theme.isDark
      ? 'rgba(255,255,255,0.16)'
      : 'rgba(30,20,10,0.10)'
    : isBlackTheme
      ? theme.isDark
        ? 'rgba(255,255,255,0.16)'
        : 'rgba(17,17,17,0.12)'
      : 'transparent';

  const openDropdown = () => {
    animation.value = withTiming(1, TimingPresets.dropdown);
  };

  const closeDropdown = () => {
    animation.value = withTiming(0, TimingPresets.dropdownClose);
  };

  const handlePress = () => {
    if (isTapOpen) {
      setIsTapOpen(false);
      closeDropdown();
      return;
    }

    setIsTapOpen(true);
    openDropdown();
  };

  const handleBackdropPress = () => {
    setIsTapOpen(false);
    closeDropdown();
  };

  const handleThemeSelect = (themeName: ThemeName) => {
    qrcodeState$.currentTheme.set(themeName);

    if (themeName === 'mono') {
      qrcodeState$.pageTheme.set('light');
    } else if (themeName === 'white') {
      qrcodeState$.pageTheme.set('dark');
    }

    if (themeName === 'custom') {
      qrcodeState$.isCustomColorModalVisible.set(true);
      setIsTapOpen(false);
      closeDropdown();
      return;
    }

    setIsTapOpen(false);
    closeDropdown();
  };

  const dropdownStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [
      { translateY: (1 - animation.value) * 4 },
      { scale: 0.97 + animation.value * 0.03 },
    ],
    pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animation.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      {isTapOpen && (
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
      )}

      <Animated.View style={[styles.dropdown, dropdownStyle]}>
        <View
          style={[
            styles.dropdownContent,
            {
              backgroundColor: theme.dropdownBackground,
              borderColor: theme.borderDropdown,
              shadowColor: theme.shadowColor,
            },
          ]}
        >
          {(Object.keys(Themes) as ThemeName[]).map((themeName) => {
            const theme =
              themeName === 'custom'
                ? { colors: normalizedCustomColors }
                : Themes[themeName];
            const isSelected = themeName === currentThemeName;

            return (
              <React.Fragment key={themeName}>
                <ThemeOption
                  name={formatThemeName(themeName)}
                  theme={theme as Theme}
                  isSelected={isSelected}
                  onPress={() => handleThemeSelect(themeName)}
                />
              </React.Fragment>
            );
          })}
        </View>
      </Animated.View>

      <Pressable
        onPress={handlePress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          styles.button,
          {
            backgroundColor: isHovered || isTapOpen ? theme.hoverBackground : 'transparent',
          },
        ]}
      >
        <View style={[styles.selectedCircleFrame, { borderColor: swatchBorderColor }]}>
          <LinearGradient
            colors={currentTheme.colors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.selectedCircle}
          />
        </View>
        <Text
          style={[
            styles.buttonText,
            { color: isHovered || isTapOpen ? theme.textHovered : theme.textMuted },
          ]}
        >
          Colors
        </Text>
        <Animated.View style={chevronStyle}>
          <ChevronIcon color={isTapOpen ? theme.iconHovered : theme.iconMuted} />
        </Animated.View>
      </Pressable>
    </View>
  );
};
