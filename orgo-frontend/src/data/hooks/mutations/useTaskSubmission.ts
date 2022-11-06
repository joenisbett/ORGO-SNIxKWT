import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { FieldItem } from '../../../components/TaskSubmission/CreateTaskSubmission'
import { apiBaseUrl } from '../../utils/constants'

function createTaskSubmission({
  data,
  taskId,
  name,
}: {
  data: FieldItem[]
  taskId: string
  name: string
}): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/templates/create`,
      { input: data, taskId, name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

function updateTaskSubmission({
  data,
  id,
}: {
  data: FieldItem[]
  id: string
}): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/templates/edit/${id}`,
      { input: data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

function deleteTaskSubmission(id: string): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/templates/delete/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useCreateTaskSubmission(isCopied = false) {
  const toast = useToast()
  const router = useRouter()

  return useMutation(createTaskSubmission, {
    onSuccess: () => {
      toast({
        title: `Task submission successfully ${
          isCopied ? 'copied' : 'created'
        }`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push('/community/dashboard')
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create task submission',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useUpdateTaskSubmission(handleSuccess: () => void) {
  const toast = useToast()
  const router = useRouter()

  return useMutation(updateTaskSubmission, {
    onSuccess: () => {
      toast({
        title: 'Task submission successfully updated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      handleSuccess()
      router.push('/community/dashboard')
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update task submission',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useDeleteTaskSubmission() {
  const toast = useToast()
  const router = useRouter()

  return useMutation(deleteTaskSubmission, {
    onSuccess: () => {
      toast({
        title: 'Task submission successfully deleted',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push('/community/dashboard')
      // router.push('/task/${id}')
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete task submission',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
