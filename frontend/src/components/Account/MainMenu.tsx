import { Box, Image, UnorderedList } from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { BiUser } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import GoBack from '../Mixed/GoBack';
import MenuItem from './MenuItem';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import logoImage from '../../images/logo.png';
import lightLogoImage from '../../images/light-logo.png';
const MainMenu = () => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const [activeTab, setActiveTab] = useState('edit-profile');

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Box
      height="auto"
      className="account-main-menu"
      bg={theme === 'dark' ? '#000' : '#FFF'}
      borderRight="1px solid #444447"
    >
      <Image
        margin="0.5rem"
        height="40px"
        width="40px"
        src={theme === 'dark' ? logoImage : lightLogoImage}
        alt="devtrove logo of pirate with code brackets"
      />
      <GoBack />
      <UnorderedList my="2rem" listStyleType="none">
        <MenuItem
          menu="parent"
          handleSetActiveTab={handleSetActiveTab}
          activeTab={activeTab}
          linkText="Profile"
          icon={BiUser}
          to="profile/edit"
        />
        <MenuItem
          menu="parent"
          handleSetActiveTab={handleSetActiveTab}
          activeTab={activeTab}
          linkText="Settings"
          icon={FiSettings}
          to="settings"
        />
      </UnorderedList>
    </Box>
  );
};
export default MainMenu;
