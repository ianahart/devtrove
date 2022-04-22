import { useContext } from 'react';
import { Image, Icon } from '@chakra-ui/react';
import { FaUserCircle } from 'react-icons/fa';

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
        <Icon as={FaUserCircle} color="#FFF" height="40px" width="40px" />
      )}
    </>
  );
};

export default ProfilePicture;
