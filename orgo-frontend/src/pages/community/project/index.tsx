import {
  Box,
  Grid,
  GridItem,
  Image,
  Skeleton,
  Text,
  useMediaQuery,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useGetAllProjects } from '../../../data/hooks/query/useMarketplaceQuery'

const ProjectList = () => {
  const router = useRouter()
  const [isSmallerThan400] = useMediaQuery('(max-width: 400px)')

  const getAllProjects = useGetAllProjects()

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <Box>
        <Text fontSize="2xl" mb="5" fontWeight="bold">
          Projects
        </Text>
        <Grid
          templateColumns={`repeat(${isSmallerThan400 ? '1' : '2'}, 1fr)`}
          gap={4}
        >
          {getAllProjects.isLoading ? (
            <>
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} isLoaded={false} />
              ))}
            </>
          ) : (
            getAllProjects.data?.map((project) => (
              <>
                {project.status === 'active' ? (
                  <GridItem
                    key={project._id}
                    w="100%"
                    bg="gray.100"
                    borderRadius="sm"
                    cursor="pointer"
                    onClick={() =>
                      router.push(`/community/project/${project._id}`)
                    }
                  >
                    <Image
                      src={project.image}
                      alt={project.name}
                      height="36"
                      width="full"
                      objectFit="cover"
                    />
                    <Box p="3">
                      <Text fontSize="lg" fontWeight="bold">
                        {project.name}
                      </Text>
                      <Text>$ {project.totalBudget}</Text>
                    </Box>
                  </GridItem>
                ) : (
                  <></>
                )}
              </>
            ))
          )}
        </Grid>
      </Box>
    </>
  )
}

export default ProjectList
