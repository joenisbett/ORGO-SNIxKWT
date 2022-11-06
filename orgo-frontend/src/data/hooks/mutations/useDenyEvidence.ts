import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'
import { User } from './useRegister'
import { queryClient } from '../../../pages/_app'

export interface DenyEvidenceInput {
  evidenceId: string
  reason: string
}

function denyEvidence(input: DenyEvidenceInput): Promise<User> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/evidences/deny/${input.evidenceId}`,
      { reason: input.reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useDenyEvidence() {
  const toast = useToast()

  return useMutation(denyEvidence, {
    onSuccess: () => {
      queryClient.invalidateQueries('evidence')
      toast({
        title: 'Evidence Successfully Denied',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to Deny Evidence',
        description: error.response?.data?.message,
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    },
  })
}
