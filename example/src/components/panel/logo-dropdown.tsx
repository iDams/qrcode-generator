import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@legendapp/state/react';
import {
  qrcodeState$,
  LogoSafeAreaOptions,
  LogoSamples,
  LogoSizeOptions,
  type LogoSample,
  type LogoSafeArea,
  type LogoSize,
  type SelectedLogo,
} from '../../states';
import { HoverDropdown, useDropdownClose } from './hover-dropdown';
import { Spacing } from '../../design-tokens';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { usePanelTheme } from './panel-theme';

export const LogoDropdown = () => {
  const selectedLogo = useSelector(qrcodeState$.selectedLogo);
  const logoSize = useSelector(qrcodeState$.logoSize);
  const logoSafeArea = useSelector(qrcodeState$.logoSafeArea);
  const customLogoUri = useSelector(qrcodeState$.customLogoUri);
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const theme = usePanelTheme();

  const currentDisplay = (theme: ReturnType<typeof usePanelTheme>) => {
    if (customLogoUri) {
      return <Image source={{ uri: customLogoUri }} style={styles.customLogoPreview} contentFit="contain" />;
    }
    if (selectedLogo.type === 'emoji') {
      return <Text style={[styles.triggerEmoji, { color: theme.textPrimary }]}>{selectedLogo.value || '—'}</Text>;
    }
    return <Text style={[styles.triggerEmoji, { color: theme.textPrimary }]}>—</Text>;
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
          {currentDisplay(theme)}
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
        style={[
          styles.option,
          { backgroundColor: isUploadHovered ? theme.hoverBackground : 'transparent' },
        ]}
      >
        <Ionicons
          name="cloud-upload-outline"
          size={16}
          color={theme.textPrimary}
          style={styles.uploadIcon}
        />
        <Text style={[styles.optionText, { color: theme.textPrimary }]}>Upload image</Text>
      </Pressable>
      <View style={styles.divider} />
      <View style={styles.sizeSection}>
        <Text style={[styles.sizeLabel, { color: theme.textMuted }]}>Logo size</Text>
        <View style={[styles.sizeSelector, { backgroundColor: theme.buttonBackground }]}>
          {LogoSizeOptions.map((size) => (
            <LogoSizeButton
              key={size}
              size={size}
              isActive={logoSize === size}
              onPress={() => qrcodeState$.logoSize.set(size)}
            />
          ))}
        </View>
      </View>
      <View style={styles.sizeSection}>
        <Text style={[styles.sizeLabel, { color: theme.textMuted }]}>Safe area</Text>
        <View style={[styles.sizeSelector, { backgroundColor: theme.buttonBackground }]}>
          {LogoSafeAreaOptions.map((size) => (
            <LogoSafeAreaButton
              key={size}
              size={size}
              isActive={logoSafeArea === size}
              onPress={() => qrcodeState$.logoSafeArea.set(size)}
            />
          ))}
        </View>
      </View>
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
  const theme = usePanelTheme();

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
        { backgroundColor: isHovered || isSelected ? theme.hoverBackground : 'transparent' },
      ]}
    >
      <View style={styles.logoPreview}>
        {logo.type === 'emoji' && (
          <Text style={[styles.optionEmoji, { color: theme.textPrimary }]}>{logo.value || '—'}</Text>
        )}
        {logo.type === 'none' && (
          <Text style={[styles.optionEmoji, { color: theme.textPrimary }]}>—</Text>
        )}
      </View>
      <Text
        style={[
          styles.optionText,
          { color: isHovered || isSelected ? theme.textPrimary : theme.textSubtle },
        ]}
      >
        {logo.label}
      </Text>
    </Pressable>
  );
};

type LogoSizeButtonProps = {
  size: LogoSize;
  isActive: boolean;
  onPress: () => void;
};

const LogoSizeButton = ({ size, isActive, onPress }: LogoSizeButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = usePanelTheme();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.sizeButton,
        {
          backgroundColor: isActive
            ? theme.activeBackground
            : isHovered
              ? theme.hoverBackground
              : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.sizeButtonText,
          {
            color: isActive ? theme.textPrimary : theme.textSubtle,
          },
        ]}
      >
        {size}
      </Text>
    </Pressable>
  );
};

type LogoSafeAreaButtonProps = {
  size: LogoSafeArea;
  isActive: boolean;
  onPress: () => void;
};

const LogoSafeAreaButton = ({ size, isActive, onPress }: LogoSafeAreaButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = usePanelTheme();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.sizeButton,
        {
          backgroundColor: isActive
            ? theme.activeBackground
            : isHovered
              ? theme.hoverBackground
              : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.sizeButtonText,
          {
            color: isActive ? theme.textPrimary : theme.textSubtle,
          },
        ]}
      >
        {size}
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
  logoPreview: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  uploadIcon: {
    width: 20,
    textAlign: 'center',
  },
  sizeSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  sizeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sizeSelector: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: 10,
    padding: 3,
  },
  sizeButton: {
    minWidth: 38,
    height: 28,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeButtonText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
