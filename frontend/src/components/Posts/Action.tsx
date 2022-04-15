import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { IActionProps } from '../../interfaces';
const Action = ({ icon, label, placement, color }: IActionProps) => {
  return (
    <Tooltip hasArrow label={label} placement={placement}>
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        width="30px"
        justifyContent="center"
        borderRadius="8px"
        height="auto"
        _hover={{ bg: `${color}` }}
        as="span"
      >
        <Icon
          _hover={{ color: '#FFF' }}
          layerStyle="actionIcon"
          color="purple.tertiary"
          as={icon}
        />
      </Box>
    </Tooltip>
  );
};

export default Action;
