import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from '@legendapp/state/react';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { useCopyQrCode } from './qrcode-copy-button/hooks/use-copy-qrcode';
import { qrcodeState$ } from '../states';
import { Colors, Sizes } from '../design-tokens';

export const QRCodeDisplay = () => {
  const copyQrCode = useCopyQrCode();
  const active = useSharedValue(false);
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  const isDark = pageTheme === 'dark';
  const loaderColor = isDark ? Colors.loaderColor : 'rgba(0,0,0,0.35)';

  const tapGesture = Gesture.Tap()
    .maxDuration(4000)
    .onTouchesDown(() => {
      active.value = true;
    })
    .onTouchesUp(() => {
      runOnJS(copyQrCode)();
    })
    .onFinalize(() => {
      active.value = false;
    });

  const hoverGesture = Gesture.Hover()
    .activeCursor('grab')
    .onBegin(() => {
      active.value = true;
    })
    .onFinalize(() => {
      active.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active.value ? 0.97 : 1) }],
  }));

  const gestures = Gesture.Simultaneous(tapGesture, hoverGesture);

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gestures}>
        <Animated.View style={animatedStyle}>
          <WithSkiaWeb
            getComponent={() => import('./qrcode')}
            fallback={
              <View style={styles.loader}>
                <ActivityIndicator size="small" color={loaderColor} />
              </View>
            }
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: Sizes.qrCode,
    height: Sizes.qrCode,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
