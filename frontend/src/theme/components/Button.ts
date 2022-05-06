export const Button = {
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
    secondaryButton: {
      backgroundColor: '#0066FF',
      minWidth: ['120px', '120px', '200px'],
      cursor: 'pointer',
      color: '#FFF',
      _hover: {
        backgroundColor: '#0066FF',
      },
    },

    transparentButton: {
      border: '1px solid #C42CB0',
      borderRadius: '12px',
      backgroundColor: 'transparent',
      _active: {
        backgroundColor: 'transparent',
      },
      _hover: {
        backgroundColor: '#181717',
      },
    },
  },
};
export default Button;
