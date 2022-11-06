import { useEffect } from 'react'
import { Box, IconButton, Skeleton, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AiOutlineCompass } from 'react-icons/ai'
import LeaderboardUser from '../components/LeaderboardUser'
import { useGetLeaderboardData } from '../data/hooks/query/useGetAllUsers'

function Leaderboard() {
  const router = useRouter()

  const getLeaderboardData = useGetLeaderboardData()

  useEffect(() => {
    window.document.body.style.overflow = 'none'
  }, [])

  return (
    <Box
      sx={{
        pr: '4',
        pl: '1',
      }}
    >
      <Head>
        <title>Leaderboard</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '6',
        }}
      >
        <Text fontSize="2xl">Leaderboard</Text>
        <IconButton
          aria-label="Explore"
          icon={<AiOutlineCompass style={{ fontSize: '20px' }} />}
          variant="solid"
          size="sm"
          onClick={() => router.push('/explore')}
        />
      </Box>
      <Skeleton isLoaded={!getLeaderboardData.isLoading} minH="72">
        {getLeaderboardData.data ? (
          <Box
            sx={{
              overflow: 'auto',
              height: 'calc(100vh - 215px)',
            }}
          >
            {getLeaderboardData.data?.users?.map((user, index) => (
              <LeaderboardUser
                key={user._id}
                ranking={index + 1}
                points={user.points}
                avatar={user.avatar}
                name={user.username}
              />
            ))}
          </Box>
        ) : (
          <Text mt="5">No Data found</Text>
        )}
      </Skeleton>
    </Box>
  )
}

export default Leaderboard
