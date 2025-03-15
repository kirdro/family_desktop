/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    warning: '#FFA500',  // Orange
    success: '#4CAF50',  // Green
    info: '#2196F3',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    warning: '#FFA500',  // Orange
    success: '#4CAF50',  // Green
    info: '#2196F3',
  },
};

export const colors = {
  primary: '#2196F3',
  primaryLight: '#64B5F6',
  primaryDark: '#1976D2',
  secondary: '#FF4081',
  background: '#F5F5F5', // Цвет фона приложения
  surface: '#FFFFFF',    // Цвет поверхности компонентов
  error: '#B00020',
  text: '#000000',
  textSecondary: 'rgba(0, 0, 0, 0.6)',
  disabled: 'rgba(0, 0, 0, 0.38)', // Отключенные элементы
};