import axios from 'axios'
import { useMutation } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

function getUniqueUsername(username: string): Promise<any> {
  return axios
    .get(`${apiBaseUrl}/api/users/testUnique/${username}`)
    .then((res) => res.data)
}

export function useGetUniqueUsername() {
  return useMutation(getUniqueUsername, {
    onSuccess: (data) => {
      console.log(data)
    },
  })
}
