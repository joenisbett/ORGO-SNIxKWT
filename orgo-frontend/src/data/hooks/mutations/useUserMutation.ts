import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'

export interface EditProfileInput {
  name?: string
  phone?: string
  location?: string
  facebook?: string
  twitter?: string
  instagram?: string
  bio?: string
  avatar?: string
}

function deleteUser(userId: string): Promise<any> {
  const userData = JSON.parse(localStorage.getItem('userData'))

  return axios.delete(`${apiBaseUrl}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
  })
}

export function useDeleteUser() {
  const toast = useToast()

  return useMutation(deleteUser, {
    onSuccess: () => {
      toast({
        title: 'User delete successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to delete user',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
