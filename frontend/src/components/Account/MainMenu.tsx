import { Box, Image, UnorderedList } from '@chakra-ui/react';
import { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import MenuItem from './MenuItem';
import logoImage from '../../images/logo.png';
const MainMenu = () => {
  const [activeTab, setActiveTab] = useState('edit-profile');

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Box className="account-main-menu" bg="#000" borderRight="1px solid #444447">
      <Image
        margin="0.5rem"
        height="40px"
        width="40px"
        src={logoImage}
        alt="devtrove logo of pirate with code brackets"
      />
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
