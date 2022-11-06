import React from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { apiBaseUrl, frontendBaseUrl } from '../../../../data/utils/constants'
import { convertToValidDate } from '../../../../data/utils/getFormattedDate'
import getStrappiUserData from '../../../../data/utils/strappiUserData'

const VolunteerCertificate = ({ data }) => {
  const router = useRouter()
  const strappiUserData = getStrappiUserData()

  // console.log(data?.completedDate)

  return (
    <>
      <Head>
        <title>Certification</title>
        <meta name="description" content="A certification for task complete" />

        <meta
          property="og:url"
          content={`${frontendBaseUrl}${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Certification" />
        <meta
          property="og:description"
          content="A certification for task complete"
        />
        <meta
          property="og:image"
          content={`${strappiUserData.attributes?.logo?.data?.attributes?.url}`}
        />
      </Head>

      <Box bgColor="blackAlpha.900">
        <Container maxW="1200px" px={0}>
          <Box
            sx={{
              display: 'flex',
              height: '100vh',
              width: '1200px',
            }}
          >
            <Box
              flex={1}
              position="relative"
              px={20}
              background={`url(${strappiUserData.attributes?.logo?.data?.attributes?.url}) no-repeat center/contain`}
              bgColor={`${
                strappiUserData.attributes?.brand_color || 'blue'
              }.600`}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  bgColor: `${
                    strappiUserData.attributes?.brand_color || 'blue'
                  }.500`,
                  zIndex: 1,
                  opacity: 0.65,
                }}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                color="white"
                position="relative"
                zIndex={10}
                height="100%"
              >
                <Text fontSize="5xl" lineHeight="10" fontWeight="bold">
                  Verified
                </Text>
                <Text fontSize="5xl" lineHeight="shorter" fontWeight="bold">
                  Certificate of
                </Text>
                <Text fontSize="5xl" lineHeight="10" fontWeight="bold">
                  Completion
                </Text>
                <Box
                  sx={{
                    my: 10,
                    bgColor: 'yellow.500',
                    px: 8,
                    py: 4,
                    borderRadius: '50px',
                    maxWidth: '220px',
                  }}
                >
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    color={`${
                      strappiUserData.attributes?.brand_color || 'blue'
                    }.900`}
                    textAlign="center"
                  >
                    {convertToValidDate(new Date(data?.completedDate))}
                  </Text>
                </Box>
                <Text>This certificate is awarded by</Text>
                <Text fontWeight="bold" color="yellow.400" fontSize="lg" my={2}>
                  Community Leader
                </Text>
                <Text fontSize="lg">17 May, 2022</Text>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              flex={1}
              bgColor="gray.100"
              px={14}
            >
              <Text fontSize="lg" lineHeight="3">
                This certificate thereby is
              </Text>
              <Text fontSize="lg">granted to</Text>
              <Text
                my={16}
                fontSize="5xl"
                lineHeight="10"
                fontWeight="bold"
                color="yellow.500"
              >
                {data?.volunteer}
              </Text>
              <Text fontSize="lg" mb="4">
                for successfully completed the "{data?.task}" task
              </Text>
              <Text fontSize="lg" mb="16">
                {data?.community}
              </Text>
              <Text fontSize="lg">{data?.communityCreatorName}</Text>
              <Box
                sx={{
                  width: '200px',
                  height: '2px',
                  bgColor: 'yellow.500',
                  my: 1,
                }}
              />
              <Text fontSize="lg">Community Leader</Text>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(
    `${apiBaseUrl}/api/evidences/evidence/credentials/${context.params.evidenceId}/${context.params.userId}`
  )
  const data = await res.json()

  return { props: { data } }
}

VolunteerCertificate.certificatePage = true

export default VolunteerCertificate
