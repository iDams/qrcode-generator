import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../states';
import { LinkIcon } from '../icons';
import { HoverPressable } from '../hover-pressable';
import { Spacing, Sizes, BorderRadius } from '../../design-tokens';
import { usePanelTheme } from './panel-theme';

interface URLButtonProps {
  onPress: () => void;
}

const truncateUrl = (url: string, maxLength: number = 20): string => {
  if (url.length <= maxLength) return url;

  let displayUrl = url.replace(/^https?:\/\//, '');

  if (displayUrl.length <= maxLength) return displayUrl;

  return displayUrl.substring(0, maxLength - 3) + '...';
};

export const URLButton = ({ onPress }: URLButtonProps) => {
  const currentUrl = useSelector(qrcodeState$.qrUrl);
  const displayUrl = truncateUrl(currentUrl);
  const theme = usePanelTheme();

  return (
    <HoverPressable
      style={styles.button}
      hoverStyle={{ backgroundColor: theme.hoverBackground }}
      onPress={onPress}
    >
      {({ isHovered }) => (
        <>
          <LinkIcon color={isHovered ? theme.iconHovered : theme.iconDefault} />
          <Text
            style={[
              styles.buttonText,
              { color: isHovered ? theme.textHovered : theme.textMuted },
            ]}
          >
            {displayUrl}
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
    paddingHorizontal: Spacing.xl,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  buttonHovered: {
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
