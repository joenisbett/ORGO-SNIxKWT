import { Box, Skeleton, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { EvidenceCard } from '../../../../components/EvidenceCard'
import { TaskCard } from '../../../../components/TaskCard'
import { useGetEvidenceOfTask } from '../../../../data/hooks/query/useGetEvidenceById'
import { useGetTaskDetails } from '../../../../data/hooks/query/useGetTaskDetails'
import { useIsCommunity } from '../../../../data/hooks/useIsCommunity'

const TaskEvidences = () => {
  const router = useRouter()
  const taskId = router.query.id as string
  const { data: TaskDetails, isLoading } = useGetTaskDetails(taskId)
  const isCommunity = useIsCommunity()

  const { data: evidencesData, isLoading: evidencesDataLoading } =
    useGetEvidenceOfTask(taskId)

  return (
    <Box>
      <Head>
        <title>Task Evidences</title>
      </Head>

      <Text fontWeight="bold" fontSize="xl">
        Task
      </Text>
      <Skeleton isLoaded={!isLoading}>
        <TaskCard
          creatorUsername={TaskDetails?.creator.name}
          creatorCommunityName={TaskDetails?.creatorCommunityName}
          id={TaskDetails?._id}
          location={TaskDetails?.address}
          priority={TaskDetails?.priority}
          rewards={TaskDetails?.rewards}
          title={TaskDetails?.name}
          status={TaskDetails?.status}
          showStatus={isCommunity}
          showDetails={false}
        />
      </Skeleton>

      <Text fontWeight="bold" fontSize="xl" mt="8">
        All Evidences for above task
      </Text>

      {evidencesDataLoading
        ? [1, 2, 3].map((item) => <Skeleton key={item} height="40" my="6" />)
        : evidencesData?.map((evidence) => (
            <EvidenceCard
              rewards={evidence.taskId.rewards}
              key={evidence?._id}
              creatorCommunityName={evidence?.userId?.username}
              id={evidence?._id}
              title={evidence?.taskId?.name}
              status={evidence?.status}
              priority={evidence?.taskId?.priority}
              location={evidence?.taskId?.address}
              showPriority={false}
            />
          ))}
    </Box>
  )
}

export default TaskEvidences
