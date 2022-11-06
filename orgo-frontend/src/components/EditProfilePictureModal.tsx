import {
  Avatar,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Alert,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useEditProfile } from '../data/hooks/mutations/useEditProfile'
import { User } from '../data/hooks/mutations/useRegister'
import { useUploadFile } from '../data/hooks/mutations/useUploadFile'
import getStrappiUserData from '../data/utils/strappiUserData'

export interface EditProfilePictureProps {
  isOpen: boolean
  onClose: () => void
  userData: User
}

export const EditProfilePictureModal: React.FC<EditProfilePictureProps> = ({
  isOpen,
  onClose,
  userData,
}) => {
  const strappiUserData = getStrappiUserData()

  const [files, setFiles] = useState([])

  const { acceptedFiles, getRootProps, getInputProps, fileRejections } =
    useDropzone({
      // accept: { 'image/*': [] },
      maxFiles: 1,
      // 5mb
      maxSize: 1024 * 1024 * 5,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        )
      },
    })

  const { data, isLoading, mutate: uploadProfilePicture } = useUploadFile(true)

  const { mutate: updateProfileModal, isLoading: updateProfileModalLoading } =
    useEditProfile()

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent>
        <ModalHeader>Edit Profile Picture</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
          mt={-5}
        >
          {fileRejections.length > 0 && (
            <Alert>Please upload a valid image file</Alert>
          )}
          <Avatar
            mt="4"
            size="2xl"
            name={userData.name}
            alignSelf="center"
            src={files[0]?.preview || data}
            border="4px solid whitesmoke"
            shadow="lg"
          />
          <Box bg="gray.200" rounded="xl" p="4" mt={4} boxShadow="lg">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input name="image" {...getInputProps()} />
              <Box p="4">
                {acceptedFiles.length > 0 ? (
                  <Alert>
                    Your new Profile is in preview mode! Click on update to make
                    it your new profile or select new one
                  </Alert>
                ) : null}

                <Box border="dashed" p="4" mt={4}>
                  Drag 'n' drop Image your profile picture, or click to select
                  files
                </Box>
              </Box>
            </div>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
            mr={3}
            onClick={() =>
              uploadProfilePicture(acceptedFiles[0], {
                onSuccess: (value) => {
                  updateProfileModal({ avatar: value })
                  onClose()
                },
              })
            }
            isLoading={isLoading || updateProfileModalLoading}
          >
            Update
          </Button>
          <Button onClick={onClose} variant="ghost">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
