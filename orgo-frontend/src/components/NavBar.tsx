import { HamburgerIcon } from '@chakra-ui/icons'
import { Flex, useDisclosure, Box, Container } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useUserData } from '../data/hooks/useUserData'
import { DrawerMenu } from './DrawerMenu'

import { GrNotification } from 'react-icons/gr'
import getStrappiUserData from '../data/utils/strappiUserData'

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

export const NavBar: React.FC = () => {
  const { onClose, isOpen, onOpen } = useDisclosure()
  const drawerRef = useRef()
  const strappiUserData = getStrappiUserData()
  const router = useRouter()
  const userData = useUserData() || guestUser(strappiUserData)

  return (
    <Box
      mt="-20px"
      pt="1"
      bg={`${strappiUserData.attributes?.brand_color || 'blue'}.200`}
      borderRadius="5px"
      px="4"
    >
      <Container>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mt="5"
          height={70}
          mb={router.pathname === '/explore' ? '0' : '5'}
        >
          <Box cursor="pointer" height="100%">
            <NextLink
              href={
                userData.type === 'community'
                  ? `/community/dashboard`
                  : userData.type === 'admin'
                  ? '/admin/dashboard'
                  : '/'
              }
              passHref
            >
              <img
                src={`${strappiUserData.attributes?.logo?.data?.attributes?.url}`}
                alt={strappiUserData.attributes?.brand_name || ''}
                width="100%"
                style={{ height: '100%' }}
              />
            </NextLink>
          </Box>
          {userData && (
            <>
              <Flex flexWrap="wrap" alignItems="center" justifyContent="center">
                {userData.type != 'guest' && (
                  <GrNotification
                    cursor="pointer"
                    onClick={() => router.push('/notifications')}
                    size="25"
                  />
                )}

                <HamburgerIcon
                  h="8"
                  w="8"
                  ref={drawerRef}
                  onClick={onOpen}
                  cursor="pointer"
                  mx="4"
                />
              </Flex>
              <DrawerMenu
                finalFocusRef={drawerRef}
                isAdmin={userData?.type === 'community'}
                isWhiteLabel={
                  strappiUserData.attributes?.type === 'white_label'
                }
                isOpen={isOpen}
                onClose={onClose}
              />
            </>
          )}
        </Flex>
      </Container>
    </Box>
  )
}
