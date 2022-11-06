import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { Evidence } from './useGetEvidenceByCommunityId'

function getEvidenceForVolunteer(userId: string): Promise<Evidence[]> {
  const userData = JSON.parse(localStorage.getItem('userData'))

  return axios
    .get(`${apiBaseUrl}/api/evidences/${userId}`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
    .then((res) => res.data)
}

export function useGetEvidenceForVolunteer(userId: string) {
  return useQuery(
    ['evidences', userId],
    () => {
      return getEvidenceForVolunteer(userId)
    },
    {
      enabled: userId ? true : false,
    }
  )
}
