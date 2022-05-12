import { Text, UnorderedList } from '@chakra-ui/react';
import { useContext } from 'react';
import ViewBox from './ViewBox';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces/';
interface IMenuContainerProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

const MenuContainer = ({ children, title }: IMenuContainerProps): JSX.Element => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <>
      <UnorderedList
        height="auto"
        listStyleType="none"
        margin="0"
        className="account-menu"
        bg="primary.black"
        borderRight="1px solid #444447"
      >
        <Text
          m="1rem auto 3rem auto"
          textAlign="center"
          color={theme === 'dark' ? '#fFF' : '#000'}
          fontSize="24px"
        >
          {title}
        </Text>
        {children}
      </UnorderedList>
      <ViewBox />
    </>
  );
};

export default MenuContainer;
