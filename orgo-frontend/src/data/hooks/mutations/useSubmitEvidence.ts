import { useMutation } from 'react-query'
import axios from 'axios'
import { apiBaseUrl } from '../../utils/constants'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { queryClient } from '../../../pages/_app'
import { Evidence } from '../query/useGetEvidenceByCommunityId'

export interface SubmitEvidenceInput {
  taskId: string
  userId: string
  evidenceDetails?: string
  evidenceImages?: string[]
  tags?: string[]
  latitude?: string
  longitude?: string
  templateId: string
  formData: { label: string; value: string }[]
}

function submitEvidence(input: SubmitEvidenceInput): Promise<Evidence> {
  const token = JSON.parse(localStorage.getItem('userData')).token
  return axios
    .post(`${apiBaseUrl}/api/evidences/submit`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

export function useSubmitEvidence() {
  const router = useRouter()
  const toast = useToast()

  return useMutation(submitEvidence, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('evidences')
      router.push(`/volunteer/evidence/details/${data?._id}`)
      toast({
        title: 'Evidence Submitted Successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to Submit Evidence',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
