import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface Members {
  _id: string
  members: Member[]
}

interface Member {
  role: string
  status: string
  _id: string
  userId: UserId
  createdAt: string
  updatedAt: string
}

interface UserId {
  type: string
  inactive: boolean
  verified: boolean
  termsAndConditionsChecked: boolean
  _id: string
  username: string
  name: string
  email: string
  password: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt: string
  __v: number
  city: string
  avatar: string
}

function getCommunityMembers(communityId: string): Promise<Members> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .get(`${apiBaseUrl}/api/communities/get/member/${communityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

export function useGetCommunityMembers(communityId: string) {
  return useQuery(['all-community-members'], () => {
    return getCommunityMembers(communityId)
  })
}
