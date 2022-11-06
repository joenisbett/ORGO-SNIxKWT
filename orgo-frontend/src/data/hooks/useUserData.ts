import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { UserType } from '../../components/ProfileCard'
import { isServer } from '../utils/isServer'
import { User } from './mutations/useRegister'

export const useUserData = () => {
  const router = useRouter()
  const userData: User = useMemo(() => {
    if (isServer) return null
    return JSON.parse(localStorage.getItem('userData'))
  }, [router.pathname])
  return userData
}

// Flow
// First a volunteer logs in and _id will be volunteer's id
// If he switch to community, _id will be community's id and volunteer's id will be store as _volunteerId
// If he switch to another community, only _id will be changed to new community's id
// Finally, If he switch to volunteer then _id will be volunteer's id and _volunteerId will removed
export const changeUserTypeAndId = (type: UserType, id: string) => {
  if (isServer) return null
  const userData = localStorage.getItem('userData')
  if (!userData) {
    return null
  }

  const parsedUserData = JSON.parse(userData)
  const newUserData = { ...parsedUserData }

  newUserData.type = type

  // If switch from community to community
  if (parsedUserData.type === 'community' && type === 'community') {
    newUserData._id = id
  } else {
    // switch from volunteer to community
    if (type === 'community') {
      newUserData._id = id
      newUserData._volunteerId = parsedUserData._id
    }

    // switch from community to volunteer
    if (type === 'volunteer') {
      newUserData._id = parsedUserData._volunteerId
      delete newUserData._volunteerId
    }
  }

  localStorage.setItem('userData', JSON.stringify(newUserData))
}
