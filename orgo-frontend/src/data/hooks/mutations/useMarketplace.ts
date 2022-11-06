import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { ProjectRequirement } from '../../../pages/community/project/new'
import { apiBaseUrl } from '../../utils/constants'

interface CreateProjectParams {
  name: string
  description: string
  requirementsToComplete: ProjectRequirement[]
  totalBudget: string
  category: string[]
  budgetNarrative: string
  image: string
  status: string
  createrCommunity: string
}

function createProject(data: CreateProjectParams): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(`${apiBaseUrl}/api/sponsorships/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

function updateProject({
  id,
  data,
}: {
  id: string
  data: CreateProjectParams
}): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(`${apiBaseUrl}/api/sponsorships/edit/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

function deleteProject(id: string): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(
      `${apiBaseUrl}/api/sponsorships/delete/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useCreateProject(resetForm) {
  const toast = useToast()
  const router = useRouter()

  return useMutation(createProject, {
    onSuccess: (data) => {
      resetForm()
      toast({
        title: 'Project created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push(`/community/project/${data?._id}`)
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to create project',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useUpdateProject() {
  const toast = useToast()
  const router = useRouter()

  return useMutation(updateProject, {
    onSuccess: () => {
      toast({
        title: 'Project updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push(`/community/project/${router.query?.id}`)
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to update project',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useDeleteProject() {
  const toast = useToast()
  const router = useRouter()

  return useMutation(deleteProject, {
    onSuccess: () => {
      toast({
        title: 'Project deleted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push('/community/project')
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to delete project',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
