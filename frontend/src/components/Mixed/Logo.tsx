import { Box, Heading, Image } from '@chakra-ui/react';
import { useContext } from 'react';
import logo from '../../images/logo.png';
import lightLogo from '../../images/light-logo.png';
import { ILogoProps } from '../../interfaces/props';
import '@fontsource/im-fell-english-sc';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces/';

const Logo: React.FC<ILogoProps> = ({
  textOne,
  textTwo,
  height,
  width,
  fontSize,
}: ILogoProps): JSX.Element => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <Box
      color={theme === 'dark' ? '#fff' : '#000'}
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
      {theme === 'dark' ? (
        <Image height={height} width={width} src={logo} alt="pirate with code brackets" />
      ) : (
        <Image
          height={height}
          width={width}
          src={lightLogo}
          alt="pirate with code brackets"
        />
      )}
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
