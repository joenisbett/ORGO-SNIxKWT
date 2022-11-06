import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface AddToCartParams {
  userId: string
  projectId: string
}

function addToCart(data: AddToCartParams): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(`${apiBaseUrl}/api/carts/create`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
}

function deleteFromCart(data: AddToCartParams): Promise<any> {
  const token = JSON.parse(localStorage.getItem('userData')).token

  return axios
    .post(
      `${apiBaseUrl}/api/carts/delete/${data.userId}/${data.projectId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => res.data)
}

export function useAddToCart() {
  const toast = useToast()

  return useMutation(addToCart, {
    onSuccess: () => {
      toast({
        title: 'Project added to cart successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to add project to cart',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}

export function useDeleteFromCart() {
  const toast = useToast()

  return useMutation(deleteFromCart, {
    onSuccess: () => {
      toast({
        title: 'Project removed from cart successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast({
        title: 'Failed to remove project from cart',
        description: error.response?.data?.message,
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    },
  })
}
