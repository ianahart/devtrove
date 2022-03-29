import { useState } from 'react';
import { Text, UnorderedList } from '@chakra-ui/react';
import { AiOutlineSecurityScan } from 'react-icons/ai';
import { BsPencil } from 'react-icons/bs';
import MenuItem from './MenuItem';
import ViewBox from './ViewBox';
const ProfileMenu = () => {
  const [activeTab, setActiveTab] = useState('edit-profile');

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <UnorderedList
        listStyleType="none"
        margin="0"
        className="account-menu"
        bg="primary.black"
        borderRight="1px solid #444447"
      >
        <Text textAlign="center" color="#FFF" fontSize="30px">
          My Profile
        </Text>
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
      </UnorderedList>
      <ViewBox />
    </>
  );
};

export default ProfileMenu;
