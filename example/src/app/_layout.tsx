import 'react-native-reanimated';
import '../styles/global.css';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Platform, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from '../utils/toast';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../states';

// Lazy load Agentation only on web in development (optional dependency)
const useAgentation = () => {
  const [AgentationComponent, setAgentationComponent] =
    useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && process.env.NODE_ENV === 'development') {
      // @ts-ignore - agentation is an optional dev dependency
      import('agentation')
        .then((mod: { Agentation: React.ComponentType }) =>
          setAgentationComponent(() => mod.Agentation)
        )
        .catch(() => {
          // Agentation not installed, skip
        });
    }
  }, []);

  return AgentationComponent;
};

export default function RootLayout() {
  const Agentation = useAgentation();
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  const isDark = pageTheme === 'dark';

  return (
    <SafeAreaProvider style={[styles.fill, isDark ? styles.dark : styles.light]}>
      {Agentation && <Agentation />}
      <GestureHandlerRootView style={[styles.fill, isDark ? styles.dark : styles.light]}>
        <Slot />
      </GestureHandlerRootView>
      {Platform.OS === 'web' && <Toaster position="top-center" theme={isDark ? 'dark' : 'light'} />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  dark: {
    backgroundColor: '#000000',
  },
  light: {
    backgroundColor: '#F6F4EF',
  },
});
