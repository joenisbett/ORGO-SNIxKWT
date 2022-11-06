import { Avatar, Box, Flex, Skeleton, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { AiTwotoneCheckCircle } from 'react-icons/ai'

import { useMarkNotificationAsRead } from '../data/hooks/mutations/useMarkNotificationAsRead'
import {
  Notification,
  useGetAllNotifications,
} from '../data/hooks/query/useGetAllNotifications'
import { useGetUserDataFromLocalStorage } from '../data/hooks/useUser'
import { changeUserTypeAndId, useUserData } from '../data/hooks/useUserData'
import { EventCategory, logEvent } from '../data/utils/analytics'
import { timeDifference } from '../data/utils/relativeTime'
import getStrappiUserData from '../data/utils/strappiUserData'

function Notifications() {
  const data = useGetUserDataFromLocalStorage()

  const { data: notifications, isLoading } = useGetAllNotifications(data?._id)

  if (isLoading) {
    return <Skeleton isLoaded={!isLoading} height="100px" />
  }

  return (
    <Box>
      <Head>
        <title>Notifications</title>
      </Head>
      <Text fontSize="2xl" fontWeight="bold">
        Notifications
      </Text>

      {!isLoading && notifications?.length === 0 && (
        <Text fontWeight="bold" fontSize="sm" my="4">
          You don't have any notifications
        </Text>
      )}

      {!isLoading &&
        notifications.map((notification) => (
          <NotificationCard
            key={notification?._id}
            notification={notification}
            currentUserId={data?._id}
          />
        ))}
    </Box>
  )
}

export interface NotificationCardProps {
  notification: Notification
  currentUserId: string
  allSeen?: boolean
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  allSeen = false,
}) => {
  const router = useRouter()
  const userInfo = useUserData()
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead()
  const strappiUserData = getStrappiUserData()

  const actualNotification = useMemo(() => {
    return notification.involvedUsers.find(
      (user) => user.userId == userInfo?._id
    )
  }, [notification, userInfo._id])

  const properLink = useMemo(() => {
    if (userInfo.type === 'volunteer') {
      return actualNotification?.linkTo.replace('/community/', '/volunteer/')
    }
    return actualNotification?.linkTo.replace('/volunteer/', '/community/')
  }, [actualNotification?.linkTo, userInfo.type])

  const handleClick = () => {
    logEvent(
      EventCategory.NOTIFICATION,
      `Clicked on notification of type ${notification.type}`
    )

    if (!actualNotification?.seen) {
      markNotificationAsRead({
        notificationId: notification?._id,
        userId: userInfo?._id,
      })
    }

    if (notification.type === 'invitation') {
      const splitData = notification.involvedUsers[0].linkTo?.split('/')
      changeUserTypeAndId('community', splitData[splitData.length - 1])
      window.location.href = '/community/dashboard'
    } else {
      router.push(properLink)
    }
  }

  return (
    <Box
      cursor="pointer"
      onClick={handleClick}
      m="4"
      bg="gray.300"
      borderRadius="md"
      py={{ base: '2', md: '3' }}
      px={{ base: '4', md: '6' }}
      boxShadow="base"
      fontSize={{ base: 'sm', md: 'md' }}
    >
      <Flex alignItems="center">
        {!allSeen && !actualNotification?.seen && (
          <Box
            mr="2"
            color={`${strappiUserData.attributes?.brand_color || 'blue'}.400`}
          >
            <AiTwotoneCheckCircle />
          </Box>
        )}

        <Avatar
          name={notification?.userId?.name}
          src={notification?.userId?.avatar}
          onClick={(e) => {
            e.stopPropagation()
            router.push(
              `${notification.userId.type}/profile/${notification.userId.username}`
            )
          }}
        />
        <Box ml="4">
          <Text fontWeight="bold" color="gray.600">
            {notification?.description}
          </Text>
          {/* <Text fontSize="sm" color="gray.500">
        Event Action Description
      </Text> */}
          <Text fontSize="xs" color="gray.500">
            {timeDifference(new Date(), new Date(notification?.createdAt))}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export default Notifications
