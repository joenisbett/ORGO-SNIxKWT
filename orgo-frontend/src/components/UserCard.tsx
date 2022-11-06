import { Box, Flex, Avatar, Text } from '@chakra-ui/react'
import router from 'next/router'
import { User } from '../data/hooks/mutations/useRegister'

export interface UserCardProps {
  user: User
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <Box
      my="4"
      p="4"
      cursor="pointer"
      onClick={() => router.push(`/${user.type}/profile/${user.username}`)}
      borderRadius="5px"
      key={user._id}
      bg="gray.200"
    >
      <Flex>
        <Avatar name={user.username} src={user.avatar} />
        <Box>
          <Text mx="4">{user.name}</Text>
          <Text color="gray.500" mx="4">
            {user.bio}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}
