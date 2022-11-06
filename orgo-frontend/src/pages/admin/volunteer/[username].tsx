import {
  Avatar,
  Box,
  HStack,
  Skeleton,
  Text,
  VStack,
  Badge,
  Link,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
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
import { useGetUserProfile } from '../../../data/hooks/query/useGetUserProfile'
import { useShowContactInfo } from '../../../data/hooks/useShowContacInfo'
import Head from 'next/head'
import { useGetEvidenceForVolunteer } from '../../../data/hooks/query/useGetEvidenceForVolunteer'
import { EvidenceCard } from '../../../components/EvidenceCard'
import { useDeleteUser } from '../../../data/hooks/mutations/useUserMutation'

function Profile() {
  const router = useRouter()
  const username = router.query.username as string
  const showContactInfo = useShowContactInfo()

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure()
  const { isLoading, data } = useGetUserProfile(username)
  const { isLoading: isEvidencesDataLoading, data: evidencesData } =
    useGetEvidenceForVolunteer(data?._id)
  const deleteUser = useDeleteUser()

  if (isLoading) {
    return <Skeleton height="100px" isLoaded={!isLoading} />
  }

  return (
    <Box>
      <Head>
        <title>Volunteer - Profile</title>
      </Head>
      <VStack spacing="4">
        <Avatar
          name={data?.name}
          size="2xl"
          cursor="pointer"
          src={data?.avatar}
        />

        <Text fontWeight="bold" fontSize="xl">
          {data?.name}
        </Text>
        <HStack>
          {data?.siteLink && (
            <NextLink href={data?.siteLink} passHref>
              <a target="_blank">
                <BsGlobe2 size={20} />
              </a>
            </NextLink>
          )}

          {data?.facebookLink && (
            <NextLink href={data?.facebookLink} passHref>
              <a target="_blank">
                <AiFillFacebook size={20} />
              </a>
            </NextLink>
          )}

          {data?.instagramLink && (
            <NextLink href={data?.instagramLink} passHref>
              <a target="_blank">
                <AiFillInstagram size={20} />
              </a>
            </NextLink>
          )}

          {data?.twitterLink && (
            <NextLink href={data?.twitterLink} passHref>
              <a target="_blank">
                <AiFillTwitterCircle size={20} />
              </a>
            </NextLink>
          )}

          {data?.linkedinLink && (
            <NextLink href={data?.linkedinLink} passHref>
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
          Delete this account
        </Button>

        <Box width="100%" bg="gray.300" p="8" borderRadius="10px">
          <Badge colorScheme={data?.verified ? 'green' : 'yellow'}>
            {data?.verified ? 'Verified' : 'Not Verified'}
          </Badge>
          <Text fontWeight="bold" fontSize="lg" mt="2">
            Bio
          </Text>
          <Text>{data?.bio ? data?.bio : 'No Bio Provided'}</Text>

          <Text fontWeight="bold" fontSize="lg" mt="2">
            City
          </Text>
          <Text>{data?.city ? data?.city : 'No city provided'}</Text>

          {showContactInfo && data?.email && (
            <>
              <Text fontWeight="bold" fontSize="lg" mt="2">
                Email Address
              </Text>
              <Text>{data?.email}</Text>
            </>
          )}

          {showContactInfo && data?.phone && (
            <>
              <Text fontWeight="bold" fontSize="lg" mt="2">
                Phone Number
              </Text>
              <Link href={`tel:${data?.phone}`}>{data?.phone}</Link>
            </>
          )}
        </Box>
      </VStack>
      <Box>
        <Text my="6" fontSize="lg" fontWeight="bold">
          Evidences
        </Text>

        {!isEvidencesDataLoading && evidencesData?.length === 0 && (
          <Text fontWeight="bold" fontSize="sm" mt="10" textAlign="center">
            No Evidences found
          </Text>
        )}

        {isEvidencesDataLoading
          ? [1, 2, 3].map((item) => <Skeleton key={item} height="40" my="6" />)
          : evidencesData?.map((evidence) => (
              <EvidenceCard
                rewards={evidence.taskId.rewards}
                key={evidence?._id}
                creatorCommunityName={evidence?.userId?.username}
                id={evidence?._id}
                title={evidence?.taskId?.name}
                status={evidence?.status}
                priority={evidence?.taskId?.priority}
                location={evidence?.taskId?.address}
                showPriority={false}
              />
            ))}
      </Box>
      <Modal isOpen={isOpenDeleteModal} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete this Volunteer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this volunteer? You can't undo this
            action.
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onCloseDeleteModal}>
              Close
            </Button>
            <Button
              colorScheme="red"
              isLoading={deleteUser.isLoading}
              onClick={() => {
                deleteUser.mutate(data?._id)
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
