import { Box, Icon, Tooltip } from '@chakra-ui/react';
import { IActionProps } from '../../interfaces/props';
const Action = ({ icon, count, label, placement, color, activeIcon }: IActionProps) => {
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
          color={activeIcon ? color : '#6e6e8a'}
          as={icon}
        />

        {count > 0 ? (
          <Box textAlign="center" fontWeight="bold" color="text.primary">
            {count}
          </Box>
        ) : (
          <Box></Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default Action;
