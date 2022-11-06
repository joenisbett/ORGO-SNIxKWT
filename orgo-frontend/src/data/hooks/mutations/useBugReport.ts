import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface CreateClickUpTaskParams {
  name: string
  description: string
}

function createClickUpTask({
  name,
  description,
}: CreateClickUpTaskParams): Promise<any> {
  return axios
    .post(`${apiBaseUrl}/api/clickup/create`, {
      name,
      description,
      status: 'Open',
    })
    .then((res) => res.data)
}

export function useCreateClickUpTask(resetForm) {
  const toast = useToast()

  return useMutation(createClickUpTask, {
    onSuccess: () => {
      resetForm()
      toast({
        title: 'Bug reported successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to report bug',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
