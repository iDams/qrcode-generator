import { useCallback } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapValues } from '../../../states';
import { Themes } from '../../../constants';
import { generateMatrix } from '../../../../../src/qrcode/generate-matrix';
import { transformMatrixIntoPath } from '../../../../../src/qrcode/transform-matrix-into-path';
import { getSkiaGradientStringByType } from '../../../utils/gradient';

const PREVIEW_QR_SIZE = 260;
const PREVIEW_LOGO_AREA_SIZE = 80;
const PREVIEW_LOGO_VISUAL_SIZE = 58;
const PREVIEW_LOGO_FONT_SIZE = 42;

const escapeTemplate = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const useQrCodeCodeSnippets = () => {
  const qrUrl = useSelector(qrcodeState$.qrUrl);
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const gapSize = useSelector(qrcodeState$.gap);
  const gap = GapValues[gapSize];
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const customColors = useSelector(qrcodeState$.customColors);
  const theme =
    currentThemeName === 'custom'
      ? { colors: customColors.filter((c): c is string => !!c) }
      : Themes[currentThemeName];
  const isSolidTheme = currentThemeName === 'mono' || currentThemeName === 'white';
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);

  const getSvgMarkup = useCallback(
    (size: number = PREVIEW_QR_SIZE) => {
      const value = qrUrl || ':)';
      const scaleFactor = size / PREVIEW_QR_SIZE;
      const scaledGap = gap * scaleFactor;
      const scaledLogoAreaSize =
        (selectedLogo && selectedLogo.type !== 'none') || customLogoUri
          ? PREVIEW_LOGO_AREA_SIZE * scaleFactor
          : 0;
      const matrix = generateMatrix(value, 'H');
      const pathData = transformMatrixIntoPath(
        matrix,
        size,
        {
          shape: baseShape,
          eyePatternShape,
          gap: scaledGap,
          eyePatternGap: scaledGap,
        },
        scaledLogoAreaSize
      );

      const colors = theme.colors.filter((c): c is string => !!c);
      const gradientId = `qr-gradient-${gradientType}`;
      let gradientDef = '';
      let gradientFill = colors[0] ?? '#000000';

      if (!isSolidTheme && colors.length > 1) {
        const stops = colors
          .map(
            (c, i) =>
              `<stop offset="${Math.round((i / (colors.length - 1)) * 100)}%" stop-color="${c}"/>`
          )
          .join('\n    ');

        switch (gradientType) {
          case 'radial':
            gradientDef = `<radialGradient id="${gradientId}" gradientUnits="userSpaceOnUse" cx="${size / 2}" cy="${size / 2}" r="${size / 2}">
    ${stops}
  </radialGradient>`;
            break;
          case 'linear':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${size}" y2="${size}">
    ${stops}
  </linearGradient>`;
            break;
          case 'linear-vertical':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${size}">
    ${stops}
  </linearGradient>`;
            break;
          case 'sweep':
          case 'conical':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${size}" y2="${size}">
    ${stops}
  </linearGradient>`;
            break;
        }

        if (gradientDef) {
          gradientFill = `url(#${gradientId})`;
        }
      }

      let logoSvg = '';
      const logoSize = Math.round(PREVIEW_LOGO_VISUAL_SIZE * scaleFactor);
      if (selectedLogo?.type === 'emoji' && selectedLogo.value) {
        const fontSize = Math.round(PREVIEW_LOGO_FONT_SIZE * scaleFactor);
        logoSvg = `<text x="${size / 2}" y="${size / 2}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${escapeXml(selectedLogo.value)}</text>`;
      } else if (selectedLogo?.type === 'custom' && customLogoUri) {
        logoSvg = `<image x="${size / 2 - logoSize / 2}" y="${size / 2 - logoSize / 2}" width="${logoSize}" height="${logoSize}" href="${customLogoUri}" preserveAspectRatio="xMidYMid meet"/>`;
      }

      return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientDef}
  </defs>
  <path d="${pathData.path}" fill="${gradientFill}"/>
  ${logoSvg}
</svg>`;
    },
    [
      qrUrl,
      gap,
      selectedLogo,
      customLogoUri,
      baseShape,
      eyePatternShape,
      theme.colors,
      isSolidTheme,
      gradientType,
    ]
  );

  const getHtmlEmbedSnippet = useCallback(() => {
    return `<div class="imarco-qr">
  ${getSvgMarkup()}
</div>

<style>
  .imarco-qr {
    width: ${PREVIEW_QR_SIZE}px;
    max-width: 100%;
    display: inline-block;
  }

  .imarco-qr svg {
    width: 100%;
    height: auto;
    display: block;
  }
</style>`;
  }, [getSvgMarkup]);

  const getReactNativeSkiaSnippet = useCallback(() => {
    const colors = theme.colors.filter((c): c is string => !!c);
    const hasLogo =
      Boolean(customLogoUri) ||
      (selectedLogo?.type !== 'none' && Boolean(selectedLogo?.value));

    const imports = [
      "import React from 'react';",
      "import { View, Text } from 'react-native';",
      "import { Image } from 'expo-image';",
      "import QRCode from 'react-native-qrcode-skia';",
    ];

    const logoProps = (() => {
      if (!hasLogo) {
        return '';
      }

      if (customLogoUri) {
        return `
      logo={
        <View style={{ height: ${PREVIEW_LOGO_VISUAL_SIZE}, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: \`${escapeTemplate(customLogoUri)}\` }}
            style={{ width: ${PREVIEW_LOGO_VISUAL_SIZE}, height: ${PREVIEW_LOGO_VISUAL_SIZE} }}
            contentFit="contain"
          />
        </View>
      }
      logoAreaSize={${PREVIEW_LOGO_AREA_SIZE}}`;
      }

      if (selectedLogo?.type === 'emoji' && selectedLogo.value) {
        return `
      logo={
        <View style={{ height: ${PREVIEW_LOGO_VISUAL_SIZE}, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: ${PREVIEW_LOGO_FONT_SIZE} }}>${selectedLogo.value}</Text>
        </View>
      }
      logoAreaSize={${PREVIEW_LOGO_AREA_SIZE}}`;
      }

      return '';
    })();

    const gradientSnippet = isSolidTheme
      ? ''
      : `
    >
      ${getSkiaGradientStringByType({
        gradient: gradientType,
        size: PREVIEW_QR_SIZE,
        colors,
      })}
    </QRCode>`;

    const opening = `export function MyQRCode() {
  return (
    <QRCode
      value="${escapeTemplate(qrUrl || ':)')}"
      size={${PREVIEW_QR_SIZE}}
      color="${colors[0] ?? '#000000'}"
      shapeOptions={{
        shape: '${baseShape}',
        eyePatternShape: '${eyePatternShape}',
        eyePatternGap: ${gap},
        gap: ${gap},
      }}${logoProps}`;

    const closing = isSolidTheme ? `
    />
  );
}` : `
  );
}`;

    return `${imports.join('\n')}

${opening}${gradientSnippet}${closing}`;
  }, [
    theme.colors,
    customLogoUri,
    selectedLogo,
    qrUrl,
    baseShape,
    eyePatternShape,
    gap,
    gradientType,
    isSolidTheme,
  ]);

  return {
    getSvgMarkup,
    getHtmlEmbedSnippet,
    getReactNativeSkiaSnippet,
  };
};
