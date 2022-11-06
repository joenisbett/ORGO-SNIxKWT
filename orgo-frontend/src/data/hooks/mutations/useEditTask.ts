import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { queryClient } from '../../../pages/_app'
import { logException } from '../../utils/analytics'

export interface EditTaskInput {
  name: string
  description: string
  status: 'active' | 'inactive'
  priority: 'high' | 'medium' | 'low'
  address: string
  hours: string
  evidence: string
  rewards: string
  taskId: string
}
export interface Task {
  _id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  priority: 'high' | 'medium' | 'low'
  address: string
  hours: string
  evidence: string
  rewards: string
  taskId: string
  creator: string
}

function editTask(input: EditTaskInput): Promise<Task> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .put(`${apiBaseUrl}/api/tasks/task/${input.taskId}`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data.task)
}

export function useEditTask() {
  const toast = useToast()
  const router = useRouter()

  // after successfull edit route to task details page
  return useMutation(editTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('task')
      const userData = JSON.parse(localStorage.getItem('userData'))
      if (userData.type === 'community') {
        router.push(`/community/dashboard`)
      } else {
        router.push(`/`)
      }
      toast({
        title: 'Task Updated Successfully Updated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      logException('Failed to edit task')

      toast({
        title: 'Failed To Update Task',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
