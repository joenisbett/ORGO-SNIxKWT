import {
  Box,
  Button,
  IconButton,
  Image,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MdOutlineEdit } from 'react-icons/md'
import { RiDeleteBinLine } from 'react-icons/ri'
import GoBack from '../../../components/GoBack'
import { useAddToCart } from '../../../data/hooks/mutations/useCart'
import { useDeleteProject } from '../../../data/hooks/mutations/useMarketplace'
import { useGetProjectById } from '../../../data/hooks/query/useMarketplaceQuery'
import { useUserData } from '../../../data/hooks/useUserData'
import getStrappiUserData from '../../../data/utils/strappiUserData'

const ProjectList = () => {
  const router = useRouter()
  const userData = useUserData()
  const strappiUserData = getStrappiUserData()

  const getProjectById = useGetProjectById(router.query?.id as string)
  const deleteProject = useDeleteProject()
  const addToCart = useAddToCart()

  if (getProjectById.isLoading) {
    return <Skeleton />
  }

  return (
    <>
      <Head>
        <title>{getProjectById.data?.name}</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <GoBack />
        {userData?._id === getProjectById.data?.createrCommunity ? (
          <Box>
            <Tooltip alignSelf="start" label="Edit Project">
              <IconButton
                mb="3"
                mr="3"
                onClick={() =>
                  router.push(`/community/project/edit/${router.query?.id}`)
                }
                icon={<MdOutlineEdit size={25} />}
                aria-label="Edit Project"
              />
            </Tooltip>
            <Tooltip alignSelf="start" label="Delete Project">
              <IconButton
                mb="3"
                onClick={() => {
                  deleteProject.mutate(router.query?.id as string)
                }}
                icon={<RiDeleteBinLine size={25} />}
                aria-label="Delete Project"
              />
            </Tooltip>
          </Box>
        ) : null}
      </Box>
      <Box>
        <Image
          src={getProjectById.data?.image}
          alt={getProjectById.data?.name}
          height="64"
          width="full"
          objectFit="cover"
          mb="3"
        />
        <Text fontSize="xl" fontWeight="bold" mb="3">
          {getProjectById.data?.name}
        </Text>
        <Text mt="1">
          Total Budget : $ {getProjectById.data?.totalBudget} &nbsp;
          {/* | &nbsp; By John Doe */}
        </Text>
        {/* <Text mt="1">Deadline : 15 days left</Text> */}
        <Text mt="1">
          Category :{' '}
          {getProjectById.data?.category?.length
            ? getProjectById.data?.category?.[0]
            : 'None'}
        </Text>

        <Box my="4">
          <Text mb="1" fontWeight="bold">
            Why we doing this?
          </Text>
          <Text>{getProjectById.data?.description}</Text>
        </Box>

        <Box mt="4" mb="6">
          <Text mb="1" fontWeight="bold">
            What are the requirements?
          </Text>

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th isNumeric>Quantity</Th>
                  <Th isNumeric>Price</Th>
                  <Th isNumeric>Orgo Credits</Th>
                </Tr>
              </Thead>
              <Tbody>
                {getProjectById.data?.requirementsToComplete.map((item) => (
                  <Tr key={item._id}>
                    <Td>{item.title || item.taskId?.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>$ {item.price}</Td>
                    <Td isNumeric>{item.orgoCredits}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Box my="4">
          <Text mb="1" fontWeight="bold">
            Budget Narration
          </Text>
          <Text>{getProjectById.data?.budgetNarrative}</Text>
        </Box>

        <Button
          colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
          my="2"
          width="full"
          onClick={async () => {
            await addToCart.mutateAsync({
              userId: userData?._id,
              projectId: router.query?.id as string,
            })
            router.push('/cart')
          }}
          isLoading={addToCart.isLoading}
        >
          Add to cart
        </Button>
      </Box>
    </>
  )
}

export default ProjectList
