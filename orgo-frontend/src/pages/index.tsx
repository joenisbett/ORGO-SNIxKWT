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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TaskCard } from '../components/TaskCard'
import { useGetActiveCommunityTasks } from '../data/hooks/query/useGetActiveCommunityTasks'
import {
  useGetAllCommunities,
  useGetAllConnectedCommunityAccounts,
} from '../data/hooks/query/useGetAllCommunityAccounts'
import { useUserData } from '../data/hooks/useUserData'
import { EventCategory, logEvent } from '../data/utils/analytics'
import getStrappiUserData from '../data/utils/strappiUserData'

const guestUser = (strappiUserData) => {
  return {
    _id: 'guest101',
    name: `${strappiUserData.attributes?.brand_name || ''} Guest`,
    type: 'guest',
    email: 'guest@user.com',
    username: 'guest101',
    phone: '1234567890',
    token: '1234567890',
    _volunteerId: '',
  }
}

function Dashboard() {
  const router = useRouter()
  const strappiUserData = getStrappiUserData()
  const userData = useUserData() || guestUser(strappiUserData)

  if (userData.type === 'community') {
    router.push('/community/dashboard')
  }

  if (userData.type === 'admin') {
    router.push('/admin/dashboard')
  }

  const [selectedCommunityId, setSelectedCommunityId] = useState('')
  const { isLoading, data: Tasks } =
    useGetActiveCommunityTasks(selectedCommunityId)

  useGetAllConnectedCommunityAccounts(
    userData?.type === 'community' ? userData?._volunteerId : userData?._id
  )

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
      setSelectedCommunityId(
        userData.type !== 'community'
          ? strappiUserData.attributes?.communityId
          : ''
      )
    }
  }, [
    strappiUserData.attributes?.communityId,
    strappiUserData.attributes?.type,
  ])

  // admin
  useEffect(() => {
    if (strappiUserData.attributes?.type === 'super') {
      setSelectedCommunityId(
        userData.type !== 'community'
          ? localStorage.getItem('selectedCommunityId')
          : ''
      )
    }
  }, [strappiUserData.attributes?.type])

  const handleCreateGuestUserData = () => {
    localStorage.setItem('userData', JSON.stringify(guestUser(strappiUserData)))
  }

  useEffect(() => {
    if (userData.type === 'guest') {
      handleCreateGuestUserData()
    }
  }, [])

  if (communitiesLoading) {
    return <Skeleton isLoaded={!communitiesLoading} height="100px" />
  }

  return (
    <Box>
      <Head>
        <title>Available Tasks</title>
      </Head>
      <Text fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="bold">
        Welcome to {userData.type === 'guest' ? 'Guest' : 'Volunteer'} Dashboard
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
