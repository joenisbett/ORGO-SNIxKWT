import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { Task } from './useGetCommunityTasks'

function getActiveCommunityTasks(communityId: string): Promise<Task[]> {
  return axios
    .get(`${apiBaseUrl}/api/tasks/community/${communityId}`)
    .then((res) => {
      return res.data.tasks.filter((task) => task.status === 'active')
    })
}

export function useGetActiveCommunityTasks(communityId: string) {
  return useQuery(
    ['tasks', communityId],
    () => {
      return getActiveCommunityTasks(communityId)
    },
    {
      enabled: communityId?.length > 0,
    }
  )
}
