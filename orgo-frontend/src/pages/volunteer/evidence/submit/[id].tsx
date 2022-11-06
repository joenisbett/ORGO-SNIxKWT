import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  Avatar,
  Input,
  HStack,
  FormLabel,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import * as Yup from 'yup'
// import { isBrowser, isMobile } from 'react-device-detect'
import { CloseIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useGetTaskDetails } from '../../../../data/hooks/query/useGetTaskDetails'
import { useSubmitEvidence } from '../../../../data/hooks/mutations/useSubmitEvidence'
import { useUserData } from '../../../../data/hooks/useUserData'
import { useGetUserByPartialUsername } from '../../../../data/hooks/query/useGetUserByPartialUsername'
import { useDebounce } from '../../../../data/hooks/useDebounce'
import { User } from '../../../../data/hooks/mutations/useRegister'
// import { Camera } from '../../../../components/Camera'
// import { CameraMobile } from '../../../../components/CameraMobile'
import {
  cloudinaryCloudName,
  cloudinaryUploadPreset,
} from '../../../../data/utils/constants'
import GoBack from '../../../../components/GoBack'
import { TaskCard } from '../../../../components/TaskCard'
// import { CustomTextAreaInput } from '../../../../components/CustomInput'
import { EventCategory, logEvent } from '../../../../data/utils/analytics'
import { useGetTaskSubmissionByTaskId } from '../../../../data/hooks/query/useGetTaskSubmission'
import { displayFields } from '../../../../components/TaskSubmission/DraggableFormField'
import { Field } from '../../../../components/TaskSubmission/FieldsMenu'
import getStrappiUserData from '../../../../data/utils/strappiUserData'

export interface UsersLocation {
  latitude: string
  longitude: string
}

function EvidenceSubmitPage() {
  const cameraLabelName = useRef('')
  const fileUploadLabelName = useRef('')
  const router = useRouter()
  const toast = useToast()
  const taskId = router.query.id as string
  const {
    data: TaskDetails,
    // isLoading
  } = useGetTaskDetails(taskId)
  const { mutate: submitEvidence, isLoading: submitEvidenceLoading } =
    useSubmitEvidence()

  const userData = useUserData()

  const [searchUsername, setSearchUsername] = useState('')
  const [taggedVolunteers, setTaggedVolunteers] = useState<User[]>([])

  const debouncedUsername = useDebounce(searchUsername, 500)

  const { isLoading: userSearchLoading, data: foundUsers } =
    useGetUserByPartialUsername(debouncedUsername)

  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [usersLocation, setUsersLocation] = useState<UsersLocation>(null)
  const [usersLocationError, setUsersLocationError] = useState('')
  const [isFilesUploading, setIsFilesUploading] = useState(false)
  const [enableTagging, setEnableTagging] = useState(false)
  const strappiUserData = getStrappiUserData()

  const uploadFileHandler = async (file): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinaryUploadPreset)

    return axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        formData
      )
      .then((res) => {
        return res.data.secure_url
      })
  }

  const getTaskSubmission = useGetTaskSubmissionByTaskId(taskId)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUsersLocation({
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          })
        },
        (error) => {
          setUsersLocationError(error.message)
        }
      )
    }
  }, [])

  useEffect(() => {
    if (usersLocation && usersLocation.latitude && usersLocation.longitude) {
      setUsersLocationError('')
    }
  }, [usersLocation, usersLocationError])

  useEffect(() => {
    let isEnabledTagging = false
    getTaskSubmission.data?.formTemplate?.forEach((item) => {
      if (item.type === 'tag-volunteers') {
        isEnabledTagging = true
      }
    })

    setEnableTagging(isEnabledTagging)
  }, [getTaskSubmission.data])

  const formFields = useMemo(() => {
    const initialValues = {}

    getTaskSubmission.data?.formTemplate
      ?.map((formItem) => ({ label: formItem.label, type: formItem.type }))
      ?.forEach((item) => {
        initialValues[item.label] = ''
        if (item.type === Field.CAMERA) {
          cameraLabelName.current = item.label
        }
        if (item.type === Field.FILE_UPLOAD) {
          fileUploadLabelName.current = item.label
        }
      })

    return initialValues
  }, [getTaskSubmission.data?.formTemplate])

  useUpdateEffect(() => {
    formik.setValues(formFields)
  }, [formFields])

  const formFieldsReqValidations = useMemo(() => {
    const validations = {}

    getTaskSubmission.data?.formTemplate
      ?.filter((formItem) => formItem.isRequired)
      ?.forEach((formItem2) => {
        validations[formItem2.label] = Yup.string().required('Required')
      })

    return validations
  }, [getTaskSubmission.data?.formTemplate])

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object(formFieldsReqValidations),
    enableReinitialize: true,
    onSubmit: async (values) => {
      logEvent(
        EventCategory.TASK,
        `Clicked on Submit for review button for a task`
      )

      if (usersLocation.latitude && usersLocation.longitude) {
        const clonedValues = { ...values }

        // Upload files if there exists
        const uploadedFiles = []
        if (files.length) {
          setIsFilesUploading(true)
          for (const file of files) {
            const uploadedFile = await uploadFileHandler(file)
            uploadedFiles.push(uploadedFile)
          }
          setIsFilesUploading(false)
        }

        // set images
        if (cameraLabelName.current) {
          clonedValues[cameraLabelName.current] = images
        }
        if (fileUploadLabelName.current) {
          clonedValues[fileUploadLabelName.current] = uploadedFiles
        }

        const formData: { label: string; value: string }[] = []
        for (const key in clonedValues) {
          formData.push({ label: key, value: clonedValues[key] })
        }

        // console.log('formData', formData)
        submitEvidence({
          taskId,
          latitude: usersLocation?.latitude,
          longitude: usersLocation?.longitude,
          userId: userData._id,
          templateId: getTaskSubmission.data?._id,
          formData,
          // evidenceDetails: values.evidenceDetails,
          // evidenceImages: images,
          tags: [...taggedVolunteers.map((volunteer) => volunteer._id)],
        })
      } else {
        toast({
          title: 'Please allow location permission to submit evidence',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    },
  })

  // const formik = useFormik({
  //   initialValues: {
  //     evidenceDetails: '',
  //   },
  //   validationSchema: Yup.object({
  //     evidenceDetails: Yup.string()
  //       .min(5, 'Description must be at least 5 characters long')
  //       .required('Please enter a description'),
  //   }),
  //   onSubmit: async (values) => {
  //     logEvent(
  //       EventCategory.TASK,
  //       `Clicked on Submit for review button for a task`
  //     )

  //     for (const url of urls) {
  //       await uploadFileHandler(url)
  //     }

  //     if (usersLocation.latitude && usersLocation.longitude) {
  //       submitEvidence({
  //         evidenceDetails: values.evidenceDetails,
  //         evidenceImages: images,
  //         taskId,
  //         latitude: usersLocation?.latitude,
  //         longitude: usersLocation?.longitude,
  //         userId: userData._id,
  //         tags: [...taggedVolunteers.map((volunteer) => volunteer._id)],
  //       })
  //     } else {
  //       toast({
  //         title: 'Please allow location permission to submit evidence',
  //         status: 'error',
  //         duration: 5000,
  //         isClosable: true,
  //       })
  //     }
  //   },
  // })

  return (
    <Box>
      <Head>
        <title>Submit Evidence</title>
      </Head>
      <GoBack />
      {usersLocationError && (
        <Alert my="6" status="error">
          <AlertIcon />
          <AlertTitle>{usersLocationError}</AlertTitle>
          <AlertDescription>Please allow location permission</AlertDescription>
        </Alert>
      )}
      <TaskCard
        creatorUsername={TaskDetails?.creator.name}
        creatorCommunityName={TaskDetails?.creatorCommunityName}
        id={TaskDetails?._id}
        location={TaskDetails?.address}
        priority={TaskDetails?.priority}
        rewards={TaskDetails?.rewards}
        title={TaskDetails?.name}
        status={TaskDetails?.status}
        showStatus={false}
        showDetails={false}
      />
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'gray.200',
          borderRadius: 'md',
          p: 4,
        }}
      >
        <Text mt="1" fontSize="xl" fontWeight="bold">
          Submission Requirements
        </Text>
        <Text>{TaskDetails?.evidence}</Text>

        {/* <Skeleton isLoaded={!isLoading}>
        <Text mt="6">Picture Evidence</Text>
        {isBrowser ? (
          <Camera
            images={images}
            setImages={setImages}
            urls={urls}
            setUrls={setUrls}
          />
        ) : null}

        {isMobile ? (
          <CameraMobile
            images={images}
            setImages={setImages}
            urls={urls}
            setUrls={setUrls}
          />
        ) : null}
        <form onSubmit={formik.handleSubmit}>
          <Box>
            <CustomTextAreaInput
              isTouched={formik.touched.evidenceDetails}
              isInvalid={!!formik.errors.evidenceDetails}
              errorMessage={formik.errors.evidenceDetails}
              name="evidenceDetails"
              formik={formik}
              placeholder="Evidence description"
              label="Task Evidence"
            />
          </Box>

          <Box my="4">
            <Button
              colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
              isLoading={submitEvidenceLoading}
              type="submit"
            >
              Submit for review
            </Button>
          </Box>
        </form>
      </Skeleton> */}

        <Skeleton isLoaded={!getTaskSubmission.isLoading} mt="5">
          {enableTagging && (
            <Box my="4">
              <FormLabel htmlFor="tags">Who else worked on this?</FormLabel>
              <Input
                id="tags"
                name="tags"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                variant="filled"
                placeholder="tag who helped and split the rewards"
              />
              {userSearchLoading && <Skeleton my="2" p="4" height="20px" />}
              {!userSearchLoading && debouncedUsername && (
                <Box>
                  {foundUsers && foundUsers.length === 0 && (
                    <Text color="gray.500">
                      Sorry we can’t find any user with ‘{debouncedUsername}’ as
                      username
                    </Text>
                  )}
                  {foundUsers &&
                    foundUsers.length > 0 &&
                    foundUsers.map((user) => (
                      <UserCard
                        onAdd={() => {
                          setTaggedVolunteers((prev) => [...prev, user])
                        }}
                        username={user.username}
                        avatar={user.avatar}
                        key={user._id}
                      />
                    ))}
                </Box>
              )}
              <Box my="6">
                <Text>Tagged Volunteers</Text>
                {taggedVolunteers.length === 0 && (
                  <Text mx="4" color="gray.400">
                    No volunteers tagged
                  </Text>
                )}
                <HStack spacing={2} my="4">
                  {taggedVolunteers.map((user) => {
                    return (
                      <Box key={user._id}>
                        <Avatar
                          size="lg"
                          name={user.username}
                          src={user.avatar}
                          position="relative"
                        />
                        <CloseIcon
                          mx="2"
                          cursor="pointer"
                          onClick={() => {
                            setTaggedVolunteers((prev) =>
                              prev.filter((u) => u._id !== user._id)
                            )
                          }}
                        />
                      </Box>
                    )
                  })}
                </HStack>
              </Box>
            </Box>
          )}

          <form onSubmit={formik.handleSubmit}>
            {!getTaskSubmission.isFetching &&
              getTaskSubmission.data?.formTemplate?.map((fieldItem, index) => (
                <Fragment key={fieldItem.label + index}>
                  {displayFields(
                    fieldItem,
                    index,
                    false,
                    {
                      formik,
                      isTouched: formik.touched[fieldItem.label],
                      isInvalid: !!formik.errors[fieldItem.label],
                      errorMessage: formik.errors[fieldItem.label],
                    },
                    {
                      images,
                      setImages,
                      urls,
                      setUrls,
                    },
                    { files, setFiles }
                  )}
                </Fragment>
              ))}
            {!getTaskSubmission.isFetching &&
            getTaskSubmission.data?.formTemplate?.length ? (
              <Box my="4">
                <Button
                  colorScheme={
                    strappiUserData.attributes?.brand_color || 'blue'
                  }
                  isLoading={submitEvidenceLoading || isFilesUploading}
                  type="submit"
                >
                  Submit for review
                </Button>
              </Box>
            ) : null}
          </form>
        </Skeleton>
      </Box>
    </Box>
  )
}

export interface UserCardProps {
  username: string
  onAdd: () => void
  avatar: string
}

export const UserCard: React.FC<UserCardProps> = ({
  username,
  onAdd,
  avatar,
}) => {
  return (
    <Flex
      alignItems="center"
      bg="gray.300"
      borderRadius="5px"
      p="4"
      my="2"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <Avatar name={username} src={avatar} />
        <Text ml="4">{username}</Text>
      </Flex>
      <Button onClick={onAdd}>add</Button>
    </Flex>
  )
}

export default EvidenceSubmitPage
