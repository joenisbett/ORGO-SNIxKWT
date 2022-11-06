import axios from 'axios'
import { useMutation } from 'react-query'
import { queryClient } from '../../../pages/_app'
import { apiBaseUrl } from '../../utils/constants'

export interface MarkNotificationAsReadInput {
  notificationId: string
  userId: string
}

function markNotificationAsRead(
  input: MarkNotificationAsReadInput
): Promise<void> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(
      `${apiBaseUrl}/api/notificaions/seen/${input.notificationId}/${input.userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useMarkNotificationAsRead() {
  return useMutation(markNotificationAsRead, {
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries('notifications')
    },
    onError: (error: any) => {
      console.error(error)
    },
  })
}
