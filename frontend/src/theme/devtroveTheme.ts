import { extendTheme } from '@chakra-ui/react';
import { components } from './components';
import { layerStyles } from './layerStyles';
export const devtroveTheme = extendTheme({
  components,
  layerStyles,
  fonts: {
    heading: 'Roboto Condensed, sans-serif',
    body: 'Open Sans, sans-serif',
  },
  colors: {
    black: {
      primary: '#181717',
      secondary: '#200F21',
    },
    text: {
      primary: '#8a8f9d',
      secondary: '#444447',
      tertiary: '#403d40',
    },
    light: {
      primary: '#e4e3e3',
    },
    dark: {
      primary: '#382039',
      secondary: '#363636',
    },
    night: {
      primary: '#7d547f',
      secondary: '#5A3D5C',
    },
    purple: {
      primary: '#F638DC',
      secondary: '#C42CB0',
      tertiary: '#6e6e8a',
    },
    blue: {
      primary: '#0066FF',
    },
  },
});
