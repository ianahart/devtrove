import { useState } from 'react';
import { AiOutlineSecurityScan } from 'react-icons/ai';
import { BsPencil } from 'react-icons/bs';
import MenuItem from '../MenuItem';
import MenuContainer from '../MenuContainer';
const ProfileMenu = () => {
  const [activeTab, setActiveTab] = useState('edit-profile');

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <MenuContainer title="My Profile">
      <MenuItem
        handleSetActiveTab={handleSetActiveTab}
        menu="child"
        activeTab={activeTab}
        to="edit"
        icon={BsPencil}
        linkText="Edit Profile"
      />
      <MenuItem
        menu="child"
        handleSetActiveTab={handleSetActiveTab}
        activeTab={activeTab}
        to="security"
        icon={AiOutlineSecurityScan}
        linkText="Password & Security"
      />
    </MenuContainer>
  );
};

export default ProfileMenu;
