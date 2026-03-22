import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

type HoverPressableProps = {
  children: ReactNode | ((state: { isHovered: boolean; isPressed: boolean }) => ReactNode);
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  [key: string]: any; // Allow other standard Pressable props like href, accessibilityRole, target
};

export const HoverPressable = ({
  children,
  style,
  hoverStyle,
  pressedStyle,
  ...rest
}: HoverPressableProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Use hoverStyle as fallback for pressedStyle (for mobile touch feedback)
  const activePressedStyle = pressedStyle ?? hoverStyle;

  return (
    <Pressable
      style={[
        style,
        isHovered && hoverStyle,
        isPressed && activePressedStyle,
      ]}
      onPress={rest.onPress}
      onHoverIn={(e: any) => {
        setIsHovered(true);
        rest.onHoverIn?.(e);
      }}
      onHoverOut={(e: any) => {
        setIsHovered(false);
        rest.onHoverOut?.(e);
      }}
      onPressIn={(e) => {
        setIsPressed(true);
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setIsPressed(false);
        rest.onPressOut?.(e);
      }}
      {...rest}
    >
      {typeof children === 'function'
        ? children({ isHovered, isPressed })
        : children}
    </Pressable>
  );
};
