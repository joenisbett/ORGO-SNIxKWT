import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { User } from '../mutations/useRegister'

interface Leaderboard {
  users: LeaderboardUser[]
}

interface LeaderboardUser {
  points: number
  _id: string
  username: string
  avatar?: string
}

function searchUsers(): Promise<User[]> {
  return axios.get(`${apiBaseUrl}/api/users/all`).then((res) => res.data)
}

function getLeaderboardData(): Promise<Leaderboard> {
  return axios
    .get(`${apiBaseUrl}/api/users/leaderboard`)
    .then((res) => res.data)
}

export function useGetAllUsers() {
  return useQuery(['users', 'all'], () => {
    return searchUsers()
  })
}

export function useGetLeaderboardData() {
  return useQuery(['users', 'leaderboard'], () => {
    return getLeaderboardData()
  })
}
