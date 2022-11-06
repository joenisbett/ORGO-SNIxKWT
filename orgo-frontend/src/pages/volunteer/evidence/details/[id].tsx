import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Skeleton,
  Text,
  useToast,
  Link,
  Image,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import NextLink from 'next/link'
import { EvidenceCard } from '../../../../components/EvidenceCard'
import GoBack from '../../../../components/GoBack'
import { useCommentOnEvidence } from '../../../../data/hooks/mutations/useCommentOnEvidence'
import { useGetEvidenceById } from '../../../../data/hooks/query/useGetEvidenceById'
import Head from 'next/head'
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from 'next-share'
import { frontendBaseUrl } from '../../../../data/utils/constants'
import { EventCategory, logEvent } from '../../../../data/utils/analytics'
import httpToHttpsUrl from '../../../../data/utils/httpToHttpsUrl'
import { GrDocumentPdf } from 'react-icons/gr'
import { useUserData } from '../../../../data/hooks/useUserData'

function EvidenceDetails() {
  const router = useRouter()
  const toast = useToast()
  const userData = useUserData()

  const evidenceId = router.query.id as string
  const { data, isLoading } = useGetEvidenceById(evidenceId)
  const [comment, setComment] = useState('')
  const { mutate: commentOnEvidence, isLoading: commentAddLoading } =
    useCommentOnEvidence()

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment && comment.length > 0) {
      logEvent(EventCategory.SUBMISSION, 'Comment added for submission')
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

        <Box mt="5">
          <Text fontWeight="bold">Evidence Submitted By :</Text>
          <Flex my="4">
            <Avatar
              name={data?.userId.username}
              size="lg"
              cursor="pointer"
              src={httpToHttpsUrl(data.userId.avatar)}
            />
            <Text mx="4" fontWeight="semibold">
              {data?.userId.username}
            </Text>
          </Flex>
          {data.helpers.length ? (
            <Box>
              <Text fontWeight="bold" mt="2" mb="4">
                Tagged Volunteers :
              </Text>
              <AvatarGroup size="md">
                {data.helpers.map((helper) => (
                  <Avatar
                    cursor="pointer"
                    key={helper._id}
                    onClick={() =>
                      router.push(`/volunteer/profile/${helper.id.username}`)
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

      {data.status === 'approved' ? (
        <Box my="4" bg="green.300" p="5" borderRadius="5px">
          <Text fontWeight="bold" mb="1">
            Certification
          </Text>
          {userData.verified ? (
            <>
              <Text>
                Congratulations, we are happy to present your certificate to you
                for completing this task.
              </Text>
              <Button
                mt="2"
                size="sm"
                onClick={() => {
                  window.open(
                    `/volunteer/certificate/${evidenceId}/${data?.userId?._id}`
                  )
                }}
              >
                View Certificate
              </Button>
              <Box mt="3">
                <Text fontWeight="bold">Share this certificate via</Text>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 2,
                    '& > *': {
                      mr: 2,
                    },
                  }}
                >
                  <FacebookShareButton
                    url={`${frontendBaseUrl}/volunteer/certificate/${evidenceId}/${data?.userId?._id}`}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <LinkedinShareButton
                    url={`${frontendBaseUrl}/volunteer/certificate/${evidenceId}/${data?.userId?._id}`}
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                </Box>
              </Box>
            </>
          ) : (
            <Text>
              Please{' '}
              <NextLink href="/verification" passHref>
                <Link color="blue.600" textDecoration="underline">
                  verify
                </Link>
              </NextLink>{' '}
              your email to view or share the certificate.
            </Text>
          )}
        </Box>
      ) : null}

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

        {data.comments.map((comment) => {
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

export default EvidenceDetails
