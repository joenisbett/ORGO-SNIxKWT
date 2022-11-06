import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { User } from '../mutations/useRegister'

function getUserProfile(username: string): Promise<User> {
  return axios
    .get(`${apiBaseUrl}/api/users/profile/${username}`)
    .then((res) => res.data)
}

function getCommunityProfile(username: string): Promise<any> {
  return axios
    .get(`${apiBaseUrl}/api/communities/getbyname/${username}`)
    .then((res) => res.data)
}

// Volunteer
export function useGetUserProfile(username: string) {
  return useQuery(['profiles', username], () => {
    return getUserProfile(username)
  })
}

export function useGetCommunityProfile(username: string) {
  return useQuery(['community-profile', username], () => {
    return getCommunityProfile(username)
  })
}
