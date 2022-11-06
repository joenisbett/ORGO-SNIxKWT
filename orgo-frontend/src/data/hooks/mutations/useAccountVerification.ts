import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { User } from './useRegister'

interface VerifyAccountInput {
  id: string
  otp: string
}

function verifyAccount(input: VerifyAccountInput): Promise<User> {
  return axios
    .post(`${apiBaseUrl}/api/users/verify`, input)
    .then((res) => res.data)
}

export function useAccountVerification() {
  const router = useRouter()
  const toast = useToast()
  return useMutation(verifyAccount, {
    onSuccess: (data) => {
      const userData = JSON.stringify(data)
      localStorage.setItem('userData', userData)
      router.push(data.type === 'community' ? `/community/dashboard` : `/`)
      toast({
        title: 'Account verified.',
        description: 'Your account is now verified',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to verify',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
