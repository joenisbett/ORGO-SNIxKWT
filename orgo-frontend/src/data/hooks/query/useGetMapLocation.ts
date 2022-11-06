import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

function getCommunityLocations(): Promise<any> {
  return axios
    .get(`${apiBaseUrl}/api/communities/getalllocation`)
    .then((res) => res.data)
}

export function useGetCommunityLocations() {
  return useQuery(['community-locations'], () => {
    return getCommunityLocations()
  })
}
