import React, { createContext, useContext } from 'react';
import { useSelector } from '@legendapp/state/react';
import { qrcodeState$ } from '../../states';

export type PanelTheme = {
  isDark: boolean;
  panelBackground: string;
  panelBorder: string;
  groupBackground: string;
  groupBorder: string;
  buttonBackground: string;
  hoverBackground: string;
  activeBackground: string;
  dropdownBackground: string;
  borderDropdown: string;
  borderModal: string;
  textPrimary: string;
  textMuted: string;
  textSubtle: string;
  textHovered: string;
  iconDefault: string;
  iconMuted: string;
  iconHovered: string;
  shadowColor: string;
  backdrop: string;
  pageBackground: string;
};

const darkTheme: PanelTheme = {
  isDark: true,
  panelBackground: 'rgba(12, 12, 14, 0.92)',
  panelBorder: 'rgba(255,255,255,0.08)',
  groupBackground: 'rgba(255,255,255,0.03)',
  groupBorder: 'rgba(255,255,255,0.04)',
  buttonBackground: 'rgba(255,255,255,0.06)',
  hoverBackground: 'rgba(255,255,255,0.08)',
  activeBackground: 'rgba(255,255,255,0.12)',
  dropdownBackground: 'rgba(28, 28, 30, 0.98)',
  borderDropdown: 'rgba(255,255,255,0.15)',
  borderModal: 'rgba(255,255,255,0.1)',
  textPrimary: '#ffffff',
  textMuted: 'rgba(255,255,255,0.5)',
  textSubtle: 'rgba(255,255,255,0.6)',
  textHovered: 'rgba(255,255,255,0.95)',
  iconDefault: 'rgba(255,255,255,0.5)',
  iconMuted: 'rgba(255,255,255,0.4)',
  iconHovered: 'rgba(255,255,255,0.9)',
  shadowColor: '#000000',
  backdrop: 'transparent',
  pageBackground: '#000000',
};

const lightTheme: PanelTheme = {
  isDark: false,
  panelBackground: 'rgba(255, 250, 242, 0.74)',
  panelBorder: 'rgba(30, 20, 10, 0.10)',
  groupBackground: 'rgba(255,255,255,0.52)',
  groupBorder: 'rgba(30, 20, 10, 0.06)',
  buttonBackground: 'rgba(0,0,0,0.05)',
  hoverBackground: 'rgba(0,0,0,0.08)',
  activeBackground: 'rgba(0,0,0,0.11)',
  dropdownBackground: 'rgba(255, 252, 247, 0.96)',
  borderDropdown: 'rgba(30, 20, 10, 0.10)',
  borderModal: 'rgba(30, 20, 10, 0.10)',
  textPrimary: '#111111',
  textMuted: 'rgba(17,17,17,0.55)',
  textSubtle: 'rgba(17,17,17,0.62)',
  textHovered: 'rgba(17,17,17,0.92)',
  iconDefault: 'rgba(17,17,17,0.5)',
  iconMuted: 'rgba(17,17,17,0.4)',
  iconHovered: 'rgba(17,17,17,0.82)',
  shadowColor: '#000000',
  backdrop: 'transparent',
  pageBackground: '#F6F4EF',
};

const PanelThemeContext = createContext<PanelTheme>(darkTheme);

export const getPanelTheme = (isDark: boolean) => (isDark ? darkTheme : lightTheme);

export const PanelThemeProvider = ({
  children,
  isDark,
}: {
  children: React.ReactNode;
  isDark: boolean;
}) =>
  React.createElement(
    PanelThemeContext.Provider,
    { value: getPanelTheme(isDark) },
    children
  );

export const usePanelTheme = () => useContext(PanelThemeContext);

export const useResolvedPanelTheme = () => {
  const pageTheme = useSelector(qrcodeState$.pageTheme);
  return pageTheme === 'dark' ? darkTheme : lightTheme;
};
