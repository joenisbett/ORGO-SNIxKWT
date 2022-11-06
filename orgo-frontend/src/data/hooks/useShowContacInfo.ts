import { useRouter } from 'next/router'
import { useIsMe } from './useIsMe'

export function useShowContactInfo() {
  const router = useRouter()
  const username = router.query.username as string
  const isMe = useIsMe(username)
  if (isMe) return true
  return false
}
