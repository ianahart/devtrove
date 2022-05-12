import { useContext } from 'react';
import { Image, Icon } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';
import { IGlobalContext } from '../../interfaces/';
import { GlobalContext } from '../../context/global';
interface IProfilePictureProps {
  height: string;
  width: string;
  avatar_url: string | null | undefined;
  borderRadius: string;
}

const ProfilePicture = ({
  avatar_url,
  height,
  borderRadius = '50%',
  width,
}: IProfilePictureProps) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  return (
    <>
      {avatar_url ? (
        <Image
          height={height}
          width={width}
          borderRadius={borderRadius}
          src={avatar_url as string}
        />
      ) : (
        <Icon as={FaUserCircle} color="purple.secondary" height="40px" width="40px" />
      )}
    </>
  );
};

export default ProfilePicture;
