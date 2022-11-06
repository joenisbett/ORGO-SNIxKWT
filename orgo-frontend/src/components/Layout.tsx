import { Box, Container, useMediaQuery } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useUserData } from '../data/hooks/useUserData'
import getStrappiUserData from '../data/utils/strappiUserData'
import FooterMenu from './FooterMenu'
import { NavBar } from './NavBar'

const guestUser = (strappiUserData) => {
  return {
    _id: 'guest101',
    name: `${strappiUserData.attributes?.brand_name || ''} Guest`,
    type: 'guest',
    email: 'guest@user.com',
    username: 'guest101',
    phone: '1234567890',
    token: '1234567890',
  }
}

export const Layout: React.FC = ({ children }) => {
  const router = useRouter()
  const [isLargerThan615] = useMediaQuery('(min-width: 615px)')
  const strappiUserData = getStrappiUserData()
  const userData = useUserData() || guestUser(strappiUserData)

  return (
    <Box>
      <NavBar />
      {router.pathname !== '/explore' ? (
        <Container pb="24">{children}</Container>
      ) : isLargerThan615 ? (
        <Container pb="16">{children}</Container>
      ) : (
        children
      )}
      {userData && userData.type !== 'admin' ? <FooterMenu /> : null}
    </Box>
  )
}
