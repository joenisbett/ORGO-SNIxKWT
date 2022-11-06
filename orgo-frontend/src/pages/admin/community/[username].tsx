import {
  Avatar,
  Badge,
  Box,
  Button,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterCircle,
  AiFillLinkedin,
} from 'react-icons/ai'
import { BsGlobe2 } from 'react-icons/bs'
import { useGetCommunityProfile } from '../../../data/hooks/query/useGetUserProfile'
import { useShowContactInfo } from '../../../data/hooks/useShowContacInfo'
import Head from 'next/head'
import { TaskCard } from '../../../components/TaskCard'
import { useGetActiveCommunityTasks } from '../../../data/hooks/query/useGetActiveCommunityTasks'
import { useDeleteCommunity } from '../../../data/hooks/mutations/useCommunity'

function Profile() {
  const toast = useToast()
  const router = useRouter()
  const username = router.query.username as string

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure()
  const { isLoading, data } = useGetCommunityProfile(username)
  const { isLoading: isTasksDataLoading, data: tasksData } =
    useGetActiveCommunityTasks(data?._id || '')
  const deleteCommunity = useDeleteCommunity(() => {
    onCloseDeleteModal()
    toast({
      title: 'Community deleted successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
    router.push('/admin/dashboard')
  })
  const showContactInfo = useShowContactInfo()

  if (isLoading) {
    return <Skeleton height="100px" isLoaded={!isLoading} />
  }

  return (
    <Box>
      <Head>
        <title>Community - Profile</title>
      </Head>
      <VStack spacing={4}>
        <Avatar
          name={data?.name}
          size="2xl"
          cursor="pointer"
          src={data?.logo}
        />

        <Text fontWeight="bold" fontSize="xl">
          {data?.name}
        </Text>
        <HStack>
          {data?.siteLink && (
            <NextLink href={data.siteLink} passHref>
              <a target="_blank">
                <BsGlobe2 size={20} />
              </a>
            </NextLink>
          )}

          {data?.facebookLink && (
            <NextLink href={data.facebookLink} passHref>
              <a target="_blank">
                <AiFillFacebook size={20} />
              </a>
            </NextLink>
          )}

          {data?.instagramLink && (
            <NextLink href={data.instagramLink} passHref>
              <a target="_blank">
                <AiFillInstagram size={20} />
              </a>
            </NextLink>
          )}

          {data?.twitterLink && (
            <NextLink href={data.twitterLink} passHref>
              <a target="_blank">
                <AiFillTwitterCircle size={20} />
              </a>
            </NextLink>
          )}

          {data?.linkedinLink && (
            <NextLink href={data.linkedinLink} passHref>
              <a target="_blank">
                <AiFillLinkedin size={20} />
              </a>
            </NextLink>
          )}
        </HStack>

        <Button
          bgColor="red.500"
          color="white"
          sx={{
            '&:hover': {
              bgColor: 'red.400',
            },
          }}
          onClick={onOpenDeleteModal}
        >
          Delete this community
        </Button>

        <Box width="100%" bg="gray.300" p="8" borderRadius="10px">
          <Badge
            colorScheme={data?.verified === 'verified' ? 'green' : 'yellow'}
          >
            {data?.verified === 'verified' ? 'Verified' : 'Not Verified'}
          </Badge>
          <Text fontWeight="bold" fontSize="lg" mt="2">
            Bio
          </Text>
          <Text>{data?.bio ? data.bio : 'No Bio Provided'}</Text>
          <Text fontWeight="bold" fontSize="lg" mt="2">
            Address
          </Text>
          <Text>{data?.city ? data.city : 'No address provided'}</Text>

          {showContactInfo && data?.email && (
            <>
              <Text fontWeight="bold" fontSize="lg" mt="2">
                Email Address
              </Text>
              <Text>{data.email}</Text>
            </>
          )}

          {showContactInfo && data?.phone && (
            <>
              <Text fontWeight="bold" fontSize="lg" mt="2">
                Phone Number
              </Text>
              <Link href={`tel:${data.phone}`}>{data.phone}</Link>
            </>
          )}
        </Box>
      </VStack>
      <Box>
        <Text my="6" fontSize="lg" fontWeight="bold">
          Tasks
        </Text>

        {!isTasksDataLoading && tasksData?.length === 0 && (
          <Text fontWeight="bold" fontSize="sm" mt="10" textAlign="center">
            No Tasks found
          </Text>
        )}

        {isTasksDataLoading
          ? [1, 2, 3].map((item) => <Skeleton key={item} height="40" my="6" />)
          : tasksData?.map((task) => (
              <TaskCard
                creatorUsername={task?.creator.name}
                rewards={task.rewards}
                key={task?._id}
                creatorCommunityName={task?.creatorCommunityName}
                location={task?.address}
                priority={task?.priority ?? 'medium'}
                status={task?.status ?? 'active'}
                title={task?.name}
                id={task?._id}
                showStatus={false}
                usedForAdmin
              />
            ))}
      </Box>
      <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete this Community</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this community? You can't undo this
            action.
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onCloseDeleteModal}>
              Close
            </Button>
            <Button
              colorScheme="red"
              isLoading={deleteCommunity.isLoading}
              onClick={() => {
                deleteCommunity.mutate(data?._id)
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Profile
