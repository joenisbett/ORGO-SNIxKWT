import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
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

export function useUploadEvidenceImage() {
  const toast = useToast()

  return useMutation(uploadFileHandler, {
    onSuccess: () => {
      toast({
        title: 'Image capture successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to capture image',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
