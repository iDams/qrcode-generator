import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, LogoSamples, type LogoSample, type SelectedLogo } from '../../states';
import { HoverDropdown, useDropdownClose } from './hover-dropdown';
import { Colors, Spacing } from '../../design-tokens';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

const LogoImage = ({ logoId, size = 20 }: { logoId: string; size?: number }) => {
  const imageMap: Record<string, any> = {
    'github-logo': require('../../../assets/images/github-logo.png'),
    'github-mark': require('../../../assets/images/github-mark.png'),
  };

  const source = imageMap[logoId];
  if (!source) return null;

  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
};

export const LogoDropdown = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const [isUploadHovered, setIsUploadHovered] = useState(false);

  const currentDisplay = () => {
    if (customLogoUri) {
      return <Image source={{ uri: customLogoUri }} style={styles.customLogoPreview} contentFit="contain" />;
    }
    if (selectedLogo.type === 'emoji') {
      return <Text style={styles.triggerEmoji}>{selectedLogo.value || '—'}</Text>;
    }
    if (selectedLogo.type === 'image') {
      return <LogoImage logoId={selectedLogo.value} size={20} />;
    }
    return <Text style={styles.triggerEmoji}>—</Text>;
  };

  const handleLogoSelect = (logo: LogoSample) => {
    qrcodeState$.customLogoUri.set('');
    qrcodeState$.selectedLogo.set({ type: logo.type, value: logo.value ?? '' });
  };

  const handleCustomImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        qrcodeState$.customLogoUri.set(result.assets[0].uri);
        qrcodeState$.selectedLogo.set({ type: 'custom', value: '' });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const isSelected = (logo: LogoSample) => {
    if (customLogoUri && logo.id === 'none') return false;
    const currentLogo = selectedLogo as SelectedLogo;
    if (currentLogo.type === logo.type && currentLogo.value === logo.value) {
      if (logo.type === 'none' && currentLogo.value === '') return true;
      return true;
    }
    return false;
  };

  return (
    <HoverDropdown
      label="Logo"
      trigger={
        <View style={styles.triggerContainer}>
          {currentDisplay()}
        </View>
      }
    >
      {LogoSamples.map((logo) => (
        <LogoOption
          key={logo.id}
          logo={logo}
          isSelected={isSelected(logo)}
          onSelect={() => handleLogoSelect(logo)}
        />
      ))}
      <View style={styles.divider} />
      <Pressable
        onPress={handleCustomImageUpload}
        onHoverIn={() => setIsUploadHovered(true)}
        onHoverOut={() => setIsUploadHovered(false)}
        style={[styles.option, isUploadHovered && styles.optionHovered]}
      >
        <Text style={styles.uploadIcon}>📁</Text>
        <Text style={styles.optionText}>Upload image</Text>
      </Pressable>
    </HoverDropdown>
  );
};

type LogoOptionProps = {
  logo: LogoSample;
  isSelected: boolean;
  onSelect: () => void;
};

const LogoOption = ({ logo, isSelected, onSelect }: LogoOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const closeDropdown = useDropdownClose();

  const handlePress = () => {
    onSelect();
    closeDropdown?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.option,
        (isHovered || isSelected) && styles.optionHovered,
      ]}
    >
      <View style={styles.logoPreview}>
        {logo.type === 'emoji' && (
          <Text style={styles.optionEmoji}>{logo.value || '—'}</Text>
        )}
        {logo.type === 'image' && logo.value && (
          <LogoImage logoId={logo.value} size={20} />
        )}
        {logo.type === 'none' && (
          <Text style={styles.optionEmoji}>—</Text>
        )}
      </View>
      <Text
        style={[
          styles.optionText,
          (isHovered || isSelected) && styles.optionTextHovered,
        ]}
      >
        {logo.label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  triggerContainer: {
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerEmoji: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  customLogoPreview: {
    width: 24,
    height: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.lg,
  },
  optionHovered: {
    backgroundColor: Colors.hoverBackground,
  },
  logoPreview: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  optionText: {
    color: Colors.textSubtle,
    fontSize: 13,
    fontWeight: '500',
  },
  optionTextHovered: {
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.hoverBackground,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  uploadIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
});