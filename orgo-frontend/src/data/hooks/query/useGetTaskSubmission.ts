import axios from 'axios'
import { useQuery } from 'react-query'
import { FieldItem } from '../../../components/TaskSubmission/CreateTaskSubmission'
import { apiBaseUrl } from '../../utils/constants'

interface TaskSubmissionTemplate {
  _id: string
  formTemplate: FieldItem[]
  createdBy: string
  createdAt: string
  updatedAt: string
  inactive: boolean
  name: string
}

function getTaskSubmission(id: string): Promise<TaskSubmissionTemplate> {
  return axios
    .get(`${apiBaseUrl}/api/templates/get/${id}`)
    .then((res) => res.data)
}

function getTaskSubmissionByTaskId(
  id: string
): Promise<TaskSubmissionTemplate> {
  return axios
    .get(`${apiBaseUrl}/api/templates/getbytaskid/${id}`)
    .then((res) => res.data)
}

function getAllTaskSubmissions(): Promise<TaskSubmissionTemplate[]> {
  return axios.get(`${apiBaseUrl}/api/templates/getall`).then((res) => res.data)
}

export function useGetTaskSubmission(id: string) {
  return useQuery(['tasks', 'submission'], () => {
    if (id) {
      return getTaskSubmission(id)
    }
  })
}

export function useGetTaskSubmissionByTaskId(id: string) {
  return useQuery(['tasks', 'submission', 'taskId'], () => {
    if (id) {
      return getTaskSubmissionByTaskId(id)
    }
  })
}

export function useGetAllTaskSubmissions() {
  return useQuery(['tasks', 'submission', 'all'], () => {
    return getAllTaskSubmissions()
  })
}
