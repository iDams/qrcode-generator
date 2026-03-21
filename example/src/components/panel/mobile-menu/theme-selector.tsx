import React, { useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { PressableScale } from 'pressto';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from '@legendapp/state/react';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import * as Burnt from '../../../utils/toast';
import { qrcodeState$ } from '../../../states';
import { Themes, type ThemeName } from '../../../constants';
import { styles } from './styles';
import { usePanelTheme } from '../panel-theme';

const formatThemeName = (name: string) =>
  name === 'mono'
    ? 'Black'
    : name === 'white'
      ? 'White'
      : name.charAt(0).toUpperCase() + name.slice(1);

const AnimatedPressableScale = Animated.createAnimatedComponent(PressableScale);

interface ColorOptionProps {
  themeName: ThemeName;
  isSelected: boolean;
  onPress: () => void;
}

const ColorOption = ({ themeName, isSelected, onPress }: ColorOptionProps) => {
  const theme = Themes[themeName];
  const panelTheme = usePanelTheme();
  const isBlackTheme = themeName === 'mono';
  const isWhiteTheme = themeName === 'white';
  const isCustom = themeName === 'custom';
  const baseBorderColor = panelTheme.isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(17,17,17,0.08)';
  const contrastBorderColor = isWhiteTheme
    ? 'rgba(17,17,17,0.10)'
    : isBlackTheme
      ? 'rgba(255,255,255,0.14)'
      : baseBorderColor;
  const selectionRingStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0, { duration: 160 }),
    transform: [{ scale: withTiming(isSelected ? 1 : 0.92, { duration: 160 }) }],
  }));

  return (
    <AnimatedPressableScale
      onPress={onPress}
      style={styles.colorOption}
    >
      <Animated.View
        style={[
          styles.colorSelectionRing,
          { borderColor: theme.colors[0] },
          selectionRingStyle,
        ]}
      />
      <View
        style={[
          styles.colorFrame,
          { borderColor: contrastBorderColor },
        ]}
      >
        <LinearGradient
          colors={theme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.colorCircle}
        />
      </View>
      {isCustom && (
        <View
          style={[
            styles.customThemeBadge,
            {
              backgroundColor: panelTheme.dropdownBackground,
              borderColor: panelTheme.borderDropdown,
            },
          ]}
        >
          <Text style={[styles.customThemeBadgeText, { color: panelTheme.textPrimary }]}>
            +
          </Text>
        </View>
      )}
    </AnimatedPressableScale>
  );
};

export const ThemeSelector = () => {
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const customColorsRaw = useSelector(qrcodeState$.customColors) as Array<string | undefined>;
  const customColors = customColorsRaw.filter((color): color is string => typeof color === 'string');
  const theme = usePanelTheme();

  const handleSelect = useCallback((themeName: ThemeName) => {
    if (themeName === qrcodeState$.currentTheme.peek()) return;
    qrcodeState$.currentTheme.set(themeName);
    if (themeName === 'mono') {
      qrcodeState$.pageTheme.set('light');
    } else if (themeName === 'white') {
      qrcodeState$.pageTheme.set('dark');
    }
    Burnt.toast({
      title: `Theme: ${formatThemeName(themeName)}`,
      preset: 'none',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  return (
    <View>
      <View style={styles.optionsRow}>
        {(Object.keys(Themes) as ThemeName[]).map((themeName) => (
          <ColorOption
            key={themeName}
            themeName={themeName}
            isSelected={themeName === currentTheme}
            onPress={() => handleSelect(themeName)}
          />
        ))}
      </View>

      {currentTheme === 'custom' && (
        <View
          style={[
            styles.customEditor,
            {
              backgroundColor: theme.groupBackground,
              borderColor: theme.groupBorder,
            },
          ]}
        >
          <Text style={[styles.customEditorTitle, { color: theme.textMuted }]}>Custom palette</Text>
          <View style={styles.customColorRow}>
            {customColors.map((color, idx) => (
              <View
                key={`${color}-${idx}`}
                style={[
                  styles.customColorWrapper,
                  { borderColor: theme.borderDropdown },
                ]}
              >
                {Platform.OS === 'web' ? (
                  // @ts-ignore
                  <input
                    type="color"
                    value={color}
                    onChange={(e: any) => {
                      const next = [...customColors];
                      next[idx] = e.target.value;
                      qrcodeState$.customColors.set(next);
                    }}
                    style={styles.customColorInput}
                  />
                ) : (
                  <Pressable
                    style={[styles.customColorFallback, { backgroundColor: color }]}
                    onPress={() => {
                      const next = [...customColors];
                      const presets = ['#FFFFFF', '#BC002D', '#FFC107', '#2FA7C4', '#7A8CFF', '#FF8A3D'];
                      const nextColor = presets[(idx + 1) % presets.length] ?? '#FFFFFF';
                      next[idx] = nextColor;
                      qrcodeState$.customColors.set(next);
                    }}
                  />
                )}
              </View>
            ))}
          </View>

          <View style={styles.customActions}>
            <Pressable
              onPress={() => {
                if (customColors.length < 5) {
                  qrcodeState$.customColors.set([...customColors, '#FFFFFF']);
                }
              }}
              style={[
                styles.customActionBtn,
                { backgroundColor: theme.buttonBackground, borderColor: theme.groupBorder },
              ]}
            >
              <Text style={[styles.customActionText, { color: theme.textPrimary }]}>+ Add color</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (customColors.length > 1) {
                  qrcodeState$.customColors.set(customColors.slice(0, -1));
                }
              }}
              style={[
                styles.customActionBtn,
                { backgroundColor: theme.buttonBackground, borderColor: theme.groupBorder },
              ]}
            >
              <Text style={[styles.customActionText, { color: theme.textPrimary }]}>- Remove</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};
