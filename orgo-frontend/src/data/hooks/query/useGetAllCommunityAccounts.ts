import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

// const VerifiedCommunityAccountsEmail = [
//   'info@deceuvel.nl',
//   'littlegrowersinc@gmail.com',
//   'deceuvel@ceven.tech',
// ]

interface ConnectedCommunityAccount {
  inactive: boolean
  verified: boolean
  termsAndConditionsChecked: boolean
  _id: string
  name: string
  city: string
  description: string
  moto: string
  phone: string
  logo: string
  siteLink: string
  twitterLink: string
  facebookLink: string
  redditLink: string
  instagramLink: string
  linkedinLink: string
  createdBy: string
  members: any[]
  createdAt: string
  updatedAt: string
  __v: number
}

function getAllCommunities(): Promise<any> {
  return axios
    .get(`${apiBaseUrl}/api/communities/getall`)
    .then((res) => res.data)
}

const getAllConnectedCommunityAccounts = (
  userId: string
): Promise<ConnectedCommunityAccount[]> => {
  return axios
    .get(`${apiBaseUrl}/api/communities/getall/${userId}`)
    .then((res) => res.data)
}

export function useGetAllCommunities(enabled = true) {
  return useQuery(
    ['all-communities'],
    () => {
      return getAllCommunities()
    },
    {
      enabled,
    }
  )
}

export const useGetAllConnectedCommunityAccounts = (userId: string) => {
  return useQuery(['connected-community'], () => {
    return getAllConnectedCommunityAccounts(userId)
  })
}
