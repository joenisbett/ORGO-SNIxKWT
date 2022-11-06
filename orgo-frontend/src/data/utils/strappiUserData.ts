import { isServer } from './isServer'

interface StrappiUserData {
  id: number
  attributes: Attributes2
}

interface Attributes2 {
  brand_name: string
  about_us: string
  type: string
  brand_color: string
  owner: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  logo: Logo
  communityId: string
}

interface Logo {
  data: Data
}

interface Data {
  id: number
  attributes: Attributes
}

interface Attributes {
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  formats: Formats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: any
  provider: string
  provider_metadata?: any
  createdAt: string
  updatedAt: string
}

interface Formats {
  thumbnail: Thumbnail
}

interface Thumbnail {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path?: any
  size: number
  width: number
  height: number
}

const getStrappiUserData = (): StrappiUserData => {
  if (!isServer) {
    return JSON.parse(localStorage.getItem('strappiUser')) || {}
  }
}

export default getStrappiUserData
