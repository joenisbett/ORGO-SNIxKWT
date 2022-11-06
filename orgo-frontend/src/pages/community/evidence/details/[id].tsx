import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import * as Yup from 'yup'
import NextLink from 'next/link'
import { EvidenceCard } from '../../../../components/EvidenceCard'
import GoBack from '../../../../components/GoBack'
import { useApproveEvidence } from '../../../../data/hooks/mutations/useApproveEvidence'
import { useCommentOnEvidence } from '../../../../data/hooks/mutations/useCommentOnEvidence'
import { useGetEvidenceById } from '../../../../data/hooks/query/useGetEvidenceById'
import Head from 'next/head'
import { useUser } from '../../../../data/hooks/useUser'
import {
  DenyEvidenceInput,
  useDenyEvidence,
} from '../../../../data/hooks/mutations/useDenyEvidence'
import { useFormik } from 'formik'
import { CustomTextInput } from '../../../../components/CustomInput'
import { EventCategory, logEvent } from '../../../../data/utils/analytics'
import getStrappiUserData from '../../../../data/utils/strappiUserData'
import httpToHttpsUrl from '../../../../data/utils/httpToHttpsUrl'
import { GrDocumentPdf } from 'react-icons/gr'

function EvidenceDetails() {
  useUser({ redirectTo: '/login' })
  const router = useRouter()
  const toast = useToast()

  const evidenceId = router.query.id as string
  const { data, isLoading } = useGetEvidenceById(evidenceId)
  const [comment, setComment] = useState('')
  const { mutate: commentOnEvidence, isLoading: commentAddLoading } =
    useCommentOnEvidence()

  const {
    isLoading: approvingEvidence,
    mutate: approveEvidence,
    isSuccess,
  } = useApproveEvidence()

  const {
    isLoading: denyEvidenceLoading,
    mutate: denyEvidence,
    isSuccess: denyEvidenceSuccess,
  } = useDenyEvidence()

  const {
    isOpen: denyModalIsOpen,
    onOpen: denyModalOnOpen,
    onClose: denyModalOnClose,
  } = useDisclosure()

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment && comment.length > 0) {
      logEvent(EventCategory.SUBMISSION, 'Comment added for submission')
      setComment('')
      return commentOnEvidence({ evidenceId, message: comment.trim() })
    }
    return toast({
      title: 'Comment is empty',
      status: 'error',
      duration: 8000,
      isClosable: true,
    })
  }

  if (isLoading) {
    return <Skeleton height="400px" />
  }

  return (
    <Box>
      <Head>
        <title>Evidence Details</title>
      </Head>
      <GoBack />
      <Text fontWeight="bold">Submission For</Text>
      <EvidenceCard
        creatorCommunityName={data.taskId.name}
        id={data._id}
        location={data.taskId.address}
        priority={data.taskId.priority}
        title={data.taskId.name}
        status={data.status}
        rewards={data.taskId.rewards}
        showPriority={false}
        showDetails={false}
      />
      <Text color="gray.500">{data?.evidenceDetails}</Text>

      {/* <Box my="6">
        <Text fontWeight="bold">Attached Images</Text>
        {data?.evidenceImages?.length === 0 && (
          <Box my="4" borderRadius="5px" p="4" bg="gray.400">
            <Text>No images attached</Text>
          </Box>
        )}
        {data?.evidenceImages?.map((image) => (
          <img key={image} src={image} />
        ))}
      </Box> */}

      <Box>
        <NextLink
          href={`https://maps.google.com/?q=${data?.latitude},${data?.longitude}`}
          passHref
        >
          <Link target="_blank" textDecoration="underline">
            This image was shot at this location
          </Link>
        </NextLink>
      </Box>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'gray.200',
          borderRadius: 'md',
          p: 4,
          pt: 6,
          mt: 5,
        }}
      >
        <Box>
          <Text fontWeight="bold" mb="4" fontSize="xl">
            Submitted Details
          </Text>
          <Box>
            {data?.formData?.map((item) => (
              <>
                {item.label !== 'Tag volunteers' ? (
                  <Flex key={item._id} my="2.5" flexDirection="column">
                    <Text fontWeight="bold">{item.label} : </Text>
                    {typeof item.value === 'string' ? (
                      <Text>{item.value}</Text>
                    ) : item.value?.[0]?.includes('res.cloudinary.com') ? (
                      <>
                        {item.value?.map((fileUrl) =>
                          fileUrl.includes('.pdf') ? (
                            <Box
                              key={fileUrl}
                              mb="2"
                              mr="2"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              height="100px"
                              width="100px"
                              cursor="pointer"
                              onClick={() => {
                                window.open(fileUrl)
                              }}
                            >
                              <GrDocumentPdf fontSize={30} />
                            </Box>
                          ) : (
                            <Image
                              key={fileUrl}
                              mb="2"
                              mr="2"
                              alt="image"
                              src={httpToHttpsUrl(fileUrl)}
                              height="100px"
                              width="100px"
                              cursor="pointer"
                              onClick={() => {
                                window.open(fileUrl)
                              }}
                            />
                          )
                        )}
                      </>
                    ) : (
                      item.value?.map((text) => <Text key={text}>{text}</Text>)
                    )}
                  </Flex>
                ) : null}
              </>
            ))}
          </Box>
        </Box>

        <EvidenceDenyModal
          isOpen={denyModalIsOpen}
          onClose={denyModalOnClose}
          onOpen={denyModalOnOpen}
          denyEvidence={denyEvidence}
          evidenceId={evidenceId}
          denyEvidenceLoading={denyEvidenceLoading}
          denySuccess={denyEvidenceSuccess}
        />

        <Box mt="5">
          <Text fontWeight="bold">Evidence Submitted By: </Text>
          <Flex my="4">
            <Avatar
              name={data.userId?.username}
              size="lg"
              cursor="pointer"
              src={httpToHttpsUrl(data.userId?.avatar)}
              onClick={() =>
                router.push(`/${data.userId?.type}/${data.userId?.username}`)
              }
            />
            <Text mx="4" fontWeight="semibold">
              {data.userId?.username}
            </Text>
          </Flex>
          {data.helpers?.length ? (
            <Box>
              <Text fontWeight="bold" my="2">
                Tagged Volunteers :
              </Text>
              <AvatarGroup size="md">
                {data.helpers?.map((helper) => (
                  <Avatar
                    cursor="pointer"
                    key={helper._id}
                    onClick={() =>
                      router.push(
                        `/${data.userId?.type}/profile/${helper?.id?.username}`
                      )
                    }
                    name={helper.id.name}
                    src={httpToHttpsUrl(helper.id.avatar)}
                  />
                ))}
              </AvatarGroup>
            </Box>
          ) : null}
        </Box>
      </Box>

      <HStack mt="6">
        <Button
          colorScheme="green"
          isLoading={approvingEvidence}
          disabled={
            isSuccess ||
            data.status === 'approved' ||
            data.status === 'denied' ||
            denyEvidenceSuccess
          }
          onClick={() => {
            logEvent(EventCategory.EVIDENCE, 'Evidence Approved')
            approveEvidence({ evidenceId })
          }}
        >
          {data.status === 'approved' ? 'Already Approved' : 'Approve Evidence'}
        </Button>

        <Button
          colorScheme="red"
          isLoading={denyEvidenceLoading}
          disabled={
            denyEvidenceSuccess ||
            data.status === 'denied' ||
            data.status === 'approved' ||
            isSuccess
          }
          onClick={() => denyModalOnOpen()}
        >
          {data.status === 'denied' ? 'Already Denied' : 'Deny Evidence'}
        </Button>
      </HStack>

      <Box my="6">
        <Text fontWeight="bold" mb="4">
          Comments
        </Text>
        <form onSubmit={handleCommentSubmit}>
          <Flex>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comments here"
              variant="filled"
            />
            <Button type="submit" isLoading={commentAddLoading} mx="4">
              Post
            </Button>
          </Flex>
        </form>

        {data.comments?.map((comment) => {
          return (
            <HStack my="4" key={comment._id}>
              <Text
                bg="gray.200"
                color="gray.500"
                w="80%"
                borderRadius="5px"
                p="2"
              >
                {comment.message}
              </Text>
              <Avatar
                name={comment.sender.username}
                size="lg"
                cursor="pointer"
                onClick={() =>
                  router.push(
                    `/${comment.sender.type}/profile/${comment.sender.username}`
                  )
                }
                src={httpToHttpsUrl(comment.sender.avatar)}
              />
            </HStack>
          )
        })}
      </Box>
    </Box>
  )
}

export interface EvidenceDenyModal {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  denyEvidence: (input: DenyEvidenceInput) => void
  evidenceId: string
  denyEvidenceLoading: boolean
  denySuccess: boolean
}

const EvidenceDenyModal: React.FC<EvidenceDenyModal> = ({
  isOpen,
  onClose,
  denyEvidence,
  evidenceId,
  denyEvidenceLoading,
  denySuccess,
}) => {
  const strappiUserData = getStrappiUserData()

  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema: Yup.object({
      reason: Yup.string().required('Reason is required'),
    }),
    onSubmit: (values) => {
      logEvent(EventCategory.EVIDENCE, 'Evidence Denied')
      denyEvidence({ evidenceId, reason: values.reason })
    },
  })
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reason</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CustomTextInput
              isTouched={formik.touched.reason}
              isInvalid={!!formik.errors.reason}
              errorMessage={formik.errors.reason}
              name="reason"
              formik={formik}
              label="Reason"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
              mr={3}
              onClick={formik.handleSubmit as any}
              isLoading={denyEvidenceLoading}
              disabled={denySuccess}
            >
              Deny Evidence
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EvidenceDetails
