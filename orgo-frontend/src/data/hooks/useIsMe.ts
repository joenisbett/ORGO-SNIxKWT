import { useUserData } from './useUserData'

export function useIsMe(username: string) {
  const userData = useUserData()
  return userData?.username === username
}

export function useIsMeById(id: string) {
  const userData = useUserData()
  return userData?._id === id
}
