import { Avatar, Badge, Box, Flex, Text } from '@chakra-ui/react'
import { changeUserTypeAndId } from '../data/hooks/useUserData'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { EventCategory, logEvent } from '../data/utils/analytics'
import { useRouter } from 'next/router'

export type UserType = 'volunteer' | 'community' | 'guest' | 'admin'
interface ProfileCardProps {
  id?: string
  name: string
  avatar: string
  profileStatus?: 'verified' | 'not verified' | ''
  type: UserType
  isActive?: boolean
  onClick?: () => void
  showArrow?: boolean
  isCollapseOpen?: boolean
  username?: string
}

const ProfileCard = ({
  id,
  name,
  avatar,
  profileStatus = '',
  type,
  isActive = false,
  onClick = () => undefined,
  showArrow = false,
  isCollapseOpen = false,
  username = '',
}: ProfileCardProps) => {
  const router = useRouter()

  const getType = () => {
    return type[0].toUpperCase() + type.substring(1)
  }

  const handleChangeProfile = () => {
    if (profileStatus) {
      if (type === 'community') {
        router.push(`/admin/community/${name}`)
      } else if (type === 'volunteer') {
        router.push(`/admin/volunteer/${username}`)
      }

      return
    }

    if (!isActive) {
      changeUserTypeAndId(type, id)

      if (type === 'community') {
        logEvent(
          EventCategory.PROFILE,
          `Switched profile from volunteer to community`
        )
        router.push('/community/dashboard')
      } else {
        logEvent(
          EventCategory.PROFILE,
          `Switched profile from community to volunteer`
        )
        router.push('/')
      }
    } else {
      onClick()
    }
  }

  return (
    <Flex alignItems="center" onClick={handleChangeProfile} cursor="pointer">
      <Avatar name={name} size="lg" cursor="pointer" src={avatar} />
      <Box
        mx="4"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <div>
          <Text fontWeight="bold" fontSize="xl">
            {name}
          </Text>
          {/* <Text fontSize="xs">{data?.bio}</Text> */}
          {profileStatus ? (
            <Badge
              colorScheme={profileStatus === 'verified' ? 'green' : 'yellow'}
            >
              {profileStatus}
            </Badge>
          ) : (
            <Badge>{getType()}</Badge>
          )}
        </div>
        {showArrow ? (
          isCollapseOpen ? (
            <FiChevronUp />
          ) : (
            <FiChevronDown />
          )
        ) : null}
      </Box>
    </Flex>
  )
}

export default ProfileCard
