import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'
import { User } from './useRegister'
import { queryClient } from '../../../pages/_app'

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

function editProfile(input: EditProfileInput): Promise<User> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .put(`${apiBaseUrl}/api/users/profile`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

export function useEditProfile() {
  const toast = useToast()

  return useMutation(editProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries('profiles')
      toast({
        title: 'Profile Successfully Updated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to Update Profile',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
