import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface CreateCommunityParams {
  name: string
  description?: string
  phone?: string
  logo?: string
  createdBy: string
}

async function searchCommunities({
  searchTerm,
}: {
  searchTerm: string
}): Promise<any> {
  return axios
    .get(`${apiBaseUrl}/api/communities/search/${searchTerm}`)
    .then((res) => res.data)
}

function createCommunity(data: CreateCommunityParams): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(`${apiBaseUrl}/api/communities/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

function updateCommunity({ communityId, data }): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(`${apiBaseUrl}/api/communities/update/${communityId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

function deleteCommunity(communityId: string): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(
      `${apiBaseUrl}/api/communities/delete/${communityId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useSearchCommunities(handleSuccess: () => void) {
  return useMutation(searchCommunities, {
    onSuccess: handleSuccess,
  })
}

export function useCreateCommunity() {
  const toast = useToast()

  return useMutation(createCommunity, {
    onSuccess: () => {
      toast({
        title: 'Community created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create community',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useUpdateCommunity(handleSuccess) {
  const toast = useToast()

  return useMutation(updateCommunity, {
    onSuccess: handleSuccess,
    onError: (error: any) => {
      // console.error(error)
      toast({
        title: 'Failed to update community',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useDeleteCommunity(handleSuccess) {
  const toast = useToast()

  return useMutation(deleteCommunity, {
    onSuccess: handleSuccess,
    onError: (error: any) => {
      toast({
        title: 'Failed to delete community',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
