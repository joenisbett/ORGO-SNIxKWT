import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { Task } from './useGetCommunityTasks'

function getAllTasks(): Promise<Task[]> {
  return axios.get(`${apiBaseUrl}/api/tasks/`).then((res) => res.data.tasks)
}

export function useGetAllTasks() {
  return useQuery(['tasks', 'all'], () => {
    return getAllTasks()
  })
}
