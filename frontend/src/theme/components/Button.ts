import { IButtonTheme } from '../../interfaces';

export const Button: IButtonTheme = {
  baseStyle: { _focus: { boxShadow: 'none' } },
  variants: {
    entryButton: {
      backgroundColor: '#7d547f',
      minWidth: ['120px', '120px', '200px'],
      transition: 'all 0.5s ease-in-out',
      cursor: 'pointer',
      textTransform: 'capitalize',
      color: '#FFF',
      _hover: {
        backgroundColor: '#5A3D5C',
      },
    },
  },
};
export default Button;
