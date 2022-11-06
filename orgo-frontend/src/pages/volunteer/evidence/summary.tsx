import { Box, Skeleton, Text } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useMemo } from 'react'
import { EvidenceCard } from '../../../components/EvidenceCard'
import GoBack from '../../../components/GoBack'
import { useGetEvidenceForVolunteer } from '../../../data/hooks/query/useGetEvidenceForVolunteer'
import { useUserData } from '../../../data/hooks/useUserData'
import getStrappiUserData from '../../../data/utils/strappiUserData'

function EvidenceReview() {
  const userData = useUserData()
  const strappiUserData = getStrappiUserData()

  const { data, isLoading } = useGetEvidenceForVolunteer(userData?._id)

  const underReview = useMemo(() => {
    if (!isLoading && data && data.length > 0) {
      if (strappiUserData.attributes?.type === 'white_label') {
        return data.filter(
          (evidence) =>
            evidence.status === 'To be approved' &&
            evidence?.taskId?.creator ===
              strappiUserData.attributes?.communityId
        )
      } else {
        return data.filter((evidence) => evidence.status === 'To be approved')
      }
    }
  }, [data, isLoading])

  const reviewed = useMemo(() => {
    if (!isLoading && data && data.length > 0) {
      if (strappiUserData.attributes?.type === 'white_label') {
        return data.filter(
          (evidence) =>
            (evidence.status === 'approved' || evidence.status === 'denied') &&
            evidence?.taskId?.creator ===
              strappiUserData.attributes?.communityId
        )
      } else {
        return data.filter(
          (evidence) =>
            evidence.status === 'approved' || evidence.status === 'denied'
        )
      }
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
        fontSize={{ base: 'lg', sm: 'xl', lg: '2xl' }}
        fontWeight="extrabold"
      >
        Here is the evidence you submitted. You can check the status by clicking
        on the details below:
      </Text>

      <Box my="12">
        <Skeleton isLoaded={!isLoading}>
          {!underReview?.length && !reviewed?.length ? (
            <Text>
              Sorry, we didn’t find anything. Make sure you submit evidence for
              a task and then come back.
            </Text>
          ) : null}
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
