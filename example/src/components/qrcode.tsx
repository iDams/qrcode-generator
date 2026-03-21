import QRCode from 'react-native-qrcode-skia';
import React, { useMemo, useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, GapValues } from '../states';
import { Themes } from '../constants';
import { getSkiaGradientByType } from '../utils/gradient';
import { getLogoSafeAreaSize, getLogoVisualMetrics } from '../utils/logo-metrics';
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

const SPRING_CONFIG = {
  mass: 1,
  stiffness: 80,
  damping: 12,
} as const;

const AnimatedLogoEmoji = ({
  emoji,
  visualSize,
  fontSize,
}: {
  emoji: string;
  visualSize: number;
  fontSize: number;
}) => {
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
    <Animated.View style={[styles.logo, { height: visualSize }, animatedStyle]}>
      <Text style={[styles.logoLabel, { fontSize }]}>{emoji}</Text>
    </Animated.View>
  );
};

const AnimatedLogoImage = ({
  source,
  visualSize,
}: {
  source: any;
  visualSize: number;
}) => {
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
    <Animated.View style={[styles.logo, { height: visualSize }, animatedStyle]}>
      {isSvgDataUri ? (
        <SvgUri uri={sourceUri} width={visualSize} height={visualSize} />
      ) : (
        <Image
          source={source}
          style={[styles.logoImage, { width: visualSize, height: visualSize }]}
          resizeMode="contain"
        />
      )}
    </Animated.View>
  );
};

const LogoContent = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const logoSize = useSelector(qrcodeState$.logoSize);
  const metrics = getLogoVisualMetrics(logoSize, isDesktopWeb);

  if (customLogoUri) {
    return <AnimatedLogoImage source={{ uri: customLogoUri }} visualSize={metrics.visual} />;
  }

  if (selectedLogo.type === 'emoji') {
    return (
      <AnimatedLogoEmoji
        emoji={selectedLogo.value}
        visualSize={metrics.visual}
        fontSize={metrics.font}
      />
    );
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
  const logoSafeArea = useSelector(qrcodeState$.logoSafeArea);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const hasLogo = customLogoUri || (selectedLogo.type !== 'none' && selectedLogo.value);
  const logoAreaSize = getLogoSafeAreaSize(logoSafeArea, isDesktopWeb);

  const logoProps = useMemo(() => {
    if (!hasLogo) {
      return {};
    }
    return {
      logo: <LogoContent />,
      logoAreaSize,
    };
  }, [hasLogo, logoAreaSize]);

  return (
    <Animated.View
      style={styles.frame}
    >
      <QRCode
        value={qrUrl || ':)'}
        size={QRCodeSize}
        {...(isSolidTheme ? { color: theme.colors[0] } : {})}
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
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLabel: {
  },
  logoImage: {
  },
  frame: {
    alignSelf: 'center',
  },
});

export default QRCodeDemo;
