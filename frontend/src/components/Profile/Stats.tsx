import { Box, Heading, Icon, Text } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { GiRibbonMedal } from 'react-icons/gi';
interface IStatsProps<T> {
  countTags: { [key: string]: number };
}

const Stats = ({ countTags }: IStatsProps<object>) => {
  const medals = ['gold', 'silver', '#CD7F32'];
  return (
    <Box p="0.75rem">
      <Box my="2rem">
        <Heading as="h3" fontSize="18px" color="#FFF">
          Top tags read this year
        </Heading>
        <Text mt="0.5rem" color="purple.tertiary">
          Remember you only get 3 reads counted towards this metric.
        </Text>
        {Object.keys(countTags).length > 0 && (
          <Box display="flex">
            <Box display="flex" flexDir="column" justifyContent="space-around">
              {medals.map((medal) => {
                return (
                  <Icon
                    key={nanoid()}
                    my="0.5"
                    fontSize="24px"
                    as={GiRibbonMedal}
                    color={medal}
                  />
                );
              })}
            </Box>
            <Box flexDir="column" display="flex">
              {Object.keys(countTags).map((key, i) => {
                return (
                  <Box
                    key={nanoid()}
                    borderRadius="20px"
                    bg="#1f1f21"
                    my="0.5rem"
                    p="0.2rem"
                    width="100%"
                    minWidth="200px"
                  >
                    <Text px="0.3rem" key={nanoid()} color="#FFF">
                      {key}:{' '}
                      <Box as="span" fontWeight="bold">
                        {countTags[key]}%
                      </Box>
                    </Text>
                    <Box
                      width={countTags[key]}
                      height="2px"
                      bg="#FFF"
                      borderRadius="20px"
                    ></Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Stats;
