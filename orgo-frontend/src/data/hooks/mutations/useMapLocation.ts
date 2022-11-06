import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface UpdateCommunityLocationProps {
  communityId: string
  locationOnMap: {
    latitude: string
    longitude: string
  }
  city: string
}

function updateCommunityLocation({
  communityId,
  locationOnMap,
  city,
}: UpdateCommunityLocationProps): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(
      `${apiBaseUrl}/api/communities/update/${communityId}`,
      {
        locationOnMap,
        city,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useUpdateCommunityLocation(handleSuccess) {
  const toast = useToast()

  return useMutation(updateCommunityLocation, {
    onSuccess: handleSuccess,
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to update location',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
