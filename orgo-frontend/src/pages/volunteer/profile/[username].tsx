import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  HStack,
  IconButton,
  Skeleton,
  Text,
  useDisclosure,
  VStack,
  Badge,
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import React from 'react'
import {
  AiFillCamera,
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillLinkedin,
} from 'react-icons/ai'
import { BsGlobe2 } from 'react-icons/bs'
import { EditProfileDrawer } from '../../../components/EditProfileDrawer'
import { useGetUserProfile } from '../../../data/hooks/query/useGetUserProfile'
import { useIsMe } from '../../../data/hooks/useIsMe'
import { EditProfilePictureModal } from '../../../components/EditProfilePictureModal'
import { useShowContactInfo } from '../../../data/hooks/useShowContacInfo'
import Head from 'next/head'
import { EventCategory, logEvent } from '../../../data/utils/analytics'
import { useGetAllNotifications } from '../../../data/hooks/query/useGetAllNotifications'
import { useGetUserDataFromLocalStorage } from '../../../data/hooks/useUser'
import { NotificationCard } from '../../notifications'

function Profile() {
  const userData = useGetUserDataFromLocalStorage()

  const { onOpen, isOpen, onClose } = useDisclosure()
  const {
    onOpen: onOpenProfileModal,
    isOpen: isOpenProfileModal,
    onClose: onCloseProfileModal,
  } = useDisclosure()

  const router = useRouter()
  const username = router.query.username as string
  const { isLoading, data } = useGetUserProfile(username)
  const getAllNotifications = useGetAllNotifications(userData?._id)

  const isMe = useIsMe(username)

  const showContactInfo = useShowContactInfo()

  if (isLoading) {
    return <Skeleton height="100px" isLoaded={!isLoading} />
  }
  return (
    <Box>
      <Head>
        <title>Volunteer - Profile</title>
      </Head>
      <VStack spacing="4">
        <EditProfileDrawer
          initialData={data}
          isOpen={isOpen}
          onClose={onClose}
        />

        <Avatar name={data.name} size="2xl" cursor="pointer" src={data.avatar}>
          {isMe && (
            <AvatarBadge boxSize="1.3em" border="none">
              <IconButton
                rounded="xl"
                bg="gray.600"
                aria-label="button"
                onClick={onOpenProfileModal}
                _hover={{ bg: 'black' }}
                icon={<AiFillCamera color="white" size={25} />}
              />
            </AvatarBadge>
          )}
        </Avatar>

        {isMe && (
          <EditProfilePictureModal
            userData={data}
            isOpen={isOpenProfileModal}
            onClose={onCloseProfileModal}
          />
        )}

        <Text fontWeight="bold" fontSize="xl">
          {data.name}
        </Text>
        <HStack>
          {data?.siteLink && (
            <NextLink href={data.siteLink} passHref>
              <a target="_blank">
                <BsGlobe2 size={20} />
              </a>
            </NextLink>
          )}

          {data.facebookLink && (
            <NextLink href={data.facebookLink} passHref>
              <a target="_blank">
                <AiFillFacebook size={20} />
              </a>
            </NextLink>
          )}

          {data.instagramLink && (
            <NextLink href={data.instagramLink} passHref>
              <a target="_blank">
                <AiFillInstagram size={20} />
              </a>
            </NextLink>
          )}

          {data.twitterLink && (
            <NextLink href={data.twitterLink} passHref>
              <a target="_blank">
                <AiFillTwitterCircle size={20} />
              </a>
            </NextLink>
          )}

          {data.linkedinLink && (
            <NextLink href={data.linkedinLink} passHref>
              <a target="_blank">
                <AiFillLinkedin size={20} />
              </a>
            </NextLink>
          )}
        </HStack>
        {isMe && (
          <Button
            onClick={() => {
              logEvent(EventCategory.PROFILE, `Clicked on Settings button`)
              onOpen()
            }}
          >
            Settings
          </Button>
        )}

        <Box width="100%" bg="gray.300" p="8" borderRadius="10px">
          <Badge>Volunteer Account</Badge>
          <Text fontWeight="bold" fontSize="lg" mt="2">
            Bio
          </Text>
          <Text>{data.bio ? data.bio : 'No Bio Provided'}</Text>

          <Text fontWeight="bold" fontSize="lg" mt="2">
            City
          </Text>
          <Text>{data.city ? data.city : 'No city provided'}</Text>

          {showContactInfo && data?.email && (
            <>
              <Text fontWeight="bold" fontSize="lg" mt="2">
                Email Address
              </Text>
              <Text>{data.email}</Text>
            </>
          )}

          {showContactInfo && data?.phone && (
            <>
              <Text fontWeight="bold" fontSize="lg" mt="2">
                Phone Number
              </Text>
              <Link href={`tel:${data?.phone}`}>{data.phone}</Link>
            </>
          )}
        </Box>
      </VStack>

      <Text
        fontSize="xl"
        fontWeight="bold"
        mt="10"
        mb="5"
        alignSelf="self-start"
      >
        Activity Feed
      </Text>
      {!isLoading && getAllNotifications.data?.length === 0 && (
        <Text fontWeight="bold" fontSize="sm" mt="10" textAlign="center">
          No Activity found
        </Text>
      )}

      {!isLoading &&
        getAllNotifications.data?.map((notification) => (
          <NotificationCard
            key={notification?._id}
            notification={notification}
            currentUserId={userData?._id}
            allSeen
          />
        ))}
    </Box>
  )
}

export default Profile
