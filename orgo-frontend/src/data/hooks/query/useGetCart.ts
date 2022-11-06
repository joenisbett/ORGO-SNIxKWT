import axios from 'axios'
import { useQuery } from 'react-query'
import { apiBaseUrl } from '../../utils/constants'

interface UserCart {
  _id: string
  userId: string
  cart: Cart[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface Cart {
  _id: string
  projectId: ProjectId
}

interface ProjectId {
  category: any[]
  status: string
  inactive: boolean
  _id: string
  name: string
  description: string
  requirementsToComplete: RequirementsToComplete[]
  totalBudget: string
  image: string
  createrCommunity: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface RequirementsToComplete {
  type: string
  _id: string
  price: number
  quantity: number
  taskId: string
  title: string
  orgoCredits: number
  createdAt: string
  updatedAt: string
}

function getCartItems(userId: string): Promise<UserCart> {
  return axios
    .get(`${apiBaseUrl}/api/carts/get/${userId}`)
    .then((res) => res.data)
}

export function useGetCartItems(userId: string) {
  return useQuery(['cart', 'all-items'], () => {
    return getCartItems(userId)
  })
}
