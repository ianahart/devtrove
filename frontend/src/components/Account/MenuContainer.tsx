import { Text, UnorderedList } from '@chakra-ui/react';
import ViewBox from './ViewBox';

interface IMenuContainerProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

const MenuContainer = ({ children, title }: IMenuContainerProps): JSX.Element => {
  return (
    <>
      <UnorderedList
        listStyleType="none"
        margin="0"
        className="account-menu"
        bg="primary.black"
        borderRight="1px solid #444447"
      >
        <Text m="1rem auto 3rem auto" textAlign="center" color="#FFF" fontSize="24px">
          {title}
        </Text>
        {children}
      </UnorderedList>
      <ViewBox />
    </>
  );
};

export default MenuContainer;
