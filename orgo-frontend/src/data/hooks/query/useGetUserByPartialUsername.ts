import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'
import { User } from '../mutations/useRegister'

function getUserByPartialUsername(partialUsername: string): Promise<User[]> {
  const userData = JSON.parse(localStorage.getItem('userData'))

  return (
    axios
      .get(`${apiBaseUrl}/api/users/user/${partialUsername}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      //only show the volunteer accounts here
      // also remove the current logged in user from the list
      .then((res) =>
        res.data.users.filter(
          (user) => user.type !== 'community' && user._id !== userData._id
        )
      )
  )
}

export function useGetUserByPartialUsername(partialUsername: string) {
  return useQuery(
    ['users', partialUsername],
    () => {
      return getUserByPartialUsername(partialUsername)
    },
    { enabled: partialUsername.length > 0 }
  )
}
