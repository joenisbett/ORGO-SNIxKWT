import { CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Text,
  FormLabel,
  Input,
  Box,
  HStack,
  Avatar,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useGetCommunityMembers } from '../data/hooks/query/useGetCommunityMembers'
import { useEditProfile } from '../data/hooks/mutations/useEditProfile'
import { User } from '../data/hooks/mutations/useRegister'
import { useGetUserByPartialUsername } from '../data/hooks/query/useGetUserByPartialUsername'
import { useDebounce } from '../data/hooks/useDebounce'
import { useGetUserDataFromLocalStorage } from '../data/hooks/useUser'
import { UserCard } from '../pages/volunteer/evidence/submit/[id]'
import {
  CustomMapInput,
  CustomTextAreaInput,
  CustomTextInput,
} from './CustomInput'
import MapModal from './Map/MapModal'
import {
  useAddMemberToCommunity,
  useRemoveMemberFromCommunity,
} from '../data/hooks/mutations/useCommunityMembers'
import getStrappiUserData from '../data/utils/strappiUserData'
import { useUpdateCommunity } from '../data/hooks/mutations/useCommunity'
import { useIsCommunity } from '../data/hooks/useIsCommunity'
import { queryClient } from '../pages/_app'
import { useUpdateCommunityLocation } from '../data/hooks/mutations/useMapLocation'

export interface EditProfileDrawer {
  isOpen: boolean
  onClose: () => void
  initialData: User
  refetchDataAfterLocationUpdate?: () => void
}

export const EditProfileDrawer: React.FC<EditProfileDrawer> = ({
  isOpen,
  onClose,
  initialData,
  refetchDataAfterLocationUpdate = () => undefined,
}) => {
  const toast = useToast()
  const strappiUserData = getStrappiUserData()
  const isCommunity = useIsCommunity()
  const [searchUsername, setSearchUsername] = useState('')

  const debouncedUsername = useDebounce(searchUsername, 500)
  const userData = useGetUserDataFromLocalStorage()

  const { isLoading, mutate: editProfile, isSuccess } = useEditProfile()
  const { isLoading: userSearchLoading, data: foundUsers } =
    useGetUserByPartialUsername(debouncedUsername)

  const {
    isOpen: isMapModalOpen,
    onOpen: onMapModalOpen,
    onClose: onMapModalClose,
  } = useDisclosure()

  const getCommunityMembers = useGetCommunityMembers(userData?._id)
  const addMemberToCommunity = useAddMemberToCommunity(() => {
    getCommunityMembers.refetch()
    toast({
      title: 'Member added successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  })
  const removeMemberFromCommunity = useRemoveMemberFromCommunity(() => {
    getCommunityMembers.refetch()
    toast({
      title: 'Member removed successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  })
  const updateCommunityLocation = useUpdateCommunityLocation(() => {
    onMapModalClose()
    refetchDataAfterLocationUpdate()
  })

  const updateCommunity = useUpdateCommunity(() => {
    onClose()
    queryClient.invalidateQueries('community-profile')
    toast({
      title: 'Profile Successfully Updated',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  })

  const [address, setAddress] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      name: initialData?.name,
      bio: initialData?.bio,
      address: initialData?.address,
      siteLink: initialData?.siteLink,
      facebookLink: initialData?.facebookLink,
      instagramLink: initialData?.instagramLink,
      twitterLink: initialData?.twitterLink,
      linkedinLink: initialData?.linkedinLink,
      city: initialData?.city,
      phone: initialData?.phone,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Name must be at least 5 characters long')
        .required('Name is required'),
      bio: Yup.string().min(5, 'Bio must be at least 5 characters long'),
      address: Yup.string(),
      siteLink: Yup.string().url('Site URL is not valid'),
      facebookLink: Yup.string().url('Facebook URL is not valid'),
      instagramLink: Yup.string().url('Instagram URL is not valid'),
      twitterLink: Yup.string().url('Twitter URL is not valid'),
      linkedinLink: Yup.string().url('Linkedin URL is not valid'),
      city: Yup.string(),
      phone: Yup.string().min(
        10,
        'Phone number must be at least 10 characters long'
      ),
    }),
    onSubmit: (value) => {
      if (isCommunity) {
        updateCommunity.mutate({
          communityId: userData?._id,
          data: value,
        })
      } else {
        editProfile(value)
      }
    },
  })

  useEffect(() => {
    if (isSuccess) {
      onClose()
    }
  }, [isSuccess, onClose])

  return (
    <>
      <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={formik.handleSubmit}>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Settings</DrawerHeader>
            <DrawerBody>
              <Text fontSize="md" fontWeight="bold" mb="4">
                Edit Your Profile
              </Text>
              <CustomTextInput
                isTouched={formik.touched.name}
                isInvalid={!!formik.errors.name}
                errorMessage={formik.errors.name}
                name="name"
                formik={formik}
                label="Name"
              />

              <CustomTextAreaInput
                isTouched={formik.touched.bio}
                isInvalid={!!formik.errors.bio}
                errorMessage={formik.errors.bio}
                name="bio"
                formik={formik}
                label="Bio"
              />

              {userData?.type === 'community' ? (
                <CustomMapInput
                  isTouched={formik.touched.city}
                  isInvalid={!!formik.errors.city}
                  errorMessage={formik.errors.city}
                  name="city"
                  formik={formik}
                  label="Address"
                  placeholder="Select your location..."
                  handleClick={onMapModalOpen}
                  value={address ? address : initialData?.city || ''}
                />
              ) : null}

              {userData?.type === 'volunteer' ? (
                <CustomTextInput
                  isTouched={formik.touched.city}
                  isInvalid={!!formik.errors.city}
                  errorMessage={formik.errors.city}
                  name="city"
                  formik={formik}
                  label="Address"
                  helperText="Optional field"
                />
              ) : null}

              <CustomTextInput
                isTouched={formik.touched.phone}
                isInvalid={!!formik.errors.phone}
                errorMessage={formik.errors.phone}
                name="phone"
                formik={formik}
                label="Phone Number"
                helperText="Optional field"
              />

              <CustomTextInput
                isTouched={formik.touched.siteLink}
                isInvalid={!!formik.errors.siteLink}
                errorMessage={formik.errors.siteLink}
                name="siteLink"
                formik={formik}
                label="Website"
                helperText="Link to your website"
              />

              <CustomTextInput
                isTouched={formik.touched.facebookLink}
                isInvalid={!!formik.errors.facebookLink}
                errorMessage={formik.errors.facebookLink}
                name="facebookLink"
                formik={formik}
                label="Facebook"
                helperText="Link to your profile"
              />

              <CustomTextInput
                isTouched={formik.touched.instagramLink}
                isInvalid={!!formik.errors.instagramLink}
                errorMessage={formik.errors.instagramLink}
                name="instagramLink"
                formik={formik}
                label="Instagram"
                helperText="Link to your profile"
              />

              <CustomTextInput
                isTouched={formik.touched.twitterLink}
                isInvalid={!!formik.errors.twitterLink}
                errorMessage={formik.errors.twitterLink}
                name="twitterLink"
                formik={formik}
                label="Twitter"
                helperText="Link to your profile"
              />

              <CustomTextInput
                isTouched={formik.touched.linkedinLink}
                isInvalid={!!formik.errors.linkedinLink}
                errorMessage={formik.errors.linkedinLink}
                name="linkedinLink"
                formik={formik}
                label="Linkedin"
                helperText="Link to your profile"
              />

              {userData?.type === 'community' ? (
                <>
                  <Text mt="7" mb="4" fontSize="md" fontWeight="bold">
                    Manage Your Team
                  </Text>

                  <FormLabel htmlFor="tags">Add Members</FormLabel>
                  <Input
                    id="tags"
                    name="tags"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    variant="filled"
                  />
                  {userSearchLoading && <Skeleton my="2" p="4" height="20px" />}
                  {!userSearchLoading && debouncedUsername && (
                    <Box>
                      {foundUsers && foundUsers.length === 0 && (
                        <Text color="gray.500">
                          Sorry we can’t find any user with ‘{debouncedUsername}
                          ’ as username
                        </Text>
                      )}
                      {foundUsers &&
                        foundUsers.length > 0 &&
                        foundUsers.map((user) => (
                          <UserCard
                            onAdd={() => {
                              addMemberToCommunity.mutate({
                                communityId: userData?._id,
                                userId: user._id,
                              })
                            }}
                            username={user.username}
                            avatar={user.avatar}
                            key={user._id}
                          />
                        ))}
                    </Box>
                  )}
                  <Box my="6">
                    <Text>Members</Text>
                    {getCommunityMembers.data?.members?.length === 0 && (
                      <Text mx="4" color="gray.400">
                        No members yet
                      </Text>
                    )}
                    <HStack spacing={2} my="4">
                      {getCommunityMembers.data?.members?.map(
                        ({ userId: user }) => {
                          return (
                            <Box key={user._id}>
                              <Avatar
                                size="lg"
                                name={user.username}
                                src={user.avatar}
                                position="relative"
                              />
                              <CloseIcon
                                mx="2"
                                cursor="pointer"
                                onClick={() => {
                                  removeMemberFromCommunity.mutate({
                                    communityId: userData?._id,
                                    userId: user._id,
                                  })
                                }}
                              />
                            </Box>
                          )
                        }
                      )}
                    </HStack>
                  </Box>
                </>
              ) : null}
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                type="submit"
                colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
              >
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={onMapModalClose}
        data={initialData}
        isLoading={updateCommunityLocation.isLoading}
        handleConfirm={({ location, locationOnMap }) => {
          setAddress(location)
          updateCommunityLocation.mutate({
            communityId: userData?._id,
            city: location,
            locationOnMap,
          })
        }}
      />
    </>
  )
}
