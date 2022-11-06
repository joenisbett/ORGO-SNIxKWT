import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

function addMemberToCommunity({
  communityId,
  userId,
}: {
  communityId: string
  userId: string
}): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/communities/add/member/${communityId}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

function removeMemberFromCommunity({
  communityId,
  userId,
}: {
  communityId: string
  userId: string
}): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/communities/delete/member/${communityId}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useAddMemberToCommunity(handleSuccess: () => void) {
  const toast = useToast()

  return useMutation(addMemberToCommunity, {
    onSuccess: handleSuccess,
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to add member to the community',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useRemoveMemberFromCommunity(handleSuccess: () => void) {
  const toast = useToast()

  return useMutation(removeMemberFromCommunity, {
    onSuccess: handleSuccess,
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to remove member from the community',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
