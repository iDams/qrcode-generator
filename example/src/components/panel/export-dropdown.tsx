import React, { useState } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$, ExportFormats, ExportSizes, type ExportFormat } from '../../states';
import { HoverDropdown, useDropdownClose } from './hover-dropdown';
import { Colors, Spacing } from '../../design-tokens';
import { useExportQrCodeImage } from '../qrcode-copy-button/hooks/use-export-qrcode-image';

const FormatIcon = ({ format }: { format: string }) => {
  if (format === 'svg') {
    return <Text style={styles.formatIcon}>▲</Text>;
  }
  return <Text style={styles.formatIcon}>◼</Text>;
};

export const ExportDropdown = () => {
  const exportFormat = useSelector(qrcodeState$.exportFormat);
  const exportSize = useSelector(qrcodeState$.exportSize);
  const exportImage = useExportQrCodeImage();
  const [isHovered, setIsHovered] = useState(false);

  const currentLabel = () => {
    const sizeLabel = ExportSizes.find(s => s.value === exportSize)?.label || '1024px';
    return `${exportFormat.toUpperCase()} ${sizeLabel}`;
  };

  return (
    <HoverDropdown
      trigger={
        <View style={styles.triggerContainer}>
          <FormatIcon format={exportFormat} />
          <Text style={styles.triggerText}>{currentLabel()}</Text>
        </View>
      }
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FORMAT</Text>
        {ExportFormats.map((format) => (
          <FormatOption
            key={format}
            format={format}
            isSelected={exportFormat === format}
            onSelect={() => qrcodeState$.exportFormat.set(format)}
          />
        ))}
      </View>
      <View style={styles.divider} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SIZE</Text>
        {ExportSizes.map((size) => (
          <SizeOption
            key={size.id}
            size={size}
            isSelected={exportSize === size.value}
            onSelect={() => qrcodeState$.exportSize.set(size.value)}
          />
        ))}
      </View>
      <View style={styles.divider} />
      <Pressable
        onPress={exportImage}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={[styles.exportButton, isHovered && styles.exportButtonHovered]}
      >
        <Text style={styles.exportButtonText}>Download</Text>
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
      <FormatIcon format={format} />
      <Text style={[styles.optionText, (isHovered || isSelected) && styles.optionTextHovered]}>
        {format.toUpperCase()}
      </Text>
    </Pressable>
  );
};

type SizeOptionProps = {
  size: typeof ExportSizes[number];
  isSelected: boolean;
  onSelect: () => void;
};

const SizeOption = ({ size, isSelected, onSelect }: SizeOptionProps) => {
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
      <Text style={[styles.optionText, (isHovered || isSelected) && styles.optionTextHovered]}>
        {size.label}
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
    color: Colors.textPrimary,
  },
  formatIcon: {
    fontSize: 10,
    color: Colors.textPrimary,
  },
  section: {
    paddingVertical: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
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
  optionHovered: {
    backgroundColor: Colors.hoverBackground,
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
    backgroundColor: Colors.borderSubtle,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.lg,
  },
  exportButton: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.buttonBackground,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonHovered: {
    backgroundColor: Colors.activeBackground,
  },
  exportButtonText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});