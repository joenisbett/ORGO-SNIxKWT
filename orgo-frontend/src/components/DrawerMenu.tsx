import {
  Box,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { AiOutlineLogout, AiOutlineArrowLeft } from 'react-icons/ai'
import React, { useEffect, useState } from 'react'
import {
  AdminMenus,
  CommunityMenus,
  GuestMenus,
  VolunteerMenus,
} from '../data/utils/DrawerMenuConstants'
import NextLink from 'next/link'
import { IconType } from 'react-icons/lib'
import { useRouter } from 'next/router'
import { useGetUserDataFromLocalStorage, useMe } from '../data/hooks/useUser'
import { useGetAllConnectedCommunityAccounts } from '../data/hooks/query/useGetAllCommunityAccounts'
import ProfileCard from './ProfileCard'
import getStrappiUserData from '../data/utils/strappiUserData'
import { BiUser } from 'react-icons/bi'

export interface DrawerMenuProps {
  isAdmin: boolean
  isOpen: boolean
  onClose: () => void
  finalFocusRef: React.RefObject<HTMLElement>
  isWhiteLabel: boolean
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isAdmin,
  finalFocusRef,
  isOpen,
  onClose,
  isWhiteLabel,
}) => {
  const router = useRouter()
  const handleLogout = () => {
    localStorage.removeItem('userData')
    if (router.pathname === '/') {
      window.location.reload()
    } else {
      router.push('/')
    }
  }
  const { isLoading, data } = useMe()
  const userData = useGetUserDataFromLocalStorage()
  const strappiUserData = getStrappiUserData()

  const {
    isOpen: isCollapseOpen,
    onToggle: onCollapseToggle,
    onClose: onCollapseClose,
  } = useDisclosure()
  const [isShowingProfile, setIsShowingProfile] = useState(false)
  const [currentActiveCommunity, setCurrentActiveCommunity] =
    useState<any>(undefined)

  const getAllConnectedCommunityAccounts = useGetAllConnectedCommunityAccounts(
    userData?.type === 'community' ? userData?._volunteerId : userData?._id
  )

  const showArrowIcon = () => {
    let icon = false

    getAllConnectedCommunityAccounts.data?.forEach((community) => {
      if (community?._id === strappiUserData.attributes?.communityId) {
        icon = true
      }
    })
    return icon
  }

  const getMenus = () => {
    if (isLoading) {
      return
    }

    if (isAdmin || userData?.type === 'community') {
      return CommunityMenus.map((menu) => {
        if (
          strappiUserData.attributes.type === 'white_label' &&
          (menu.name === 'Explore' || menu.name === 'Leaderboard')
        ) {
          return
        }

        return (
          <DrawerMenuLinkItem
            onClose={onClose}
            key={menu.path}
            name={menu.name}
            path={
              menu.path === '/profile'
                ? `/community/profile/${currentActiveCommunity?.name}`
                : menu.path
            }
            icon={menu.icon}
          />
        )
      })
    } else if (userData?.type === 'volunteer') {
      return VolunteerMenus.map((menu) => {
        if (
          strappiUserData.attributes.type === 'white_label' &&
          (menu.name === 'Explore' || menu.name === 'Leaderboard')
        ) {
          return
        }

        return (
          <DrawerMenuLinkItem
            onClose={onClose}
            key={menu.path}
            name={menu.name}
            path={
              menu.path === '/profile'
                ? `/volunteer/profile/${data?.username}`
                : menu.path
            }
            icon={menu.icon}
          />
        )
      })
    } else if (userData?.type === 'guest') {
      return GuestMenus.map((menu) => {
        if (
          strappiUserData.attributes.type === 'white_label' &&
          (menu.name === 'Explore' || menu.name === 'Leaderboard')
        ) {
          return
        }

        return (
          <DrawerMenuLinkItem
            key={menu.path}
            onClose={onClose}
            name={menu.name}
            path={menu.path}
            icon={menu.icon}
          />
        )
      })
    } else if (userData?.type === 'admin') {
      return AdminMenus.map((menu) => {
        if (
          strappiUserData.attributes.type === 'white_label' &&
          (menu.name === 'Explore' || menu.name === 'Leaderboard')
        ) {
          return
        }

        return (
          <DrawerMenuLinkItem
            key={menu.path}
            onClose={onClose}
            name={menu.name}
            path={menu.path}
            icon={menu.icon}
          />
        )
      })
    }
  }

  useEffect(() => {
    getAllConnectedCommunityAccounts.data?.forEach((community) => {
      if (community?._id === userData?._id) setCurrentActiveCommunity(community)
    })
  }, [getAllConnectedCommunityAccounts.data])

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="sm"
      onClose={() => {
        onClose()
        setIsShowingProfile(false)
        onCollapseClose()
      }}
      finalFocusRef={finalFocusRef}
    >
      <DrawerOverlay />
      <Skeleton isLoaded={!isLoading}>
        <DrawerContent>
          <DrawerCloseButton />
          {!isShowingProfile ? (
            <>
              <DrawerHeader mt="10" mb="2" pb="0">
                {!isLoading &&
                  (userData?.type === 'volunteer' ? (
                    <ProfileCard
                      name={data?.name}
                      avatar={data?.avatar}
                      type="volunteer"
                      onClick={
                        isWhiteLabel
                          ? () => {
                              let func = () => undefined

                              getAllConnectedCommunityAccounts.data?.forEach(
                                (community) => {
                                  if (
                                    community?._id ===
                                    strappiUserData.attributes?.communityId
                                  ) {
                                    func = onCollapseToggle
                                  }
                                }
                              )
                              return func()
                            }
                          : !!getAllConnectedCommunityAccounts.data?.length
                          ? onCollapseToggle
                          : () => undefined
                      }
                      isActive
                      showArrow={
                        isWhiteLabel
                          ? showArrowIcon()
                          : !!getAllConnectedCommunityAccounts.data?.length
                      }
                      isCollapseOpen={isCollapseOpen}
                    />
                  ) : (
                    getAllConnectedCommunityAccounts.data?.map((profile) => {
                      if (profile?._id === userData?._id) {
                        return (
                          <ProfileCard
                            key={profile?._id}
                            name={profile?.name}
                            avatar={profile?.logo}
                            type="community"
                            onClick={onCollapseToggle}
                            isActive
                            showArrow
                            isCollapseOpen={isCollapseOpen}
                          />
                        )
                      }
                    })
                  ))}
                {userData?.type === 'guest' ? (
                  <ProfileCard name="" avatar="" type="guest" />
                ) : null}
                {userData?.type === 'admin' ? (
                  <ProfileCard
                    name={userData?.name}
                    avatar={userData?.avatar}
                    type="admin"
                  />
                ) : null}
              </DrawerHeader>

              <DrawerBody>
                <Collapse in={isCollapseOpen} animateOpacity>
                  <Box borderTop="2px" borderColor="gray.200">
                    {getAllConnectedCommunityAccounts.data?.length &&
                    userData?._volunteerId ? (
                      <Box my="4">
                        <ProfileCard
                          name={data?.name}
                          avatar={data?.avatar}
                          type="volunteer"
                        />
                      </Box>
                    ) : null}
                    {isWhiteLabel ? (
                      <>
                        {getAllConnectedCommunityAccounts.data?.length &&
                        !userData?._volunteerId
                          ? getAllConnectedCommunityAccounts.data?.map(
                              (community) => {
                                if (
                                  community?._id !== userData?._id &&
                                  community?._id ===
                                    strappiUserData.attributes?.communityId
                                ) {
                                  return (
                                    <Box my="4" key={community?._id}>
                                      <ProfileCard
                                        id={community?._id}
                                        name={community?.name}
                                        avatar={community?.logo}
                                        type="community"
                                      />
                                    </Box>
                                  )
                                }
                              }
                            )
                          : null}
                      </>
                    ) : (
                      <>
                        {getAllConnectedCommunityAccounts.data?.length &&
                        !userData?._volunteerId
                          ? getAllConnectedCommunityAccounts.data
                              ?.slice(0, 1)
                              ?.map((community) => {
                                if (community?._id !== userData?._id) {
                                  return (
                                    <Box my="4" key={community?._id}>
                                      <ProfileCard
                                        id={community?._id}
                                        name={community?.name}
                                        avatar={community?.logo}
                                        type="community"
                                      />
                                    </Box>
                                  )
                                }
                              })
                          : null}
                      </>
                    )}
                  </Box>
                  {!isWhiteLabel ? (
                    <>
                      {getAllConnectedCommunityAccounts.data?.length > 1 ? (
                        <Text
                          color={`${
                            strappiUserData.attributes?.brand_color || 'blue'
                          }.500`}
                          cursor="pointer"
                          display="inline-block"
                          onClick={() => setIsShowingProfile(true)}
                        >
                          See All Profiles
                        </Text>
                      ) : null}
                    </>
                  ) : null}
                </Collapse>

                {getMenus()}

                {userData?.type !== 'guest' ? (
                  <DrawerMenuLinkItem
                    onClose={() => {
                      handleLogout()
                      onClose()
                    }}
                    icon={AiOutlineLogout}
                    name="Logout"
                  />
                ) : (
                  <DrawerMenuLinkItem
                    onClose={() => {
                      onClose()
                      router.push('/login')
                    }}
                    icon={BiUser}
                    name="Login or Signup"
                  />
                )}
              </DrawerBody>
            </>
          ) : (
            <>
              <DrawerHeader mt="2" mb="2" py="0">
                <Flex alignItems="center" mt="0.5">
                  <IconButton
                    aria-label="Go Back"
                    icon={<AiOutlineArrowLeft style={{ fontSize: '20px' }} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShowingProfile(false)}
                  />

                  <Text ml="4">Select Profile</Text>
                </Flex>
              </DrawerHeader>
              <DrawerBody>
                {getAllConnectedCommunityAccounts.data?.length &&
                userData?._volunteerId ? (
                  <Box my="4">
                    <ProfileCard
                      name={data?.name}
                      avatar={data?.avatar}
                      type="volunteer"
                    />
                  </Box>
                ) : null}
                {getAllConnectedCommunityAccounts.data?.length
                  ? getAllConnectedCommunityAccounts.data?.map((community) => {
                      if (community?._id !== userData?._id) {
                        return (
                          <Box my="4" key={community?._id}>
                            <ProfileCard
                              id={community?._id}
                              name={community?.name}
                              avatar={community?.logo}
                              type="community"
                            />
                          </Box>
                        )
                      }
                    })
                  : null}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Skeleton>
    </Drawer>
  )
}

export interface DrawerMenuLinkItemProps {
  icon: IconType
  name: string
  path?: string
  onClose: () => void
}

export const DrawerMenuLinkItem: React.FC<DrawerMenuLinkItemProps> = ({
  icon: Icon,
  name,
  path,
  onClose,
}) => {
  return (
    <Box onClick={onClose}>
      <NextLink href={path ? path : '/'} passHref>
        <Flex cursor="pointer" my="6" alignItems="center">
          <Icon size={30} />
          <Text mx="6" fontSize="xl" fontWeight="bold">
            {name}
          </Text>
        </Flex>
      </NextLink>
    </Box>
  )
}
