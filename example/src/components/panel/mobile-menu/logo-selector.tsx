import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { PressableScale } from 'pressto';
import * as Burnt from '../../../utils/toast';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, LogoSamples, type SelectedLogo } from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';
import { Image } from 'expo-image';

const imageMap: Record<string, any> = {
  'github-logo': require('../../../../assets/images/github-logo.png'),
  'github-mark': require('../../../../assets/images/github-mark.png'),
};

export const LogoSelector = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const themeColor = Themes[currentTheme].colors[0];

  const handleSelect = useCallback((logo: typeof LogoSamples[number]) => {
    qrcodeState$.customLogoUri.set('');
    qrcodeState$.selectedLogo.set({ type: logo.type, value: logo.value ?? '' });
    Burnt.toast({
      title: logo.type === 'emoji' && logo.value ? `Logo: ${logo.value}` : `Logo: ${logo.label}`,
      preset: 'none',
      haptic: 'success',
      duration: 1,
    });
  }, []);

  const isSelected = (logo: typeof LogoSamples[number]) => {
    if (customLogoUri && logo.id === 'none') return false;
    const currentLogo = selectedLogo as SelectedLogo;
    if (currentLogo.type === logo.type && currentLogo.value === logo.value) {
      if (logo.type === 'none' && currentLogo.value === '') return true;
      return true;
    }
    return false;
  };

  const renderLogoContent = (logo: typeof LogoSamples[number]) => {
    if (logo.type === 'emoji') return <Text style={styles.logoEmoji}>{logo.value || '—'}</Text>;
    if (logo.type === 'image' && logo.value && imageMap[logo.value]) {
      return <Image source={imageMap[logo.value]} style={styles.logoImage} contentFit="contain" />;
    }
    return <Text style={styles.logoEmoji}>—</Text>;
  };

  return (
    <View style={styles.optionsRow}>
      {LogoSamples.map((logo) => {
        const selected = isSelected(logo);
        return (
          <PressableScale
            key={logo.id}
            onPress={() => handleSelect(logo)}
            style={[styles.logoOption, selected && { backgroundColor: themeColor }]}
          >
            {renderLogoContent(logo)}
          </PressableScale>
        );
      })}
    </View>
  );
};