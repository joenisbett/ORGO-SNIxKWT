import { useDisclosure } from '@chakra-ui/react'
import GoogleMapReact from 'google-map-react'
import { useEffect, useState } from 'react'
import { EventCategory, logEvent } from '../../data/utils/analytics'
import LocationPin from './LocationPin'
import LocationPinModal from './LocationPinModal'

interface MapViewProps {
  location:
    | {
        _id: string
        name?: string
        city?: string
        logo?: string
        locationOnMap?: {
          latitude?: string
          longitude?: string
        }
      }[]
    | []
  zoomLevel: number
  isEditable?: boolean
}

interface EditableMapViewProps {
  location: {
    lat: number
    lng: number
  } | null
  zoomLevel: number
  handleClick: (e: any) => void
}

const defaultCenterValue = { lat: 37.42216, lng: -122.08427 }

export const MapView = ({ location = [], zoomLevel }: MapViewProps) => {
  const [userCurrentLocation, setUserCurrentLocation] = useState({
    lat: '',
    lng: '',
  })
  const [currentCommunityDetails, setCurrentCommunityDetails] = useState({
    _id: '',
    name: '',
    city: '',
    logo: '',
  })

  const {
    isOpen: isLocationPinModalOpen,
    onOpen: onLocationPinModalOpen,
    onClose: onLocationPinModalClose,
  } = useDisclosure()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserCurrentLocation({
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
        })
      })
    }
  }, [])

  const filteredLocation = location.filter(
    (item: any) =>
      item?.locationOnMap?.latitude && item?.locationOnMap?.longitude
  )

  return (
    <>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
        defaultCenter={defaultCenterValue}
        center={
          userCurrentLocation.lat && userCurrentLocation.lng
            ? { lat: +userCurrentLocation.lat, lng: +userCurrentLocation.lng }
            : filteredLocation.length
            ? {
                lat: +filteredLocation[0]?.locationOnMap?.latitude,
                lng: +filteredLocation[0]?.locationOnMap?.longitude,
              }
            : defaultCenterValue
        }
        defaultZoom={zoomLevel}
        options={{
          fullscreenControl: false,
        }}
      >
        {filteredLocation.length
          ? filteredLocation.map((loc) => (
              <LocationPin
                key={loc._id}
                lat={+loc?.locationOnMap?.latitude}
                lng={+loc?.locationOnMap?.longitude}
                onClick={() => {
                  logEvent(
                    EventCategory.MAP,
                    `Clicked on location marker of community`
                  )
                  onLocationPinModalOpen()
                  setCurrentCommunityDetails({
                    _id: loc._id,
                    name: loc.name || '',
                    city: loc.city || '',
                    logo: loc.logo || '',
                  })
                }}
              />
            ))
          : null}
      </GoogleMapReact>
      <LocationPinModal
        isOpen={isLocationPinModalOpen}
        onClose={onLocationPinModalClose}
        name={currentCommunityDetails?.name}
        city={currentCommunityDetails?.city}
        logo={currentCommunityDetails?.logo}
      />
    </>
  )
}

export const EditableMapView = ({
  zoomLevel,
  handleClick,
  location,
}: EditableMapViewProps) => {
  const [userCurrentLocation, setUserCurrentLocation] = useState({
    lat: '',
    lng: '',
  })

  useEffect(() => {
    if (navigator.geolocation && !location.lat && !location.lng) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserCurrentLocation({
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
        })
      })
    }
  }, [location.lat, location.lng])

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }}
      defaultCenter={defaultCenterValue}
      center={
        userCurrentLocation.lat && userCurrentLocation.lng
          ? { lat: +userCurrentLocation.lat, lng: +userCurrentLocation.lng }
          : location.lat && location.lng
          ? { lat: +location.lat, lng: +location.lng }
          : defaultCenterValue
      }
      defaultZoom={zoomLevel}
      options={{
        fullscreenControl: false,
      }}
      onClick={handleClick}
    >
      {location.lat && location.lng ? (
        <LocationPin
          key={location.lat + location.lng}
          lat={location.lat}
          lng={location.lng}
        />
      ) : null}
    </GoogleMapReact>
  )
}
