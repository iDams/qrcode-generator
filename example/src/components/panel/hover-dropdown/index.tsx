import React, { useState, useCallback, useContext } from 'react';
import type { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ChevronIcon } from '../../icons';
import { TimingPresets } from '../../../animations';
import { DropdownCloseContext, DropdownDirectionContext } from './context';
import { styles } from './styles';
import { usePanelTheme } from '../panel-theme';

export { useDropdownClose, DropdownDirectionProvider } from './context';

type HoverDropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  label?: string;
};

export const HoverDropdown = ({
  trigger,
  children,
  label,
}: HoverDropdownProps) => {
  const direction = useContext(DropdownDirectionContext);
  const theme = usePanelTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isTapOpen, setIsTapOpen] = useState(false);
  const animation = useSharedValue(0);

  const isOpen = isTapOpen;

  const openDropdown = useCallback(() => {
    animation.value = withTiming(1, TimingPresets.dropdown);
  }, [animation]);

  const closeDropdown = useCallback(() => {
    animation.value = withTiming(0, TimingPresets.dropdownClose);
  }, [animation]);

  const handlePress = () => {
    if (isTapOpen) {
      setIsTapOpen(false);
      closeDropdown();
    } else {
      setIsTapOpen(true);
      openDropdown();
    }
  };

  const handleBackdropPress = () => {
    setIsTapOpen(false);
    closeDropdown();
  };

  const closeFromChild = useCallback(() => {
    setIsTapOpen(false);
    closeDropdown();
  }, [closeDropdown]);

  const dropdownStyle = useAnimatedStyle(() => {
    const translateDirection = direction === 'up' ? 1 : -1;
    return {
      opacity: animation.value,
      transform: [
        { translateY: (1 - animation.value) * 4 * translateDirection },
        { scale: 0.97 + animation.value * 0.03 },
      ],
      pointerEvents: animation.value > 0.5 ? 'auto' : 'none',
    };
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animation.value * 180}deg` }],
  }));

  return (
    <View style={styles.container}>
      {isTapOpen && (
        <Pressable style={styles.backdrop} onPress={handleBackdropPress} />
      )}

      <Animated.View
        style={[
          styles.dropdown,
          direction === 'down' ? styles.dropdownDown : styles.dropdownUp,
          {
            shadowColor: theme.shadowColor,
          },
          dropdownStyle,
        ]}
      >
        <View
          style={[
            styles.dropdownContent,
            {
              backgroundColor: theme.dropdownBackground,
              borderColor: theme.borderDropdown,
            },
          ]}
        >
          <DropdownCloseContext.Provider value={closeFromChild}>
            {children}
          </DropdownCloseContext.Provider>
        </View>
      </Animated.View>

      <Pressable
        onPress={handlePress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          styles.button,
          { backgroundColor: isHovered || isOpen ? theme.hoverBackground : 'transparent' },
        ]}
      >
        {trigger}
        {label && (
          <Text
            style={[
              styles.buttonText,
              { color: isHovered || isOpen ? theme.textHovered : theme.textMuted },
            ]}
          >
            {label}
          </Text>
        )}
        <Animated.View style={chevronStyle}>
          <ChevronIcon color={isOpen ? theme.iconHovered : theme.iconMuted} />
        </Animated.View>
      </Pressable>
    </View>
  );
};
