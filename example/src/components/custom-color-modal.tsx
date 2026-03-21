import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
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
  const { height: windowHeight } = useWindowDimensions();
  const visible = useSelector(qrcodeState$.isCustomColorModalVisible);
  const customColors = useSelector(qrcodeState$.customColors);
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  const isDark = pageTheme === 'dark';
  const animation = useSharedValue(0);
  const theme = isDark
    ? {
        modalBackground: 'rgba(18, 18, 20, 0.96)',
        modalBorder: 'rgba(255,255,255,0.08)',
        headerBorder: 'rgba(255,255,255,0.08)',
        textPrimary: Colors.textPrimary,
        textMuted: Colors.textMuted,
        colorBorder: 'rgba(255,255,255,0.09)',
        actionBackground: 'rgba(255,255,255,0.06)',
        actionBorder: 'rgba(255,255,255,0.06)',
        backdrop: 'rgba(0,0,0,0.38)',
        shadowColor: '#000000',
      }
    : {
        modalBackground: 'rgba(255, 252, 247, 0.96)',
        modalBorder: 'rgba(30, 20, 10, 0.10)',
        headerBorder: 'rgba(30, 20, 10, 0.10)',
        textPrimary: '#111111',
        textMuted: 'rgba(17,17,17,0.55)',
        colorBorder: 'rgba(30,20,10,0.10)',
        actionBackground: 'rgba(0,0,0,0.05)',
        actionBorder: 'rgba(30,20,10,0.08)',
        backdrop: 'rgba(255,250,242,0.32)',
        shadowColor: '#000000',
      };

  // Drag state
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const baseOffsetY =
    Platform.OS === 'web' ? Math.min(windowHeight * 0.18, 180) : 80;

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
      { translateY: baseOffsetY + translateY.value },
      { scale: 0.95 + animation.value * 0.05 },
    ],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backdrop }]}
      pointerEvents={visible ? 'box-none' : 'none'}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: theme.modalBackground,
              borderColor: theme.modalBorder,
              shadowColor: theme.shadowColor,
            },
            animatedStyle,
          ]}
          pointerEvents={visible ? 'auto' : 'none'}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: theme.headerBorder },
            ]}
          >
            <Text style={[styles.title, { color: theme.textPrimary }]}>Custom Colors</Text>
            <Pressable onPress={handleClose} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: theme.textMuted }]}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.colorRow}>
              {customColors.map((color, idx) => (
                <View
                  key={idx}
                  style={[styles.colorWrapper, { borderColor: theme.colorBorder }]}
                >
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
              <Pressable
                onPress={addColor}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: theme.actionBackground,
                    borderColor: theme.actionBorder,
                  },
                ]}
              >
                <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>+ Add</Text>
              </Pressable>
              <Pressable
                onPress={removeColor}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: theme.actionBackground,
                    borderColor: theme.actionBorder,
                  },
                ]}
              >
                <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>- Remove</Text>
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
    width: 340,
    backgroundColor: 'rgba(18, 18, 20, 0.96)',
    borderRadius: BorderRadius.xl + 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.48,
    shadowRadius: 36,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl + 2,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    cursor: 'grab',
  } as any,
  title: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.textMuted,
    fontSize: 16,
    lineHeight: 18,
  },
  content: {
    padding: Spacing.xl + 2,
    gap: Spacing.lg + 2,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  colorWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  colorInput: {
    width: 54,
    height: 54,
    padding: 0,
    margin: -6,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  } as any,
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  actionBtnText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
});
