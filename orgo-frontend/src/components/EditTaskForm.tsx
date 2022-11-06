import {
  Box,
  Button,
  useToast,
  Text,
  useDisclosure,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import * as Yup from 'yup'
import { useEditTask } from '../data/hooks/mutations/useEditTask'
import { useGetTaskDetails } from '../data/hooks/query/useGetTaskDetails'
import { EventCategory, logEvent } from '../data/utils/analytics'
import getStrappiUserData from '../data/utils/strappiUserData'
import {
  CustomMapInput,
  CustomSelectInput,
  CustomTextAreaInput,
  CustomTextInput,
} from './CustomInput'
import MapModal from './Map/MapModal'
import { RichTextEditor } from './RichTextEditor'

export const EditTaskForm = ({ taskId }: { taskId: string }) => {
  const { isLoading: taskEditLoading, mutate: editTask } = useEditTask()
  const { data: initialTaskData } = useGetTaskDetails(taskId)
  const strappiUserData = getStrappiUserData()

  const [address, setAddress] = useState<string | null>(null)

  const {
    isOpen: isMapModalOpen,
    onOpen: onMapModalOpen,
    onClose: onMapModalClose,
  } = useDisclosure()

  const toast = useToast()
  const formik = useFormik({
    initialValues: {
      name: initialTaskData?.name,
      status: initialTaskData?.status,
      priority: initialTaskData?.priority,
      address: initialTaskData?.address,
      hours: initialTaskData?.hours,
      evidence: initialTaskData?.evidence,
      rewards: initialTaskData?.rewards,
      locationOnMap: initialTaskData?.locationOnMap,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'task name must be at least 3 characters long')
        .required('Please enter a task name.'),
      address: Yup.string().required('Please enter a location'),
      hours: Yup.string().required('Please enter an estimated time.'),
      evidence: Yup.string().required(
        'Please enter the submission requirements.'
      ),
      status: Yup.string().required('Please set the status.'),
      priority: Yup.string().required('Please set a priority level'),
      rewards: Yup.string().required('Please enter rewards offered'),
    }),
    onSubmit: (values) => {
      logEvent(EventCategory.TASK, `Edited a task`)

      const taskDescription = localStorage.getItem('content')
      if (!taskDescription && !initialTaskData?.description) {
        toast({
          title: 'Please add task description',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } else {
        editTask({
          ...values,
          taskId,
          description: taskDescription || initialTaskData?.description,
        })
        // remove the content from local storage
        localStorage.removeItem('content')
      }
    },
  })

  const parsedTaskDescription = useMemo(() => {
    try {
      return JSON.parse(initialTaskData?.description)
    } catch (error) {
      // We've the normal text data so now we can parse it as follows
      return [
        {
          type: 'paragraph',
          children: [
            {
              text: initialTaskData?.description || '',
            },
          ],
        },
      ]
    }
  }, [initialTaskData?.description])

  useUpdateEffect(() => {
    formik.setFieldValue('name', initialTaskData?.name)
    formik.setFieldValue('status', initialTaskData?.status)
    formik.setFieldValue('priority', initialTaskData?.priority)
    formik.setFieldValue('address', initialTaskData?.address)
    formik.setFieldValue('hours', initialTaskData?.hours)
    formik.setFieldValue('evidence', initialTaskData?.evidence)
    formik.setFieldValue('rewards', initialTaskData?.rewards)
    formik.setFieldValue('locationOnMap', initialTaskData?.locationOnMap)
  }, [initialTaskData])

  return (
    <Box my="5" bg="gray.200" borderRadius="5px" p="4">
      <form onSubmit={formik.handleSubmit}>
        <CustomTextInput
          isTouched={formik.touched.name}
          isInvalid={!!formik.errors.name}
          errorMessage={formik.errors.name}
          name="name"
          formik={formik}
          label="Task Name"
        />

        <CustomMapInput
          isTouched={formik.touched.address}
          isInvalid={!!formik.errors.address}
          errorMessage={formik.errors.address}
          name="address"
          formik={formik}
          label="Location"
          placeholder="Select location..."
          handleClick={onMapModalOpen}
          value={address ? address : initialTaskData?.address || ''}
        />

        <Text mt="4" mb="2">
          Task Description
        </Text>
        <Box mb="6" backgroundColor="gray.100" borderRadius="md" px="4" pb="4">
          <RichTextEditor
            initialData={parsedTaskDescription}
            placeholder="Example: We’re planting trees at the memorial. Please bring gloves!"
          />
        </Box>

        {/* <CustomTextAreaInput
          isTouched={formik.touched.description}
          isInvalid={!!formik.errors.description}
          errorMessage={formik.errors.description}
          name="description"
          formik={formik}
          label="Description"
          placeholder="Example: We’re planting trees at the memorial. Please bring gloves!"
        /> */}

        <CustomSelectInput
          isTouched={formik.touched.hours}
          isInvalid={!!formik.errors.hours}
          errorMessage={formik.errors.hours}
          name="hours"
          formik={formik}
          label="Estimated time"
        >
          <option value="5 minutes">5 minutes</option>
          <option value="15 minutes">15 minutes</option>
          <option value="30 minutes">30 minutes</option>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
          <option value="3 hours">3 hours</option>
          <option value="3+ hours">3+ hours</option>
        </CustomSelectInput>

        <CustomTextAreaInput
          isTouched={formik.touched.evidence}
          isInvalid={!!formik.errors.evidence}
          errorMessage={formik.errors.evidence}
          name="evidence"
          formik={formik}
          placeholder="Example: Take before and after pictures from a height of 5 feet"
          label="Submission requirements"
        />

        <CustomTextAreaInput
          isTouched={formik.touched.rewards}
          isInvalid={!!formik.errors.rewards}
          errorMessage={formik.errors.rewards}
          name="rewards"
          formik={formik}
          label="Rewards Offered"
          placeholder={`Example: 10 ${
            strappiUserData.attributes?.brand_name || ''
          } Earth Points or $50 giftcard`}
        />

        <CustomSelectInput
          isTouched={formik.touched.priority}
          isInvalid={!!formik.errors.priority}
          errorMessage={formik.errors.priority}
          name="priority"
          formik={formik}
          label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </CustomSelectInput>

        <CustomSelectInput
          isTouched={formik.touched.status}
          isInvalid={!!formik.errors.status}
          errorMessage={formik.errors.status}
          name="status"
          formik={formik}
          label="Status"
        >
          <option value="active">Make public (active)</option>
          <option value="inactive">Hide from volunteers (inactive)</option>
        </CustomSelectInput>

        <Button isLoading={taskEditLoading} type="submit">
          Edit Task
        </Button>
      </form>

      <MapModal
        isOpen={isMapModalOpen}
        onClose={onMapModalClose}
        data={{ locationOnMap: initialTaskData?.locationOnMap }}
        isLoading={false}
        handleConfirm={({ location, locationOnMap }) => {
          setAddress(location)
          formik.setFieldValue('address', location)
          formik.setFieldValue('locationOnMap', locationOnMap)

          onMapModalClose()
        }}
      />
    </Box>
  )
}
