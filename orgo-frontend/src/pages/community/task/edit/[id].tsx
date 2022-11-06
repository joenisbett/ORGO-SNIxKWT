import { Box, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { EditTaskForm } from '../../../../components/EditTaskForm'
import GoBack from '../../../../components/GoBack'
import { useUser } from '../../../../data/hooks/useUser'

const EditTask = () => {
  useUser({ redirectTo: '/login' })
  const router = useRouter()
  const taskId = router.query.id as string
  return (
    <Box>
      <Head>
        <title>Edit Task</title>
      </Head>
      <GoBack />
      <Text fontSize="xl" fontWeight="bold">
        Edit A Task
      </Text>
      <EditTaskForm taskId={taskId} />
    </Box>
  )
}

export default EditTask
