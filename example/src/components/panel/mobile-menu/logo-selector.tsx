import React, { useCallback } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { PressableScale } from 'pressto';
import * as Burnt from '../../../utils/toast';
import { useSelector } from '@legendapp/state/react';
import {
  qrcodeState$,
  LogoSafeAreaOptions,
  LogoSamples,
  LogoSizeOptions,
  type LogoSafeArea,
  type LogoSize,
  type SelectedLogo,
} from '../../../states';
import { Themes } from '../../../constants';
import { styles } from './styles';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { usePanelTheme } from '../panel-theme';

const imageMap: Record<string, any> = {
  'github-logo': require('../../../../assets/images/github-logo.png'),
  'github-mark': require('../../../../assets/images/github-mark.png'),
};

export const LogoSelector = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const logoSize = useSelector(qrcodeState$.logoSize);
  const logoSafeArea = useSelector(qrcodeState$.logoSafeArea);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const currentTheme = useSelector(qrcodeState$.currentTheme);
  const themeColor = Themes[currentTheme].colors[0];
  const panelTheme = usePanelTheme();

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

  const handleUploadImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        qrcodeState$.customLogoUri.set(result.assets[0].uri);
        qrcodeState$.selectedLogo.set({ type: 'custom', value: '' });
        Burnt.toast({
          title: 'Logo uploaded',
          preset: 'none',
          haptic: 'success',
          duration: 1,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  }, []);

  return (
    <View>
      <View style={styles.optionsRow}>
        {LogoSamples.map((logo) => {
          const selected = isSelected(logo);
          return (
            <PressableScale
              key={logo.id}
              onPress={() => handleSelect(logo)}
              style={[
                styles.logoOption,
                {
                  backgroundColor: selected ? themeColor : panelTheme.buttonBackground,
                },
              ]}
            >
              {renderLogoContent(logo)}
            </PressableScale>
          );
        })}
      </View>
      <Pressable
        onPress={handleUploadImage}
        style={[
          styles.logoUploadButton,
          {
            backgroundColor: panelTheme.buttonBackground,
            borderColor: panelTheme.groupBorder,
          },
        ]}
      >
        <Text style={[styles.logoUploadText, { color: panelTheme.textPrimary }]}>Upload image</Text>
      </Pressable>
      <View style={styles.logoSizeSection}>
        <Text style={[styles.sectionTitle, { color: panelTheme.textMuted }]}>Size</Text>
        <View
          style={[
            styles.logoSizeRow,
            {
              backgroundColor: panelTheme.buttonBackground,
              borderColor: panelTheme.groupBorder,
            },
          ]}
        >
          {LogoSizeOptions.map((size) => (
            <LogoSizeOption
              key={size}
              size={size}
              isActive={logoSize === size}
              activeColor={themeColor}
              onPress={() => qrcodeState$.logoSize.set(size)}
            />
          ))}
        </View>
      </View>
      <View style={styles.logoSizeSection}>
        <Text style={[styles.sectionTitle, { color: panelTheme.textMuted }]}>Safe area</Text>
        <View
          style={[
            styles.logoSizeRow,
            {
              backgroundColor: panelTheme.buttonBackground,
              borderColor: panelTheme.groupBorder,
            },
          ]}
        >
          {LogoSafeAreaOptions.map((size) => (
            <LogoSafeAreaOption
              key={size}
              size={size}
              isActive={logoSafeArea === size}
              activeColor={themeColor}
              onPress={() => qrcodeState$.logoSafeArea.set(size)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

type LogoSizeOptionProps = {
  size: LogoSize;
  isActive: boolean;
  activeColor: string;
  onPress: () => void;
};

const LogoSizeOption = ({ size, isActive, activeColor, onPress }: LogoSizeOptionProps) => {
  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.logoSizeOption,
        {
          backgroundColor: isActive ? activeColor : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.logoSizeText,
          isActive && styles.logoSizeTextSelected,
        ]}
      >
        {size}
      </Text>
    </PressableScale>
  );
};

type LogoSafeAreaOptionProps = {
  size: LogoSafeArea;
  isActive: boolean;
  activeColor: string;
  onPress: () => void;
};

const LogoSafeAreaOption = ({ size, isActive, activeColor, onPress }: LogoSafeAreaOptionProps) => {
  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.logoSizeOption,
        {
          backgroundColor: isActive ? activeColor : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.logoSizeText,
          isActive && styles.logoSizeTextSelected,
        ]}
      >
        {size}
      </Text>
    </PressableScale>
  );
};
