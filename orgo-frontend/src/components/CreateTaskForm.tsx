import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useGetCommunityTasks } from '../data/hooks/query/useGetCommunityTasks'
import { useUserData } from '../data/hooks/useUserData'
import getStrappiUserData from '../data/utils/strappiUserData'
import {
  CustomMapInput,
  CustomSelectInput,
  CustomTextAreaInput,
  CustomTextInput,
} from './CustomInput'
import MapModal from './Map/MapModal'
import { RichTextEditor } from './RichTextEditor'

export const CreateTaskForm = ({ formik }: { formik: any }) => {
  const userData = useUserData()
  const strappiUserData = getStrappiUserData()
  const { data: templateTaskData, isLoading: templateLoading } =
    useGetCommunityTasks(userData?._id)

  const [templateTaskId, setTemplateTaskId] = useState()
  const [address, setAddress] = useState<string | null>(null)

  const {
    isOpen: isMapModalOpen,
    onOpen: onMapModalOpen,
    onClose: onMapModalClose,
  } = useDisclosure()

  const selectedTemplateTaskData = useMemo(() => {
    if (templateTaskData && templateTaskId) {
      return templateTaskData.find((task) => task._id === templateTaskId)
    }
    return null
  }, [templateTaskData, templateTaskId])

  const parsedTaskDescription = useMemo(() => {
    try {
      return JSON.parse(selectedTemplateTaskData?.description)
    } catch (error) {
      // We've the normal text data so now we can parse it as follows
      return [
        {
          type: 'paragraph',
          children: [
            {
              text: selectedTemplateTaskData?.description || '',
            },
          ],
        },
      ]
    }
  }, [selectedTemplateTaskData?.description])

  useEffect(() => {
    if (selectedTemplateTaskData) {
      formik.setValues(selectedTemplateTaskData)
      setAddress(selectedTemplateTaskData.address)
    }
  }, [selectedTemplateTaskData])

  return (
    <Box my="3" bg="gray.200" borderRadius="5px" p="4">
      <form>
        <FormControl my="3" mt="0">
          <FormLabel htmlFor="template">Select a template</FormLabel>
          <Select
            id="template"
            value={templateTaskId}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            onChange={(e) => setTemplateTaskId(e.target.value)}
            bg="whiteAlpha.600"
            placeholder="Use previous task as template"
          >
            {!templateLoading &&
              templateTaskData?.map((task) => (
                <option value={task._id} key={task._id}>
                  {task.name}
                </option>
              ))}
          </Select>
          <FormHelperText>Use previous tasks as starter</FormHelperText>
        </FormControl>
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
          value={address || ''}
        />

        <Text mt="4" mb="2">
          Task Description
        </Text>
        <Box
          mb="6"
          backgroundColor="gray.100"
          borderRadius="md"
          px="4"
          pt="2"
          pb="4"
        >
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
          } Points or $50 giftcard`}
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

        {/* <Button isLoading={isLoading} type="submit">
          Create Task
        </Button> */}
        <Button
          onClick={() => {
            formik.handleSubmit()
          }}
        >
          Next : Customize Submission
        </Button>
      </form>
      <MapModal
        isOpen={isMapModalOpen}
        onClose={onMapModalClose}
        data={{ locationOnMap: selectedTemplateTaskData?.locationOnMap }}
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
