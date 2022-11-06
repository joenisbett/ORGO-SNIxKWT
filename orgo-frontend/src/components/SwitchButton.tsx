import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import getStrappiUserData from '../data/utils/strappiUserData'

export interface SwitchButtonProps {
  path: string
  label: string
}

export const SwitchButton: React.FC<SwitchButtonProps> = ({ label, path }) => {
  const router = useRouter()
  const strappiUserData = getStrappiUserData()

  return (
    <Button
      colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
      leftIcon={<HiOutlineSwitchHorizontal size={25} />}
      onClick={() => router.push(path)}
    >
      {label}
    </Button>
  )
}
