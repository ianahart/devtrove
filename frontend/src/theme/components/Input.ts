import { IInputTheme } from '../../interfaces';

export const Input: IInputTheme = {
  variants: {
    inputEntry: {
      field: {
        border: '1px solid #F638DC',
        color: '#FFF',
        width: '100%',
        backgroundColor: 'transparent',
        _focus: {
          boxShadow: '0 0 7px #F638DC',
        },
      },
    },
  },
};
