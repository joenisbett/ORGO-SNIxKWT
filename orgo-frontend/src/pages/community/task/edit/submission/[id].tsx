import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import GoBack from '../../../../../components/GoBack'
import UpdateTaskSubmission from '../../../../../components/TaskSubmission/UpdateTaskSubmission'
import { useUser } from '../../../../../data/hooks/useUser'

const EditSubmission = () => {
  useUser({ redirectTo: '/login' })

  return (
    <Box>
      <Head>
        <title>Edit Task Submission</title>
      </Head>
      <GoBack />
      <UpdateTaskSubmission />
    </Box>
  )
}

export default EditSubmission
