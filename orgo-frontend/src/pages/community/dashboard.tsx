import { Box, Button, Skeleton, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { TaskCard } from '../../components/TaskCard'
import { useGetCommunityTasks } from '../../data/hooks/query/useGetCommunityTasks'
import { useUser } from '../../data/hooks/useUser'
import { useUserData } from '../../data/hooks/useUserData'
import { EventCategory, logEvent } from '../../data/utils/analytics'

function Dashboard() {
  const router = useRouter()
  useUser({ redirectTo: '/login' })
  const userData = useUserData()
  const { data: Tasks, isLoading } = useGetCommunityTasks(userData?._id)

  if (isLoading) {
    return <Skeleton isLoaded={!isLoading} height="100px" />
  }

  return (
    <Box>
      <Head>
        <title>Community Dashboard</title>
      </Head>
      <Text fontSize={{ base: 'xl', sm: '2xl' }} fontWeight="bold">
        Welcome to Community Dashboard
      </Text>
      <Button
        my="2"
        onClick={() => {
          logEvent(EventCategory.TASK, `Clicked on Create a New Task button`)
          router.push('/community/task/new')
        }}
      >
        Create A New Task
      </Button>
      <Box>
        {!isLoading && Tasks?.length === 0 && (
          <Text fontSize="lg" mx="2" color="gray.500">
            You've not created any task yet
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
              />
            )
          })}
      </Box>
    </Box>
  )
}

export default Dashboard
