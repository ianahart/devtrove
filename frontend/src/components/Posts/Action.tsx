import { IconType } from 'react-icons';
import { Box, Icon, Tooltip, PlacementWithLogical } from '@chakra-ui/react';

interface IActionProps {
  icon: IconType;
  label: string;
  placement: PlacementWithLogical | undefined;
}

const Action = ({ icon, label, placement }: IActionProps) => {
  return (
    <Tooltip hasArrow label={label} placement={placement}>
      <Box as="span">
        <Icon layerStyle="actionIcon" color="purple.tertiary" as={icon} />
      </Box>
    </Tooltip>
  );
};

export default Action;
