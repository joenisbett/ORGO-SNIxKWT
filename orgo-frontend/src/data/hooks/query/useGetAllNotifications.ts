import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { User } from '../mutations/useRegister'

interface InvolvedUser {
  linkTo: string
  seen: boolean
  userId: string
  _id: string
}

export interface Notification {
  description: string
  createdAt: string
  involvedUsers: InvolvedUser[]
  inactive: boolean
  _id: string
  type: string
  userId: User
  updatedAt: string
}

function getAllNotifications(userId: string): Promise<Notification[]> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .get(`${apiBaseUrl}/api/notificaions/all/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data
    })
}

export function useGetAllNotifications(userId: string) {
  return useQuery(['notifications', userId], () => {
    return getAllNotifications(userId)
  })
}
