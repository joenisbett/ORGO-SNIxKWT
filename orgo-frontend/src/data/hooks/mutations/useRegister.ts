import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export interface User {
  _id: string
  _volunteerId: string
  name: string
  username: string
  email: string
  type: string
  firstName: string
  lastName: string
  city: string
  inactive: boolean
  verified: boolean
  token: string
  locationOnMap: any
  bio?: string
  address?: string
  siteLink?: string
  facebookLink?: string
  instagramLink?: string
  twitterLink?: string
  linkedinLink?: string
  phone?: string
  avatar?: string
}

export interface RegisterUserInput {
  firstName: string
  lastName: string
  email: string
  password: string
  type?: string
  phone?: number
  username?: string
}

function registerUser(input: RegisterUserInput): Promise<User> {
  return axios
    .post(`${apiBaseUrl}/api/users/register`, input)
    .then((res) => res.data)
}

export function useRegister() {
  const toast = useToast()
  const router = useRouter()
  return useMutation(registerUser, {
    onSuccess: (data) => {
      toast({
        title: 'Account created Successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      const userData = JSON.stringify(data)
      localStorage.setItem('userData', userData)
      router.push('/')

      // router.push(`/verification?userId=${data._id}`)
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to register',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
