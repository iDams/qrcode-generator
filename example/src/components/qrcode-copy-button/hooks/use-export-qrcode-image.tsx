import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { Skia } from '@shopify/react-native-skia';
import * as Burnt from '../../../utils/toast';
import { qrcodeState$, GapValues } from '../../../states';
import { Themes } from '../../../constants';
import { getLogoSafeAreaSize, getLogoVisualMetrics } from '../../../utils/logo-metrics';
import { generateMatrix } from '../../../../../src/qrcode/generate-matrix';
import { transformMatrixIntoPath } from '../../../../../src/qrcode/transform-matrix-into-path';

const DefaultPadding = 128;
const BasePreviewQrSize = 260;

const imageMap: Record<string, any> = {
  'github-logo': require('../../../../assets/images/github-logo.png'),
  'github-mark': require('../../../../assets/images/github-mark.png'),
};

export const useExportQrCodeImage = () => {
  const qrUrl = useSelector(qrcodeState$.qrUrl);
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const gapSize = useSelector(qrcodeState$.gap);
  const gap = GapValues[gapSize];
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const customColors = useSelector(qrcodeState$.customColors);
  const theme = currentThemeName === 'custom' ? { colors: customColors.filter((c): c is string => !!c) } : Themes[currentThemeName];
  const isSolidTheme = currentThemeName === 'mono' || currentThemeName === 'white';
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const logoSize = useSelector(qrcodeState$.logoSize);
  const logoSafeArea = useSelector(qrcodeState$.logoSafeArea);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const exportFormat = useSelector(qrcodeState$.exportFormat);
  const exportSize = useSelector(qrcodeState$.exportSize);

  const getGradientId = (type: string) => `qr-gradient-${type}`;

  const createSvgContent = useCallback(
    (size: number, padding: number, pathData: string) => {
      const totalSize = size + padding * 2;
      const center = totalSize / 2;
      const logoCenter = center;
      const colors = theme.colors;
      const scaleFactor = size / BasePreviewQrSize;
      const logoMetrics = getLogoVisualMetrics(logoSize, true);
      const renderedLogoSize = Math.round(logoMetrics.visual * scaleFactor);
      const gradientId = getGradientId(gradientType);

      let gradientDef = '';
      let gradientFill = '';

      if (isSolidTheme) {
        gradientFill = colors[0]!;
      } else {
        const stops = colors.map((c, i) => `<stop offset="${Math.round((i / (colors.length - 1)) * 100)}%" stop-color="${c}"/>`).join('\n              ');
        switch (gradientType) {
          case 'radial':
            gradientDef = `<radialGradient id="${gradientId}" gradientUnits="userSpaceOnUse" cx="${size / 2}" cy="${size / 2}" r="${size / 2}">
              ${stops}
            </radialGradient>`;
            gradientFill = `url(#${gradientId})`;
            break;
          case 'linear':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${size}" y2="${size}">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${gradientId})`;
            break;
          case 'linear-vertical':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${size}">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${gradientId})`;
            break;
          case 'sweep':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${size}" y2="${size}">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${gradientId})`;
            break;
          case 'conical':
            gradientDef = `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${size}" y2="${size}">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${gradientId})`;
            break;
          default:
            gradientFill = colors[0]!;
        }
      }

      let logoSvg = '';
      
      if (selectedLogo && selectedLogo.type === 'emoji') {
        // Emoji logo - use text element
        const emojiValue = selectedLogo.value ?? '';
        if (!emojiValue) {
          return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>${gradientDef}</defs>
  <rect width="${totalSize}" height="${totalSize}" fill="transparent"/>
  <g transform="translate(${padding}, ${padding})">
    <path d="${pathData}" fill="${gradientFill}"/>
  </g>
</svg>`;
        }
        const fontSize = Math.round(logoMetrics.font * scaleFactor);
        logoSvg = `<text x="${logoCenter}" y="${logoCenter}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${emojiValue}</text>`;
      } else if (selectedLogo && selectedLogo.type === 'image' && selectedLogo.value && imageMap[selectedLogo.value]) {
        // Image logo - use image element with embedded data URI fallback
        logoSvg = `<image x="${logoCenter - renderedLogoSize/2}" y="${logoCenter - renderedLogoSize/2}" width="${renderedLogoSize}" height="${renderedLogoSize}" href="${imageMap[selectedLogo.value]}" preserveAspectRatio="xMidYMid meet"/>`;
      } else if (selectedLogo && selectedLogo.type === 'custom' && customLogoUri) {
        // Custom URI logo (from upload)
        logoSvg = `<image x="${logoCenter - renderedLogoSize/2}" y="${logoCenter - renderedLogoSize/2}" width="${renderedLogoSize}" height="${renderedLogoSize}" href="${customLogoUri}" preserveAspectRatio="xMidYMid meet"/>`;
      }

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>${gradientDef}</defs>
  <rect width="${totalSize}" height="${totalSize}" fill="transparent"/>
  <g transform="translate(${padding}, ${padding})">
    <path d="${pathData}" fill="${gradientFill}"/>
  </g>
  ${logoSvg}
</svg>`;
    },
    [gradientType, theme.colors, selectedLogo, customLogoUri, logoSize]
  );

  const exportAsPng = useCallback(
    async (size: number) => {
      const totalSize = size + DefaultPadding * 2;

      const surface = Skia.Surface.MakeOffscreen(totalSize, totalSize);
      if (!surface) {
        throw new Error('Could not create offscreen surface');
      }

      const canvas = surface.getCanvas();
      canvas.clear(Skia.Color('transparent'));

      const value = qrUrl || ':)';
      const matrix = generateMatrix(value, 'H');
      const logoMetrics = getLogoVisualMetrics(logoSize, true);
      const logoAreaSize = getLogoSafeAreaSize(logoSafeArea, true);
      // Logo UI base scale logic to compute scaled logo area size
      const scaleFactor = size / BasePreviewQrSize;
      const scaledGap = gap * scaleFactor;
      const scaledLogoAreaSize =
        (selectedLogo && selectedLogo.type !== 'none') || customLogoUri
          ? logoAreaSize * scaleFactor
          : 0;
      
      const pathData = transformMatrixIntoPath(
        matrix,
        size,
        {
          shape: baseShape,
          eyePatternShape: eyePatternShape,
          gap: scaledGap,
          eyePatternGap: scaledGap,
        },
        scaledLogoAreaSize
      );

      const path = Skia.Path.MakeFromSVGString(pathData.path);
      if (!path) {
        throw new Error('Could not create path');
      }

      const paint = Skia.Paint();
      const colors = (theme.colors as string[]).filter(Boolean).map((c: string) => Skia.Color(c));
      
      // Gradients are drawn *after* the canvas translates by DefaultPadding,
      // so their local coordinates should start at 0, not DefaultPadding!
      const localQrLeft = 0;
      const localQrTop = 0;
      const localQrCenterX = size / 2;
      const localQrCenterY = size / 2;

      let shader;
      if (!isSolidTheme) {
        switch (gradientType) {
          case 'radial':
            shader = Skia.Shader.MakeRadialGradient(
              { x: localQrCenterX, y: localQrCenterY },
              size / 2,
              colors,
              null,
              0
            );
            break;
          case 'linear':
            shader = Skia.Shader.MakeLinearGradient(
              { x: localQrLeft, y: localQrTop },
              { x: localQrLeft + size, y: localQrTop + size },
              colors,
              null,
              0
            );
            break;
          case 'linear-vertical':
            shader = Skia.Shader.MakeLinearGradient(
              { x: localQrLeft, y: localQrTop },
              { x: localQrLeft, y: localQrTop + size },
              colors,
              null,
              0
            );
            break;
          case 'sweep':
            shader = Skia.Shader.MakeSweepGradient(localQrCenterX, localQrCenterY, colors, null, 0);
            break;
          case 'conical':
            shader = Skia.Shader.MakeTwoPointConicalGradient(
              { x: localQrCenterX, y: localQrCenterY },
              size / 2,
              { x: localQrCenterX, y: localQrTop + 16 },
              16,
              colors,
              null,
              0
            );
            break;
          default:
            shader = Skia.Shader.MakeLinearGradient(
              { x: localQrLeft, y: localQrTop },
              { x: localQrLeft + size, y: localQrTop + size },
              colors,
              null,
              0
            );
        }
      }

      if (shader) {
        paint.setShader(shader);
      } else {
        const solidColor = colors[0] ?? Skia.Color('#000000');
        paint.setColor(solidColor as any);
      }
      
      canvas.save();
      canvas.translate(DefaultPadding, DefaultPadding);
      canvas.drawPath(path, paint);
      canvas.restore();

      // Logos are drawn *after* restore, in absolute canvas coordinates
      const absQrCenterX = DefaultPadding + size / 2;
      const absQrCenterY = DefaultPadding + size / 2;

      const drawImageToBase64 = async (src: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          // @ts-ignore
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.onload = () => {
            // @ts-ignore
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            const ctx = tempCanvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              resolve(tempCanvas.toDataURL('image/png').split(',')[1]);
            } else {
              reject(new Error('Failed to get canvas context'));
            }
          };
          img.onerror = reject;
          img.src = src;
        });
      };

      const fontSize = Math.round(logoMetrics.font * scaleFactor);
      const emojiSize = Math.round(logoMetrics.visual * scaleFactor);

      if (selectedLogo && selectedLogo.type === 'emoji') {
        const emojiValue = selectedLogo.value ?? '';
        if (emojiValue) {
          // @ts-ignore - DOM API for web
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = emojiSize;
          tempCanvas.height = emojiSize;
          // @ts-ignore
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            // @ts-ignore
            tempCtx.font = `${fontSize}px sans-serif`;
            // @ts-ignore
            tempCtx.textAlign = 'center';
            // @ts-ignore
            tempCtx.textBaseline = 'middle';
            // @ts-ignore
            tempCtx.fillText(emojiValue, emojiSize / 2, emojiSize / 2);
            // @ts-ignore
            const dataUrl = tempCanvas.toDataURL('image/png');
            const base64 = dataUrl.split(',')[1];
            const skData = Skia.Data.fromBase64(base64);
            const emojiImage = Skia.Image.MakeImageFromEncoded(skData);
            if (emojiImage) {
              const x = absQrCenterX - emojiSize / 2;
              const y = absQrCenterY - emojiSize / 2;
              const paint = Skia.Paint();
              canvas.drawImageRect(emojiImage, Skia.XYWHRect(0, 0, emojiImage.width(), emojiImage.height()), Skia.XYWHRect(x, y, emojiSize, emojiSize), paint);
            }
          }
        }
      } else if (selectedLogo && selectedLogo.type === 'image') {
        const imageLogoValue = selectedLogo.value ?? '';
        if (imageLogoValue && imageMap[imageLogoValue]) {
          try {
            const base64 = await drawImageToBase64(imageMap[imageLogoValue]!);
            const skData = Skia.Data.fromBase64(base64);
            const customImage = Skia.Image.MakeImageFromEncoded(skData);
            if (customImage) {
              const x = absQrCenterX - emojiSize / 2;
              const y = absQrCenterY - emojiSize / 2;
              const paint = Skia.Paint();
              canvas.drawImageRect(customImage, Skia.XYWHRect(0, 0, customImage.width(), customImage.height()), Skia.XYWHRect(x, y, emojiSize, emojiSize), paint);
            }
          } catch (e) {
            console.warn('Failed to load image logo', e);
          }
        }
      } else if (selectedLogo && selectedLogo.type === 'custom' && customLogoUri) {
        try {
          const base64 = await drawImageToBase64(customLogoUri!);
          const skData = Skia.Data.fromBase64(base64);
          const customImage = Skia.Image.MakeImageFromEncoded(skData);
          if (customImage) {
            const x = absQrCenterX - emojiSize / 2;
            const y = absQrCenterY - emojiSize / 2;
            const paint = Skia.Paint();
            canvas.drawImageRect(customImage, Skia.XYWHRect(0, 0, customImage.width(), customImage.height()), Skia.XYWHRect(x, y, emojiSize, emojiSize), paint);
          }
        } catch (e) {
          console.warn('Failed to load custom logo', e);
        }
      }

      const image = surface.makeImageSnapshot();
      const data = image.encodeToBase64();
      return `data:image/png;base64,${data}`;
    },
    [qrUrl, baseShape, eyePatternShape, gap, gradientType, theme.colors, selectedLogo, customLogoUri, logoSize, logoSafeArea]
  );

  const exportAsSvg = useCallback(
    (size: number) => {
      const scaleFactor = size / BasePreviewQrSize;
      const logoAreaSize = getLogoSafeAreaSize(logoSafeArea, true);
      const scaledGap = gap * scaleFactor;
      const scaledLogoAreaSize =
        (selectedLogo && selectedLogo.type !== 'none') || customLogoUri
          ? logoAreaSize * scaleFactor
          : 0;
      
      const value = qrUrl || ':)';
      const matrix = generateMatrix(value, 'H');
      const pathData = transformMatrixIntoPath(
        matrix,
        size,
        {
          shape: baseShape,
          eyePatternShape: eyePatternShape,
          gap: scaledGap,
          eyePatternGap: scaledGap,
        },
        scaledLogoAreaSize
      );
      return createSvgContent(size, DefaultPadding, pathData.path);
    },
    [qrUrl, baseShape, eyePatternShape, gap, createSvgContent, selectedLogo, customLogoUri, logoSize, logoSafeArea]
  );

  const exportQrCodeImage = useCallback(async () => {
    if (Platform.OS !== 'web') {
      return;
    }

    try {
      const size = exportSize || 1024;
      let dataUrl: string;
      let filename: string;

      if (exportFormat === 'svg') {
        dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(exportAsSvg(size));
        filename = 'qrcode.svg';
      } else {
        dataUrl = await exportAsPng(size);
        filename = 'qrcode.png';
      }

      // @ts-ignore - DOM API for web
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      link.click();

      Burnt.toast({
        title: 'QR Code Exported',
        message: `${filename.toUpperCase()} ${size}px`,
        preset: 'done',
        duration: 2,
      });
    } catch (error) {
      console.error('Export error:', error);
      Burnt.toast({
        title: 'Export Failed',
        message: String(error),
        preset: 'error',
        duration: 2,
      });
    }
  }, [exportFormat, exportSize, exportAsPng, exportAsSvg]);

  return exportQrCodeImage;
};
