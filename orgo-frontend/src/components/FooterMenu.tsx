import { useRouter } from 'next/router'
import { AiOutlineCompass } from 'react-icons/ai'
import { BiTask } from 'react-icons/bi'
import { MdRateReview } from 'react-icons/md'

import BottomNavigation from 'reactjs-bottom-navigation'
import 'reactjs-bottom-navigation/dist/index.css'
import { useUserData } from '../data/hooks/useUserData'
import getStrappiUserData from '../data/utils/strappiUserData'

export function FooterMenu() {
  const userData = useUserData()
  const router = useRouter()
  const strappiUserData = getStrappiUserData()

  const bottomNavItems = []
  if (strappiUserData.attributes?.type === 'white_label') {
    bottomNavItems.push(
      {
        title: 'Tasks',
        icon: <BiTask style={{ fontSize: '18px' }} />,
        activeIcon: (
          <BiTask
            style={{
              fontSize: '23px',
              color: strappiUserData.attributes?.brand_color,
            }}
          />
        ),
        onClick: () => {
          if (userData.type === 'community') {
            router.push(`/community/dashboard`)
          } else {
            router.push(`/`)
          }
        },
      },
      {
        title: 'Submissions',
        icon: <MdRateReview style={{ fontSize: '18px' }} />,
        activeIcon: (
          <MdRateReview
            style={{
              fontSize: '23px',
              color: strappiUserData.attributes?.brand_color,
            }}
          />
        ),
        onClick: () => router.push(`/${userData.type}/evidence/summary`),
      }
    )
  } else {
    bottomNavItems.push(
      {
        title: 'Explore',
        icon: <AiOutlineCompass style={{ fontSize: '18px' }} />,
        activeIcon: (
          <AiOutlineCompass
            style={{
              fontSize: '23px',
              color: strappiUserData.attributes?.brand_color,
            }}
          />
        ),
        onClick: () => router.push(`/explore`),
      },
      {
        title: 'Tasks',
        icon: <BiTask style={{ fontSize: '18px' }} />,
        activeIcon: (
          <BiTask
            style={{
              fontSize: '23px',
              color: strappiUserData.attributes?.brand_color,
            }}
          />
        ),
        onClick: () => {
          if (userData.type === 'community') {
            router.push(`/community/dashboard`)
          } else {
            router.push(`/`)
          }
        },
      },
      {
        title: 'Submissions',
        icon: <MdRateReview style={{ fontSize: '18px' }} />,
        activeIcon: (
          <MdRateReview
            style={{
              fontSize: '23px',
              color: strappiUserData.attributes?.brand_color,
            }}
          />
        ),
        onClick: () => router.push(`/${userData.type}/evidence/summary`),
      }
    )
  }

  return (
    <BottomNavigation
      items={bottomNavItems}
      activeTextColor={strappiUserData.attributes?.brand_color}
      activeBgColor="transparent"
    />
  )
}

export default FooterMenu
