import React, { useCallback } from 'react';
import * as Burnt from '../../../utils/toast';
import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Image } from 'expo-image';
import { qrcodeState$ } from '../../../states';
import { useQrCodeCodeSnippets } from './use-qrcode-code-snippets';

const GitHubMark = require('../../../../assets/images/github-mark.png');

const IconStyle = { width: 18, height: 18 };

export type CopyQrCodeMode = 'react-native-skia' | 'svg' | 'html-embed';

export const useCopyQrCode = () => {
  const { getReactNativeSkiaSnippet, getSvgMarkup, getHtmlEmbedSnippet } =
    useQrCodeCodeSnippets();

  const copyQrCode = useCallback(
    (mode: CopyQrCodeMode = 'react-native-skia') => {
      const payload =
        mode === 'svg'
          ? getSvgMarkup()
          : mode === 'html-embed'
            ? getHtmlEmbedSnippet()
            : getReactNativeSkiaSnippet();

      Clipboard.setStringAsync(payload);
      qrcodeState$.copyTrigger.set((prev) => prev + 1);

      if (Platform.OS === 'web') {
        const title =
          mode === 'svg'
            ? 'SVG copied'
            : mode === 'html-embed'
              ? 'HTML embed copied'
              : 'React Native / Skia copied';

        return Burnt.toast({
          title,
          message: "Don't forget to leave a star on GitHub!",
          duration: 2,
          shouldDismissByDrag: true,
          preset: 'custom',
          haptic: 'success',
          icon: {
            ios: {
              name: 'star.fill',
              color: '#000000',
            },
            web: (
              <Image
                source={GitHubMark}
                tintColor="#FFFFFF"
                style={IconStyle}
                contentFit="contain"
              />
            ),
          },
        });
      }
    },
    [getReactNativeSkiaSnippet, getSvgMarkup, getHtmlEmbedSnippet]
  );

  return copyQrCode;
};
