import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useToast } from '@chakra-ui/react'
import { queryClient } from '../../../pages/_app'

export interface CreateCommentInput {
  message: string
  evidenceId: string
}

function createComment(input: CreateCommentInput): Promise<CreateCommentInput> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(
      `${apiBaseUrl}/api/evidences/add/comment/${input.evidenceId}`,
      { message: input.message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useCommentOnEvidence() {
  const toast = useToast()

  return useMutation(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('evidence')

      toast({
        title: 'Comment successfully added',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to add comment',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
