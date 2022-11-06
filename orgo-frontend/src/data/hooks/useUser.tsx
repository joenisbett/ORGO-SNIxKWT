import axios from 'axios'
import { useRouter } from 'next/router'
import { apiBaseUrl } from '../utils/constants'
import { User } from './mutations/useRegister'
import { useQuery } from 'react-query'
import { useEffect } from 'react'
import { isServer } from '../utils/isServer'
import { useUserData } from './useUserData'

function getUserData(token: string): Promise<User> {
  return axios
    .get(`${apiBaseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
}

interface UseUserProps {
  redirectTo: string
}

// Gets the user from the localstorage
// if user is not found then redirects to given page
export function useUser({ redirectTo }: UseUserProps) {
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) {
      router.push(redirectTo)
    }
  }, [redirectTo, router])
}

// Gets the token from the localstorage
// if token is not found then returns null else makes the request to get the user with the token
export function useMe() {
  return useQuery('me', () => {
    const userData = localStorage.getItem('userData')
    // return early if the userData does not exist or ther user type is guest
    if (!userData || JSON.parse(userData)?.type === 'guest') {
      return null
    }
    const parsedData: User = JSON.parse(userData)
    return getUserData(parsedData.token)
  })
}

export function useRedirectToDashboard(includeGuest = false) {
  const router = useRouter()
  // const { isLoading, data } = useMe()
  const userData = useUserData()
  if (includeGuest) {
    if (userData?.type) {
      if (userData.type === 'community') {
        router.push(`/community/dashboard`)
      } else {
        router.push(`/`)
      }
    }
  } else {
    if (userData?.type !== 'guest') {
      if (userData.type === 'community') {
        router.push(`/community/dashboard`)
      } else {
        router.push(`/`)
      }
    }
  }
}

export const useGetUserDataFromLocalStorage = (): User => {
  if (isServer) return null
  const userData = localStorage.getItem('userData')
  if (!userData) {
    return null
  }
  return JSON.parse(userData)
}
