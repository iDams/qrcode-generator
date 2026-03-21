import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../states';
import { Colors, BorderRadius, Spacing } from '../design-tokens';
import { TimingPresets } from '../animations';

export const CustomColorModal = () => {
  const visible = useSelector(qrcodeState$.isCustomColorModalVisible);
  const customColors = useSelector(qrcodeState$.customColors);
  const animation = useSharedValue(0);

  // Drag state
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      animation.value = withTiming(1, TimingPresets.modalIn);
    } else {
      animation.value = withTiming(0, TimingPresets.modalOut);
    }
  }, [visible, animation]);

  const handleClose = () => {
    qrcodeState$.isCustomColorModalVisible.set(false);
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...customColors].filter((c): c is string => c !== undefined);
    newColors[index] = color;
    qrcodeState$.customColors.set(newColors);
  };

  const addColor = () => {
    if (customColors.length < 5) {
      const newColors = [...customColors].filter((c): c is string => c !== undefined);
      qrcodeState$.customColors.set([...newColors, '#FFFFFF']);
    }
  };

  const removeColor = () => {
    if (customColors.length > 1) {
      const newColors = [...customColors].filter((c): c is string => c !== undefined);
      newColors.pop();
      qrcodeState$.customColors.set(newColors);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: 0.95 + animation.value * 0.05 },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents={visible ? 'box-none' : 'none'}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.modal, animatedStyle]} pointerEvents={visible ? 'auto' : 'none'}>
          <View style={styles.header}>
            <Text style={styles.title}>Custom Colors</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.colorRow}>
              {customColors.map((color, idx) => (
                <View key={idx} style={styles.colorWrapper}>
                  {Platform.OS === 'web' ? (
                    // @ts-ignore
                    <input
                      type="color"
                      value={color}
                      onChange={(e: any) => updateColor(idx, e.target.value)}
                      style={styles.colorInput}
                    />
                  ) : null}
                </View>
              ))}
            </View>

            <View style={styles.actions}>
              <Pressable onPress={addColor} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>+ Add</Text>
              </Pressable>
              <Pressable onPress={removeColor} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>- Remove</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modal: {
    width: 320,
    backgroundColor: Colors.modalBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderModal,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderModal,
    cursor: 'grab',
  } as any,
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  closeBtn: {
    padding: Spacing.sm,
  },
  closeBtnText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.borderModal,
  },
  colorInput: {
    width: 48,
    height: 48,
    padding: 0,
    margin: -6,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  } as any,
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.hoverBackground,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  actionBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
});
