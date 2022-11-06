import { Avatar, Box, Text } from '@chakra-ui/react'
import { FC } from 'react'
import httpToHttpsUrl from '../data/utils/httpToHttpsUrl'

interface LeaderboardUserProps {
  ranking: number
  points: number
  avatar: string
  name: string
}

const LeaderboardUser: FC<LeaderboardUserProps> = (props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text minW={10}>{props.ranking}</Text>
        <Avatar name={props.name} src={httpToHttpsUrl(props.avatar)} mr="6" />
        <Text fontWeight="bold">{props.name}</Text>
      </Box>
      <Text mr="3">{props.points}</Text>
    </Box>
  )
}

export default LeaderboardUser
