import { Box, Text } from '@chakra-ui/react';
import { IFooterProps } from '../../interfaces';

const Footer: React.FC<IFooterProps> = ({ name, year }: IFooterProps): JSX.Element => {
  return (
    <Box
      display="flex"
      flexDir="column"
      py="1rem"
      alignItems="center"
      backgroundColor="black.primary"
    >
      <Text color="#FFF">
        {name} &copy; {year}
      </Text>
    </Box>
  );
};

export default Footer;
