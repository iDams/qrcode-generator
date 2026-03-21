import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSelector } from '@legendapp/state/react';

import { Panel } from './panel';
import { QRCodeDisplay } from './qrcode-display';
import { URLInputModal } from './url-input-modal';
import { CustomColorModal } from './custom-color-modal';
import { Colors } from '../design-tokens';
import { qrcodeState$ } from '../states';
import { PageThemeToggle } from './page-theme-toggle';

const DRAWER_MAX_HEIGHT_PERCENT = 0.7;

export default function App() {
  const { height: windowHeight } = useWindowDimensions();
  const [isURLModalVisible, setIsURLModalVisible] = useState(false);
  const drawerProgress = useSharedValue(0);
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  const isDark = pageTheme === 'dark';
  const loaderColor = isDark ? Colors.loaderColor : 'rgba(0,0,0,0.35)';

  useEffect(() => {
    const webDocument = (globalThis as { document?: any }).document;
    if (!webDocument) {
      return;
    }

    const backgroundColor = isDark ? '#000000' : '#F6F4EF';
    webDocument.documentElement.style.backgroundColor = backgroundColor;
    webDocument.body.style.backgroundColor = backgroundColor;
    webDocument.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const handleURLButtonPress = useCallback(() => {
    setIsURLModalVisible(true);
  }, []);

  const handleURLModalClose = useCallback(() => {
    setIsURLModalVisible(false);
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    // Calculate translation to center QR code in visible area above drawer
    // Drawer takes up to 70% of screen, so visible area is 30%
    // Move content up by half the drawer height to center it in remaining space
    const translateY =
      (-drawerProgress.value * (windowHeight * DRAWER_MAX_HEIGHT_PERCENT)) / 2.8;
    const scale = 1 - drawerProgress.value * 0.02;

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  useEffect(() => {
    const webDocument = (globalThis as { document?: any }).document;
    if (webDocument) {
      const handleKeyDown = (e: {
        key: string;
        metaKey: boolean;
        ctrlKey: boolean;
        preventDefault: () => void;
      }) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setIsURLModalVisible((prev) => !prev);
        }
      };
      webDocument.addEventListener('keydown', handleKeyDown, true);
      return () => webDocument.removeEventListener('keydown', handleKeyDown, true);
    }
    return undefined;
  }, []);

  return (
    <View style={[styles.container, isDark ? styles.dark : styles.light]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.topRight}>
        <PageThemeToggle />
      </View>
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <React.Suspense
          fallback={
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={loaderColor} />
            </View>
          }
        >
          <QRCodeDisplay />
        </React.Suspense>
      </Animated.View>
      <Panel
        onURLButtonPress={handleURLButtonPress}
        drawerProgress={drawerProgress}
      />
      <URLInputModal
        visible={isURLModalVisible}
        onClose={handleURLModalClose}
      />
      <CustomColorModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dark: {
    backgroundColor: '#000000',
  },
  light: {
    backgroundColor: '#F6F4EF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRight: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 300,
  },
  loader: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
