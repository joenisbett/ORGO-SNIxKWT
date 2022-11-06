import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  Skeleton,
  Text,
} from '@chakra-ui/react'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { TaskCard } from '../../components/TaskCard'
import { useGetActiveCommunityTasks } from '../../data/hooks/query/useGetActiveCommunityTasks'
import { useGetAllCommunities } from '../../data/hooks/query/useGetAllCommunityAccounts'
import { useUser } from '../../data/hooks/useUser'
import { EventCategory, logEvent } from '../../data/utils/analytics'
import getStrappiUserData from '../../data/utils/strappiUserData'

function Dashboard() {
  useUser({ redirectTo: '/login' })
  const strappiUserData = getStrappiUserData()

  const [selectedCommunityId, setSelectedCommunityId] = useState('')
  const { isLoading, data: Tasks } =
    useGetActiveCommunityTasks(selectedCommunityId)

  const handleCommunityChange = (e) => {
    logEvent(
      EventCategory.TASK,
      `Select a different community to view it's tasks`
    )
    setSelectedCommunityId(e.target.value)
    localStorage.setItem('selectedCommunityId', e.target.value)
  }

  const { data: communities, isLoading: communitiesLoading } =
    useGetAllCommunities(strappiUserData.attributes?.type !== 'white_label')

  // white label
  useEffect(() => {
    if (
      strappiUserData.attributes?.communityId &&
      strappiUserData.attributes?.type === 'white_label'
    ) {
      setSelectedCommunityId(strappiUserData.attributes?.communityId || '')
    }
  }, [
    strappiUserData.attributes?.communityId,
    strappiUserData.attributes?.type,
  ])

  // admin
  useEffect(() => {
    if (strappiUserData.attributes?.type === 'super') {
      setSelectedCommunityId(localStorage.getItem('selectedCommunityId') || '')
    }
  }, [strappiUserData.attributes?.type])

  if (isLoading) {
    return <Skeleton isLoaded={!isLoading} height="100px" />
  }

  return (
    <Box>
      <Head>
        <title>Available Tasks</title>
      </Head>
      <Text fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="bold">
        Welcome to Volunteer Dashboard
      </Text>
      {strappiUserData.attributes?.type !== 'white_label' ? (
        <>
          <FormControl my="6">
            <FormLabel htmlFor="template">Select a community</FormLabel>
            <Select
              id="template"
              value={selectedCommunityId}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              onChange={handleCommunityChange}
              bg="whiteAlpha.600"
              placeholder="Choose a community"
            >
              {!communitiesLoading &&
                communities &&
                communities?.map((task) => (
                  <option value={task._id} key={task._id}>
                    {task.name}
                  </option>
                ))}
            </Select>
            <FormHelperText></FormHelperText>
          </FormControl>

          {!selectedCommunityId && (
            <Text fontSize="xl" fontWeight="bold">
              Please select a community to check for available tasks
            </Text>
          )}

          {!isLoading && selectedCommunityId && (
            <Text fontSize="xl" fontWeight="bold">
              Available tasks for selected community
            </Text>
          )}
        </>
      ) : null}

      {!isLoading && Tasks?.length === 0 && (
        <Text fontSize="lg" mx="2" color="gray.500" mt="3">
          No tasks available
        </Text>
      )}

      {!isLoading &&
        Tasks?.map((task) => {
          return (
            <TaskCard
              creatorUsername={task?.creator.name}
              rewards={task.rewards}
              key={task?._id}
              creatorCommunityName={task?.creatorCommunityName}
              location={task?.address}
              priority={task?.priority ?? 'medium'}
              status={task?.status ?? 'active'}
              title={task?.name}
              id={task?._id}
              showStatus={false}
            />
          )
        })}
    </Box>
  )
}

export default Dashboard
