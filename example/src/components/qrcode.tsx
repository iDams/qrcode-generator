import QRCode from 'react-native-qrcode-skia';
import React, { useMemo, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapValues } from '../states';
import { Themes } from '../constants';
import { getSkiaGradientByType } from '../utils/gradient';
import { StyleSheet, Text, Platform, Image } from 'react-native';
import { SvgUri } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { isEmbedded } from '../hooks/use-embedded';

const isWeb = Platform.OS === 'web';
const isDesktopWeb = isWeb && !isEmbedded;
const QRCodeSize = isDesktopWeb ? 260 : 220;
const LogoAreaSize = isDesktopWeb ? 80 : 70;
const LogoHeight = isDesktopWeb ? 58 : 50;
const LogoFontSize = isDesktopWeb ? 42 : 38;

const SPRING_CONFIG = {
  mass: 1,
  stiffness: 80,
  damping: 12,
} as const;

const AnimatedLogoEmoji = ({ emoji }: { emoji: string }) => {
  const copyTrigger = useSelector(qrcodeState$.copyTrigger);
  const rotation = useSharedValue(0);
  const initialTrigger = React.useRef(copyTrigger);

  useEffect(() => {
    const diff = copyTrigger - initialTrigger.current;
    if (diff > 0) {
      rotation.value = withSpring(diff * 360, SPRING_CONFIG);
    }
  }, [copyTrigger, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.logo, animatedStyle]}>
      <Text style={styles.logoLabel}>{emoji}</Text>
    </Animated.View>
  );
};

const AnimatedLogoImage = ({ source }: { source: any }) => {
  const copyTrigger = useSelector(qrcodeState$.copyTrigger);
  const scale = useSharedValue(1);
  const initialTrigger = React.useRef(copyTrigger);

  useEffect(() => {
    const diff = copyTrigger - initialTrigger.current;
    if (diff > 0) {
      scale.value = withSpring(1.2, SPRING_CONFIG, () => {
        scale.value = withSpring(1, SPRING_CONFIG);
      });
    }
  }, [copyTrigger, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const sourceUri =
    typeof source === 'object' && source !== null && 'uri' in source
      ? source.uri
      : '';
  const isSvgDataUri =
    typeof sourceUri === 'string' && sourceUri.startsWith('data:image/svg+xml');

  return (
    <Animated.View style={[styles.logo, animatedStyle]}>
      {isSvgDataUri ? (
        <SvgUri uri={sourceUri} width={LogoHeight} height={LogoHeight} />
      ) : (
        <Image source={source} style={styles.logoImage} resizeMode="contain" />
      )}
    </Animated.View>
  );
};

const LogoContent = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);

  if (customLogoUri) {
    return <AnimatedLogoImage source={{ uri: customLogoUri }} />;
  }

  if (selectedLogo.type === 'emoji') {
    return <AnimatedLogoEmoji emoji={selectedLogo.value} />;
  }

  return null;
};

function QRCodeDemo() {
  const qrUrl = useSelector(qrcodeState$.qrUrl);
  const baseShape = useSelector(qrcodeState$.baseShape);
  const eyePatternShape = useSelector(qrcodeState$.eyePatternShape);
  const gapSize = useSelector(qrcodeState$.gap);
  const gap = GapValues[gapSize];
  const gradientType = useSelector(qrcodeState$.selectedGradient);
  const currentThemeName = useSelector(qrcodeState$.currentTheme);
  const customColors = useSelector(qrcodeState$.customColors);
  const theme = currentThemeName === 'custom' ? { colors: customColors } : Themes[currentThemeName];
  const isSolidTheme = currentThemeName === 'mono' || currentThemeName === 'white';

  const gradientComponent = useMemo(
    () => {
      if (isSolidTheme) {
        return null;
      }
      return getSkiaGradientByType({
        gradient: gradientType,
        colors: [...theme.colors].filter((c): c is string => c !== undefined),
        size: QRCodeSize,
      });
    },
    [gradientType, theme.colors, isSolidTheme]
  );

  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const hasLogo = customLogoUri || (selectedLogo.type !== 'none' && selectedLogo.value);

  const logoProps = useMemo(() => {
    if (!hasLogo) {
      return {};
    }
    return {
      logo: <LogoContent />,
      logoAreaSize: LogoAreaSize,
    };
  }, [hasLogo]);

  return (
    <Animated.View
      style={styles.frame}
    >
      <QRCode
        value={qrUrl || ':)'}
        size={QRCodeSize}
        color={theme.colors[0]}
        shapeOptions={{
          shape: baseShape,
          gap: gap,
          eyePatternGap: gap,
          eyePatternShape: eyePatternShape,
        }}
        {...logoProps}
      >
        {gradientComponent}
      </QRCode>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: LogoHeight,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLabel: {
    fontSize: LogoFontSize,
  },
  logoImage: {
    width: LogoHeight,
    height: LogoHeight,
  },
  frame: {
    alignSelf: 'center',
  },
});

export default QRCodeDemo;
