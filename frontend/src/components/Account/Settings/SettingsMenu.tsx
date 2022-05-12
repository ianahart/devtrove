import { useState } from 'react';
import { GoSettings } from 'react-icons/go';
import { RiUserSettingsLine } from 'react-icons/ri';
import MenuItem from '../MenuItem';
import MenuContainer from '../MenuContainer';
const SettingsMenu = () => {
  const [activeTab, setActiveTab] = useState('edit-profile');

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <MenuContainer title="My Settings">
      <MenuItem
        handleSetActiveTab={handleSetActiveTab}
        menu="child"
        activeTab={activeTab}
        to="general"
        icon={GoSettings}
        linkText="General Settings"
      />
      <MenuItem
        menu="child"
        handleSetActiveTab={handleSetActiveTab}
        activeTab={activeTab}
        to="user"
        icon={RiUserSettingsLine}
        linkText="User Settings"
      />
    </MenuContainer>
  );
};

export default SettingsMenu;
