import { Box, Heading, Icon, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { nanoid } from 'nanoid';
import { GlobalContext } from '../../context/global';
import { IGlobalContext } from '../../interfaces';
import { ResponsiveCalendarCanvas } from '@nivo/calendar';
import { GiRibbonMedal } from 'react-icons/gi';
import { IStatsProps } from '../../interfaces/props';
const Stats = ({ countTags, articles_read, dates, calendar }: IStatsProps<object>) => {
  const { theme } = useContext(GlobalContext) as IGlobalContext;
  const medals = ['gold', 'silver', '#CD7F32'];
  return (
    <Box p="0.75rem">
      <Box my="2rem">
        <Heading as="h3" fontSize="18px" color={theme === 'dark' ? '#FFF' : '#000'}>
          Posts read this year
        </Heading>
        <Text mt="0.5rem" color="purple.tertiary">
          This graph only shows posts read during ({new Date().getFullYear()}).
        </Text>
        <Text mt="0.5rem" color="purple.tertiary">
          You have read
          <Box color="text.primary" as="span" fontWeight="bold">
            {' '}
            {articles_read}{' '}
          </Box>
          posts so far
        </Text>

        <Box id="profile-graph" height="400px" minWidth="0" width="100%">
          <ResponsiveCalendarCanvas
            data={calendar}
            from={dates.start}
            to={dates.end}
            theme={{ textColor: '#F638DC' }}
            emptyColor="#444447"
            colors={['#444447', '#F638DC', '#0066FF', '#4d94ff']}
            margin={{ top: 40, right: 40, bottom: 50, left: 40 }}
            direction="horizontal"
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#000"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: -40,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left',
              },
            ]}
          />
        </Box>
      </Box>
      <Box my="2rem">
        <Heading as="h3" fontSize="18px" color={theme === 'dark' ? '#FFF' : '#000'}>
          Top tags read this year
        </Heading>
        <Text mt="0.5rem" color="purple.tertiary">
          Remember you only get 3 reads per day counted towards this metric.
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
