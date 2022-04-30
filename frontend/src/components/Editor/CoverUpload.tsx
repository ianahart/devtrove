import { Box, Button, FormControl, Icon, Image, Input, Text } from '@chakra-ui/react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MdCloudUpload } from 'react-icons/md';
import { ICoverUploadProps } from '../../interfaces/props';

const CoverUpload = ({
  dataURL,
  addDataURL,
  applyErrors,
  addFile,
  clearFile,
}: ICoverUploadProps) => {
  const dropzoneStyle = {
    borderColor: dataURL.length ? 'transparent' : '#C42CB0',
    borderRadius: dataURL.length ? '12px' : '0px',
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    if (file.size > 1200000) {
      applyErrors('File size must be under 1.2MB.');
      return;
    }
    addFile(file);
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      if (e.target) {
        if (typeof e.target?.result === 'string') {
          addDataURL(e.target?.result);
        }
      }
    };
    fileReader.readAsDataURL(file);
  };

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    readFile(file);
  };
  return (
    <>
      <Box
        onDrop={handleOnDrop}
        margin="6rem auto 1rem auto"
        height="200px"
        width="200px"
        zIndex="5"
        position="relative"
        borderStyle="dashed"
        borderRadius={dropzoneStyle.borderRadius}
        borderColor={dropzoneStyle.borderColor}
        borderWidth="1px"
      >
        <FormControl
          height="100%"
          width="100%"
          textAlign="center"
          margin="0 auto 2rem auto"
          display="flex"
          justifyContent="center"
        >
          <Input
            height="100%"
            width="100%"
            onChange={handleOnChange}
            type="file"
            name="file"
            position="absolute"
            left="0"
            opacity="0"
            accept="image/png, image/jpeg"
            cursor="pointer"
            zIndex="3"
          />
        </FormControl>

        {dataURL.length > 0 ? (
          <>
            <Icon
              onClick={clearFile}
              cursor="pointer"
              zIndex="10"
              color="purple.secondary"
              as={AiOutlineCloseCircle}
              position="absolute"
              fontSize="26px"
              top="-25px"
              right="-20px"
            />
            <Image
              position="absolute"
              top="0"
              height="100%"
              width="100%"
              src={dataURL}
              alt="post cover"
            />
          </>
        ) : (
          <Box
            mt="3rem"
            position="absolute"
            top="-25px"
            left="25px"
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={MdCloudUpload} fontSize="80px" color="blue.primary" />
            <Text>No file chosen, yet!</Text>
          </Box>
        )}
      </Box>
      <FormControl
        textAlign="center"
        margin="0 auto 2rem auto"
        display="flex"
        justifyContent="center"
      >
        <Box position="relative">
          <Button borderRadius="20px" variant="entryButton">
            Choose a photo
          </Button>
          <Input
            onChange={handleOnChange}
            type="file"
            name="file"
            position="absolute"
            left="0"
            opacity="0"
            width="200px"
            accept="image/png, image/jpeg"
            cursor="pointer"
            zIndex="1"
          />
        </Box>
      </FormControl>
    </>
  );
};

export default CoverUpload;
