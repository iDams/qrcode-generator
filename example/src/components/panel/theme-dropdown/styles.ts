import { StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  Sizes,
  BorderRadius,
} from '../../../design-tokens';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  } as any,
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    height: Sizes.button,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  buttonHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  selectedCircle: {
    width: Sizes.iconSmall - 2,
    height: Sizes.iconSmall - 2,
    borderRadius: (Sizes.iconSmall - 2) / 2,
  },
  selectedCircleFrame: {
    width: Sizes.iconSmall,
    height: Sizes.iconSmall,
    borderRadius: Sizes.iconSmall / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  buttonTextHovered: {
    color: Colors.textHovered,
  },
  dropdown: {
    position: 'absolute',
    bottom: Sizes.button - 4,
    left: 0,
    zIndex: 9999,
  },
  dropdownContent: {
    backgroundColor: Colors.dropdownBackground,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDropdown,
    overflow: 'hidden',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.lg,
  },
  optionHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  optionCircle: {
    width: Sizes.iconSmall - 2,
    height: Sizes.iconSmall - 2,
    borderRadius: (Sizes.iconSmall - 2) / 2,
  },
  optionCircleFrame: {
    width: Sizes.iconSmall,
    height: Sizes.iconSmall,
    borderRadius: Sizes.iconSmall / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: Colors.textSubtle,
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextHovered: {
    color: Colors.textPrimary,
  },
});
