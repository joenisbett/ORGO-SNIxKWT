import {
  Box,
  Button,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { BsArrowLeft } from 'react-icons/bs'
import getStrappiUserData from '../data/utils/strappiUserData'
import { BiX } from 'react-icons/bi'
import { useGetCartItems } from '../data/hooks/query/useGetCart'
import { useUserData } from '../data/hooks/useUserData'
import { useDeleteFromCart } from '../data/hooks/mutations/useCart'

function Cart() {
  const router = useRouter()
  const strappiUserData = getStrappiUserData()
  const userData = useUserData()

  const getCartItems = useGetCartItems(userData?._id)
  const deleteFromCart = useDeleteFromCart()

  return (
    <>
      <Head>
        <title>My Cart</title>
      </Head>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: '6',
        }}
      >
        <IconButton
          aria-label="Back"
          icon={<BsArrowLeft style={{ fontSize: '20px' }} />}
          variant="solid"
          size="sm"
          onClick={() => router.back()}
        />
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          flex={1}
          ml="-8"
        >
          My Cart
        </Text>
      </Box>

      <Box
        sx={{
          height: '60vh',
          mb: 6,
          overflowY: 'auto',
        }}
      >
        {!getCartItems.isLoading ? (
          getCartItems.data?.cart?.length ? (
            getCartItems.data?.cart?.map((item) => (
              <Box
                key={item._id}
                bgColor="gray.100"
                mb="4"
                sx={{
                  display: 'flex',
                  position: 'relative',
                }}
              >
                <Image
                  src={item.projectId?.image}
                  alt={item.projectId?.name}
                  height="32"
                  width="40%"
                  objectFit="cover"
                />
                <Box p="3">
                  <Text fontSize="lg" fontWeight="bold">
                    {item.projectId?.name}
                  </Text>
                  <Text mt="1">$ {item.projectId?.totalBudget}</Text>
                  {/* <Text>By John Doe</Text> */}
                </Box>

                <IconButton
                  position="absolute"
                  right={0}
                  size="sm"
                  mt="1"
                  mr="1"
                  aria-label="Delete"
                  icon={<BiX style={{ fontSize: '20px' }} />}
                  onClick={async () => {
                    await deleteFromCart.mutateAsync({
                      userId: userData?._id,
                      projectId: item.projectId._id,
                    })
                    getCartItems.refetch()
                  }}
                />
              </Box>
            ))
          ) : (
            <Text align="center" mt="10" fontSize="lg">
              You cart is empty
            </Text>
          )
        ) : (
          <Stack>
            <Skeleton height="130px" />
            <Skeleton height="130px" />
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          bgColor: 'gray.100',
          py: 4,
          px: 6,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text fontSize="lg">Total</Text>
          <Text fontSize="lg">
            ${' '}
            {getCartItems.data?.cart?.reduce(
              (acc, item) => acc + +item.projectId?.totalBudget,
              0
            ) || 0}
          </Text>
        </Box>
        <Button
          colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
          my="2"
          width="full"
          onClick={() => router.push('/waiting-list')}
          disabled={!getCartItems.data?.cart?.length}
        >
          Checkout
        </Button>
      </Box>
    </>
  )
}

export default Cart
