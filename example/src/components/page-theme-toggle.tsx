import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@legendapp/state/react';
import { HoverPressable } from './hover-pressable';
import { qrcodeState$ } from '../states';
import {
  Colors,
  Spacing,
  BorderRadius,
} from '../design-tokens';

export const PageThemeToggle = () => {
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  const isDark = pageTheme === 'dark';

  const handlePress = () => {
    qrcodeState$.pageTheme.set(isDark ? 'light' : 'dark');
  };

  return (
    <HoverPressable
      style={[
        styles.button,
        isDark ? styles.buttonDark : styles.buttonLight,
      ]}
      hoverStyle={isDark ? styles.buttonDarkHovered : styles.buttonLightHovered}
      onPress={handlePress}
    >
      {({ isHovered }) => (
        <>
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={16}
            color={isDark ? Colors.textPrimary : Colors.background}
          />
          <Text
            style={[
              styles.text,
              isDark ? styles.textDark : styles.textLight,
              isHovered && styles.textHovered,
            ]}
          >
            {isDark ? 'Day mode' : 'Dark mode'}
          </Text>
        </>
      )}
    </HoverPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    height: 40,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  buttonDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.16)',
  },
  buttonLight: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderColor: 'rgba(0,0,0,0.12)',
  },
  buttonDarkHovered: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  buttonLightHovered: {
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textDark: {
    color: Colors.textPrimary,
  },
  textLight: {
    color: Colors.background,
  },
  textHovered: {
    opacity: 0.95,
  },
});
