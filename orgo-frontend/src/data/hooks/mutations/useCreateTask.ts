import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'
import { logException } from '../../utils/analytics'

export interface CreateTaskInput {
  name: string
  description: string
  address: string
  hours: string
  evidence: string
  status: string
  priority: string
  creator: string
  communityId: string
}

function createTask(input: CreateTaskInput): Promise<CreateTaskInput> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(`${apiBaseUrl}/api/tasks/create`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

export function useCreateTask(handleSuccess: (data: any) => void) {
  const toast = useToast()

  return useMutation(createTask, {
    onSuccess: handleSuccess,
    onError: (error: any) => {
      logException('Failed to create task')

      toast({
        title: 'Failed to Create Task',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
