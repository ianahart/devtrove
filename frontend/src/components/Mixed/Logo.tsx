import { Box, Heading, Image } from '@chakra-ui/react';
import logo from '../../images/logo.png';
import { ILogoProps } from '../../interfaces';
import '@fontsource/im-fell-english-sc';

const Logo: React.FC<ILogoProps> = ({
  textOne,
  textTwo,
  height,
  width,
  fontSize,
}: ILogoProps): JSX.Element => {
  return (
    <Box
      p="0.5rem"
      display="flex"
      alignItems="center"
      textShadow="2px 7px 5px rgba(0,0,0,0.3), 
    0px -4px 10px rgba(255,255,255,0.3)"
    >
      <Heading
        fontFamily="IM Fell English SC, sans-serif"
        alignSelf="flex-end"
        fontSize={fontSize}
      >
        {textOne}
      </Heading>
      <Image height={height} width={width} src={logo} alt="pirate with code brackets" />
      <Heading
        fontFamily="IM Fell English SC, sans-serif"
        alignSelf="flex-end"
        fontSize={fontSize}
      >
        {textTwo}
      </Heading>
    </Box>
  );
};

export default Logo;
