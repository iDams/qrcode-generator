import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@legendapp/state/react';
import {
  qrcodeState$,
  ExportFormats,
  ExportSizes,
  type ExportFormat,
} from '../../states';
import { HoverDropdown, useDropdownClose } from './hover-dropdown';
import { Spacing } from '../../design-tokens';
import { useExportQrCodeImage } from '../qrcode-copy-button/hooks/use-export-qrcode-image';
import { useCopyQrCode, type CopyQrCodeMode } from '../qrcode-copy-button/hooks/use-copy-qrcode';
import { usePanelTheme } from './panel-theme';

const FormatIcon = ({ format, color }: { format: string; color: string }) => {
  if (format === 'svg') {
    return <Text style={[styles.formatIcon, { color }]}>▲</Text>;
  }
  return <Text style={[styles.formatIcon, { color }]}>◼</Text>;
};

export const ExportDropdown = () => {
  const exportFormat = useSelector(qrcodeState$.exportFormat);
  const exportSize = useSelector(qrcodeState$.exportSize);
  const exportImage = useExportQrCodeImage();
  const copyQrCode = useCopyQrCode();
  const [isHovered, setIsHovered] = useState(false);
  const theme = usePanelTheme();

  const currentLabel = () => {
    const sizeLabel =
      ExportSizes.find((s) => s.value === exportSize)?.label || '1024px';
    return `${exportFormat.toUpperCase()} ${sizeLabel}`;
  };

  return (
    <HoverDropdown
      trigger={
        <View style={styles.triggerContainer}>
          <FormatIcon format={exportFormat} color={theme.iconDefault} />
          <Text style={[styles.triggerText, { color: theme.textPrimary }]}>
            {currentLabel()}
          </Text>
        </View>
      }
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          FORMAT
        </Text>
        {ExportFormats.map((format) => (
          <FormatOption
            key={format}
            format={format}
            isSelected={exportFormat === format}
            onSelect={() => qrcodeState$.exportFormat.set(format)}
          />
        ))}
      </View>
      <View style={[styles.divider, { backgroundColor: theme.borderDropdown }]} />
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          SIZE
        </Text>
        {ExportSizes.map((size) => (
          <SizeOption
            key={size.id}
            size={size}
            isSelected={exportSize === size.value}
            onSelect={() => qrcodeState$.exportSize.set(size.value)}
          />
        ))}
      </View>
      <View style={[styles.divider, { backgroundColor: theme.borderDropdown }]} />
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          COPY CODE
        </Text>
        <CopyOption
          label="SVG"
          icon="copy-outline"
          mode="svg"
          onSelect={copyQrCode}
        />
        <CopyOption
          label="HTML"
          icon="globe-outline"
          mode="html-embed"
          onSelect={copyQrCode}
        />
        <CopyOption
          label="RN"
          icon="code-slash-outline"
          mode="react-native-skia"
          onSelect={copyQrCode}
        />
      </View>
      <View style={[styles.divider, { backgroundColor: theme.borderDropdown }]} />
      <Pressable
        onPress={exportImage}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[
          styles.exportButton,
          {
            backgroundColor: isHovered
              ? theme.activeBackground
              : theme.buttonBackground,
            borderColor: theme.groupBorder,
          },
        ]}
      >
        <Text style={[styles.exportButtonText, { color: theme.textPrimary }]}>
          Download
        </Text>
      </Pressable>
    </HoverDropdown>
  );
};

type FormatOptionProps = {
  format: ExportFormat;
  isSelected: boolean;
  onSelect: () => void;
};

const FormatOption = ({ format, isSelected, onSelect }: FormatOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = usePanelTheme();

  return (
    <Pressable
      onPress={onSelect}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.option,
        {
          backgroundColor:
            isHovered || isSelected ? theme.hoverBackground : 'transparent',
        },
      ]}
    >
      <FormatIcon format={format} color={theme.iconDefault} />
      <Text
        style={[
          styles.optionText,
          {
            color:
              isHovered || isSelected ? theme.textPrimary : theme.textSubtle,
          },
        ]}
      >
        {format.toUpperCase()}
      </Text>
    </Pressable>
  );
};

type SizeOptionProps = {
  size: (typeof ExportSizes)[number];
  isSelected: boolean;
  onSelect: () => void;
};

const SizeOption = ({ size, isSelected, onSelect }: SizeOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = usePanelTheme();

  return (
    <Pressable
      onPress={onSelect}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.option,
        {
          backgroundColor:
            isHovered || isSelected ? theme.hoverBackground : 'transparent',
        },
      ]}
    >
      <Text
        style={[
          styles.optionText,
          {
            color:
              isHovered || isSelected ? theme.textPrimary : theme.textSubtle,
          },
        ]}
      >
        {size.label}
      </Text>
    </Pressable>
  );
};

type CopyOptionProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  mode: CopyQrCodeMode;
  onSelect: (mode: CopyQrCodeMode) => void;
};

const CopyOption = ({ label, icon, mode, onSelect }: CopyOptionProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const closeDropdown = useDropdownClose();
  const theme = usePanelTheme();

  const handlePress = () => {
    onSelect(mode);
    closeDropdown?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={[
        styles.option,
        {
          backgroundColor: isHovered ? theme.hoverBackground : 'transparent',
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={14}
        color={isHovered ? theme.textPrimary : theme.iconDefault}
      />
      <Text
        style={[
          styles.optionText,
          { color: isHovered ? theme.textPrimary : theme.textSubtle },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  triggerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formatIcon: {
    fontSize: 10,
  },
  section: {
    paddingVertical: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xs,
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.lg,
  },
  exportButton: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  exportButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
