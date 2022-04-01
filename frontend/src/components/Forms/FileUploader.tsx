import { Box, Icon, Image, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { BsCamera } from 'react-icons/bs';
import { HiUserCircle, HiOutlinePencil } from 'react-icons/hi';
import { IFileUploaderProps } from '../../interfaces/index';

const FileUploader = ({ avatar, handleAvatarError, saveAvatar }: IFileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const handleOnDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    readFile(event.dataTransfer.files[0]);
    setIsDragging(false);
  };

  const handleOnDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList instanceof FileList) {
      readFile(fileList[0]);
    }
  };

  const readFile = (data: File) => {
    handleAvatarError('', false);
    if (data.size > 1500000) {
      handleAvatarError('Your avatar must be under 1.5MB.', true);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e!.target?.result) {
        const url = e!.target?.result as string;
        saveAvatar({ data, url });
      }
    };
    fileReader.readAsDataURL(data);
  };

  return (
    <Box
      onDrop={handleOnDrop}
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
      layerStyle="mdCircle"
      cursor="pointer"
      position="relative"
    >
      <Input
        zIndex="2"
        type="file"
        name="file"
        accept="image/png, image/jpeg"
        onChange={handleOnChange}
        layerStyle="mdCircle"
        position="absolute"
        cursor="pointer"
        top="0"
        opacity="0"
        left="0"
      />
      {isDragging && (
        <Box
          position="absolute"
          top="0"
          left="0"
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          layerStyle="mdCircle"
          bg="rgba(0, 0, 0, 0.7)"
        >
          <Icon as={BsCamera} color="#FFF" height="40px" width="40px" />
        </Box>
      )}

      {avatar?.url ? (
        <Image layerStyle="mdCircle" src={avatar.url} />
      ) : (
        <>
          <Icon
            as={HiUserCircle}
            layerStyle="mdCircle"
            borderStyle="solid"
            borderWidth="1px"
            borderColor="purple.primary"
            bg="black"
            color="purple.secondary"
          />
        </>
      )}
      {!isDragging && (
        <Icon
          position="absolute"
          bottom="10px"
          right="2px"
          as={HiOutlinePencil}
          height="40px"
          width="40px"
          color="#FFF"
          padding="0.3rem"
          borderRadius="50%"
          boxShadow="lg"
          bg="blue.primary"
        />
      )}
    </Box>
  );
};

export default FileUploader;
