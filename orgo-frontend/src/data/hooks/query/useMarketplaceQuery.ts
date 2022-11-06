import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface Project {
  category: string[]
  status: string
  inactive: boolean
  _id: string
  name: string
  description: string
  requirementsToComplete: RequirementsToComplete[]
  totalBudget: string
  image: string
  createrCommunity: string
  createdAt: string
  updatedAt: string
  budgetNarrative: string
  __v: number
}

interface RequirementsToComplete {
  type: 'TASK' | 'NON_TASK'
  _id: string
  price: number
  quantity: number
  taskId: RequirementsToCompleteTask
  title: string
  orgoCredits: number
  createdAt: string
  updatedAt: string
}

export interface RequirementsToCompleteTask {
  status: string
  _id: string
  name: string
  creatorVolunteer: string
  creator: string
  creatorCommunityName: string
  description: string
  address: string
  evidence: string
  rewards: string
  createdAt: string
  updatedAt: string
  __v: number
}

function getAllProjects(): Promise<Project[]> {
  return axios
    .get(`${apiBaseUrl}/api/sponsorships/getAll`)
    .then((res) => res.data)
}

function getProjectById(projectId: string): Promise<Project> {
  return axios
    .get(`${apiBaseUrl}/api/sponsorships/getById/${projectId}`)
    .then((res) => res.data)
}

export function useGetAllProjects() {
  return useQuery(['projects', 'all'], () => {
    return getAllProjects()
  })
}

export function useGetProjectById(id: string) {
  return useQuery(['projects', id], () => {
    return getProjectById(id)
  })
}
