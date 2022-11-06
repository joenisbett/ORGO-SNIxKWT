import { Box, Skeleton, Text } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useMemo } from 'react'
import { EvidenceCard } from '../../../components/EvidenceCard'
import GoBack from '../../../components/GoBack'
import { useGetEvidenceByCommunityId } from '../../../data/hooks/query/useGetEvidenceByCommunityId'
import { useUser } from '../../../data/hooks/useUser'
import { useUserData } from '../../../data/hooks/useUserData'

// TODO: Use enums for the status and priority
function EvidenceReview() {
  useUser({ redirectTo: '/login' })
  const userData = useUserData()

  const { data, isLoading } = useGetEvidenceByCommunityId(userData?._id)

  const underReview = useMemo(() => {
    if (!isLoading && data && data.length > 0) {
      return data.filter((evidence) => evidence.status === 'To be approved')
    }
  }, [data, isLoading])

  const reviewed = useMemo(() => {
    if (!isLoading && data && data.length > 0) {
      return data.filter(
        (evidence) =>
          evidence.status === 'approved' || evidence.status === 'denied'
      )
    }
  }, [data, isLoading])

  if (isLoading) {
    return <Skeleton isLoaded={!isLoading} height="200px" />
  }

  return (
    <Box>
      <Head>
        <title>Evidence Submissions</title>
      </Head>
      <GoBack />
      <Text
        mt="4"
        fontSize={{ base: 'xl', sm: '2xl', lg: '3xl' }}
        fontWeight="extrabold"
      >
        These are the task that submitted evidence for
      </Text>
      <Text
        fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
        fontWeight="extrabold"
      >
        Review evidence for submitted tasks:
      </Text>

      <Box my="12">
        <Skeleton isLoaded={!isLoading}>
          {data && data.length === 0 && <Text>No evidence to review.</Text>}
          {underReview && underReview?.length > 0 && (
            <Box>
              <Text fontWeight="medium" fontSize="xl">
                Under review:
              </Text>
              {underReview?.map((evidence) => {
                return (
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
                )
              })}
            </Box>
          )}

          {reviewed && reviewed?.length > 0 && (
            <Box>
              <Text my="6" fontWeight="medium" fontSize="xl">
                Reviewed:
                {reviewed?.map((evidence) => {
                  return (
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
                  )
                })}
              </Text>
            </Box>
          )}
        </Skeleton>
      </Box>
    </Box>
  )
}

export default EvidenceReview
