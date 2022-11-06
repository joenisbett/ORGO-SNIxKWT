import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { queryClient } from '../../../pages/_app'
import {
  cloudinaryCloudName,
  cloudinaryUploadPreset,
} from '../../utils/constants'

function uploadFileHandler(url: File | string): Promise<string> {
  const formData = new FormData()
  formData.append('file', url)
  formData.append('upload_preset', cloudinaryUploadPreset)

  return axios
    .post(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      formData
    )
    .then((res) => res.data.secure_url)
}

export function useUploadFile(isProfile = false) {
  const toast = useToast()

  return useMutation(uploadFileHandler, {
    onSuccess: () => {
      if (isProfile) {
        queryClient.invalidateQueries('profiles')
        toast({
          title: 'Successfully updated Profile Picture',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to update profile picture',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
