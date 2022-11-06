import { isServer } from '../utils/isServer'
import { User } from './mutations/useRegister'

export function useIsCommunity() {
  if (isServer) return
  const userData: User = JSON.parse(localStorage.getItem('userData'))
  return userData?.type === 'community'
}
