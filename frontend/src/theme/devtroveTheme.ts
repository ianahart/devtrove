import { extendTheme } from '@chakra-ui/react';
import { components } from './components';

export const devtroveTheme = extendTheme({
  components,
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
      primary: '#969eb5',
      secondary: '#444447',
    },
    light: {
      primary: '#e4e3e3',
    },
    dark: {
      primary: '#382039',
    },
    night: {
      primary: '#7d547f',
      secondary: '#5A3D5C',
    },
    purple: {
      primary: '#F638DC',
      secondary: '#C42CB0',
    },
    blue: {
      primary: '#0066FF',
    },
  },
});
