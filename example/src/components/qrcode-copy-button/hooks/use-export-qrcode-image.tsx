import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { Skia } from '@shopify/react-native-skia';
import * as Burnt from '../../../utils/toast';
import { qrcodeState$, GapValues } from '../../../states';
import { Themes } from '../../../constants';
import { generateMatrix } from '../../../../../src/qrcode/generate-matrix';
import { transformMatrixIntoPath } from '../../../../../src/qrcode/transform-matrix-into-path';

const DefaultPadding = 128;

const imageMap: Record<string, string> = {
  'github-logo': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  'github-mark': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
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
      const logoSize = Math.round(38 * (size / 220) * 1.5);

      let gradientDef = '';
      let gradientFill = '';

      if (isSolidTheme) {
        gradientFill = colors[0]!;
      } else {
        const stops = colors.map((c, i) => `<stop offset="${Math.round((i / (colors.length - 1)) * 100)}%" stop-color="${c}"/>`).join('\n              ');
        switch (gradientType) {
          case 'radial':
            gradientDef = `<radialGradient id="${getGradientId(gradientType)}" cx="50%" cy="50%" r="50%">
              ${stops}
            </radialGradient>`;
            gradientFill = `url(#${getGradientId(gradientType)})`;
            break;
          case 'linear':
            gradientDef = `<linearGradient id="${getGradientId(gradientType)}" x1="0%" y1="0%" x2="100%" y2="0%">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${getGradientId(gradientType)})`;
            break;
          case 'linear-vertical':
            gradientDef = `<linearGradient id="${getGradientId(gradientType)}" x1="0%" y1="0%" x2="0%" y2="100%">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${getGradientId(gradientType)})`;
            break;
          case 'sweep':
            gradientDef = `<linearGradient id="${getGradientId(gradientType)}" x1="0%" y1="0%" x2="100%" y2="100%">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${getGradientId(gradientType)})`;
            break;
          case 'conical':
            gradientDef = `<linearGradient id="${getGradientId(gradientType)}" x1="0%" y1="0%" x2="100%" y2="100%">
              ${stops}
            </linearGradient>`;
            gradientFill = `url(#${getGradientId(gradientType)})`;
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
        const fontSize = Math.round(38 * (size / 220));
        logoSvg = `<text x="${logoCenter}" y="${logoCenter}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central">${emojiValue}</text>`;
      } else if (selectedLogo && selectedLogo.type === 'image' && selectedLogo.value && imageMap[selectedLogo.value]) {
        // Image logo - use image element with embedded data URI fallback
        logoSvg = `<image x="${logoCenter - logoSize/2}" y="${logoCenter - logoSize/2}" width="${logoSize}" height="${logoSize}" href="${imageMap[selectedLogo.value]}" preserveAspectRatio="xMidYMid meet"/>`;
      } else if (selectedLogo && selectedLogo.type === 'custom' && customLogoUri) {
        // Custom URI logo (from upload)
        logoSvg = `<image x="${logoCenter - logoSize/2}" y="${logoCenter - logoSize/2}" width="${logoSize}" height="${logoSize}" href="${customLogoUri}" preserveAspectRatio="xMidYMid meet"/>`;
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
    [gradientType, theme.colors, selectedLogo]
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
      // Logo UI base scale logic to compute scaled logo area size
      const scaleFactor = size / 220; 
      const scaledLogoAreaSize = (selectedLogo && selectedLogo.type !== 'none') || customLogoUri ? 70 * scaleFactor : 0;
      
      const pathData = transformMatrixIntoPath(
        matrix,
        size,
        {
          shape: baseShape,
          eyePatternShape: eyePatternShape,
          gap: gap,
          eyePatternGap: gap,
        },
        scaledLogoAreaSize
      );

      const path = Skia.Path.MakeFromSVGString(pathData.path);
      if (!path) {
        throw new Error('Could not create path');
      }

      const paint = Skia.Paint();
      const colors = (theme.colors as string[]).filter(Boolean).map((c: string) => Skia.Color(c));
      const center = totalSize / 2;

      let shader;
      if (!isSolidTheme) {
        switch (gradientType) {
          case 'radial':
            shader = Skia.Shader.MakeRadialGradient(
              { x: center, y: center },
              size / 2,
              colors,
              null,
              0
            );
            break;
          case 'linear':
            shader = Skia.Shader.MakeLinearGradient(
              { x: DefaultPadding, y: center },
              { x: DefaultPadding + size, y: center },
              colors,
              null,
              0
            );
            break;
          case 'linear-vertical':
            shader = Skia.Shader.MakeLinearGradient(
              { x: center, y: DefaultPadding },
              { x: center, y: DefaultPadding + size },
              colors,
              null,
              0
            );
            break;
          case 'sweep':
            shader = Skia.Shader.MakeSweepGradient(center, center, colors, null, 0);
            break;
          case 'conical':
            shader = Skia.Shader.MakeTwoPointConicalGradient(
              { x: center, y: center },
              0,
              { x: center, y: center },
              size / 2,
              colors,
              null,
              0
            );
            break;
          default:
            shader = Skia.Shader.MakeLinearGradient(
              { x: DefaultPadding, y: center },
              { x: DefaultPadding + size, y: center },
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

      const fontSize = Math.round(38 * scaleFactor);
      const emojiSize = Math.round(fontSize * 1.5);

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
              const x = center - emojiSize / 2;
              const y = center - emojiSize / 2;
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
              const x = center - emojiSize / 2;
              const y = center - emojiSize / 2;
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
            const x = center - emojiSize / 2;
            const y = center - emojiSize / 2;
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
    [qrUrl, baseShape, eyePatternShape, gap, gradientType, theme.colors, selectedLogo]
  );

  const exportAsSvg = useCallback(
    (size: number) => {
      const scaleFactor = size / 220; // Base size in UI is 220
      // Consider logo size in UI is 70 for 220 QR size
      const scaledLogoAreaSize = (selectedLogo && selectedLogo.type !== 'none') || customLogoUri ? 70 * scaleFactor : 0;
      
      const value = qrUrl || ':)';
      const matrix = generateMatrix(value, 'H');
      const pathData = transformMatrixIntoPath(
        matrix,
        size,
        {
          shape: baseShape,
          eyePatternShape: eyePatternShape,
          gap: gap,
          eyePatternGap: gap,
        },
        scaledLogoAreaSize
      );
      return createSvgContent(size, DefaultPadding, pathData.path);
    },
    [qrUrl, baseShape, eyePatternShape, gap, createSvgContent, selectedLogo, customLogoUri]
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
