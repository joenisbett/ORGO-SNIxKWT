import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  Select,
  Alert,
  MenuButton,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
  Stack,
  Input,
  useUpdateEffect,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as Yup from 'yup'
import Head from 'next/head'
import { IoMdAdd } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'
import {
  CustomSelectInput,
  CustomTextAreaInput,
  CustomTextInput,
} from '../../../components/CustomInput'
import getStrappiUserData from '../../../data/utils/strappiUserData'
import { useGetCommunityTasks } from '../../../data/hooks/query/useGetCommunityTasks'
import { useUserData } from '../../../data/hooks/useUserData'
import { useUploadFile } from '../../../data/hooks/mutations/useUploadFile'
import { useCreateProject } from '../../../data/hooks/mutations/useMarketplace'

export interface ProjectRequirement {
  type: 'TASK' | 'NON_TASK'
  quantity: number | undefined
  price: number | undefined
  orgoCredits?: number
  taskId?: string // for "TASK" type
  title?: string // for "NON_TASK" type
}

function NewProjectForm() {
  const strappiUserData = getStrappiUserData()
  const userData = useUserData()
  const toast = useToast()

  const [projectRequirements, setProjectRequirements] = useState<
    ProjectRequirement[]
  >([])
  const [files, setFiles] = useState([])

  const setProjectRequirementFieldValue = (
    index: number,
    fieldName: string,
    value: number | string
  ) => {
    const updatedState = projectRequirements.map(
      (projectReq, projectReqIndex) => {
        if (projectReqIndex === index) {
          projectReq[fieldName] = value
          return projectReq
        } else {
          return projectReq
        }
      }
    )

    setProjectRequirements(updatedState)
  }

  const removeProjectRequirement = (index: number) => {
    setProjectRequirements(
      projectRequirements
        .slice(0, index)
        .concat(projectRequirements.slice(index + 1))
    )
  }

  const uploadFile = useUploadFile()
  const { getRootProps, getInputProps } = useDropzone({
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

  const { data: templateTaskData, isLoading: templateLoading } =
    useGetCommunityTasks(userData?._id)

  const formik = useFormik({
    initialValues: {
      name: '',
      narrative: '',
      category: '',
      budgetNarrative: '',
      status: '',
      totalBudget: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Project name is required'),
      narrative: Yup.string().required('Project narrative is required'),
      category: Yup.string().required('Project category is required'),
      budgetNarrative: Yup.string().required('Budget narrative is required'),
      status: Yup.string().required('Status is required'),
      totalBudget: Yup.string().required('Total budget is required'),
    }),
    onSubmit: async (value) => {
      if (files.length < 1) {
        return toast({
          title: 'Error',
          description: 'Please upload an image to continue',
          status: 'error',
          duration: 8000,
          isClosable: true,
        })
      }

      const fileUrl = await uploadFile.mutateAsync(files[0])

      createProject.mutate({
        name: value.name,
        description: value.narrative,
        requirementsToComplete: projectRequirements,
        category: [value.category],
        budgetNarrative: value.budgetNarrative,
        totalBudget: value.totalBudget,
        status: value.status,
        image: fileUrl,
        createrCommunity: userData?._id,
      })
    },
  })

  const createProject = useCreateProject(() => {
    formik.resetForm()
    setFiles([])
    setProjectRequirements([])
  })

  const projectRequirementMenu = () => {
    return (
      <MenuList zIndex={50}>
        <MenuItem
          onClick={() => {
            setProjectRequirements((prevValue) => [
              ...prevValue,
              {
                type: 'TASK',
                price: undefined,
                quantity: undefined,
                taskId: '',
                title: '',
              },
            ])
          }}
        >
          Add Task
        </MenuItem>
        <MenuItem
          onClick={() => {
            setProjectRequirements((prevValue) => [
              ...prevValue,
              {
                type: 'NON_TASK',
                price: undefined,
                quantity: undefined,
                taskId: '',
                title: '',
              },
            ])
          }}
        >
          Add Non-Task
        </MenuItem>
      </MenuList>
    )
  }

  const getProjectRequirementField = (
    fieldData: ProjectRequirement,
    index: number
  ) => {
    if (fieldData.type === 'TASK') {
      return (
        <Stack direction="row" mb="2">
          <Select
            value={fieldData.taskId}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            onChange={(e) =>
              setProjectRequirementFieldValue(index, 'taskId', e.target.value)
            }
            bg="whiteAlpha.700"
            placeholder="Select a task"
          >
            {!templateLoading &&
              templateTaskData?.map((task) => (
                <option value={task._id} key={task._id}>
                  {task.name}
                </option>
              ))}
          </Select>
          <NumberInput
            bg="whiteAlpha.600"
            borderRadius="10"
            value={fieldData.quantity}
            min={1}
          >
            <NumberInputField
              placeholder="Quantity"
              onChange={(e) =>
                setProjectRequirementFieldValue(
                  index,
                  'quantity',
                  +e.target.value
                )
              }
            />
          </NumberInput>
          <NumberInput
            bg="whiteAlpha.600"
            borderRadius="10"
            value={fieldData.price}
          >
            <NumberInputField
              placeholder="Per price"
              onChange={(e) =>
                setProjectRequirementFieldValue(index, 'price', +e.target.value)
              }
            />
          </NumberInput>
          <NumberInput
            bg="whiteAlpha.600"
            borderRadius="10"
            value={fieldData.orgoCredits}
          >
            <NumberInputField
              placeholder="Orgo credits"
              onChange={(e) =>
                setProjectRequirementFieldValue(
                  index,
                  'orgoCredits',
                  +e.target.value
                )
              }
            />
          </NumberInput>
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              removeProjectRequirement(index)
            }}
          >
            <RiDeleteBinLine />
          </Box>
        </Stack>
      )
    }

    if (fieldData.type === 'NON_TASK') {
      return (
        <Stack direction="row" mb="2">
          <Input
            bg="whiteAlpha.700"
            placeholder="Add a description"
            value={fieldData.title}
            onChange={(e) =>
              setProjectRequirementFieldValue(index, 'title', e.target.value)
            }
          />
          <NumberInput
            bg="whiteAlpha.600"
            borderRadius="10"
            value={fieldData.quantity}
            min={1}
          >
            <NumberInputField
              placeholder="Quantity"
              onChange={(e) =>
                setProjectRequirementFieldValue(
                  index,
                  'quantity',
                  +e.target.value
                )
              }
            />
          </NumberInput>
          <NumberInput
            bg="whiteAlpha.600"
            borderRadius="10"
            value={fieldData.price}
          >
            <NumberInputField
              placeholder="Per price"
              onChange={(e) =>
                setProjectRequirementFieldValue(index, 'price', +e.target.value)
              }
            />
          </NumberInput>
          <NumberInput
            bg="whiteAlpha.600"
            borderRadius="10"
            value={fieldData.orgoCredits}
          >
            <NumberInputField
              placeholder="Orgo credits"
              onChange={(e) =>
                setProjectRequirementFieldValue(
                  index,
                  'orgoCredits',
                  +e.target.value
                )
              }
            />
          </NumberInput>
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              removeProjectRequirement(index)
            }}
          >
            <RiDeleteBinLine />
          </Box>
        </Stack>
      )
    }

    return ''
  }

  useUpdateEffect(() => {
    const calculatedTotalBudget = projectRequirements.reduce(
      (acc, item) => acc + (item.quantity || 1) * (item.price || 0),
      0
    )
    console.log()
    formik.setFieldValue('totalBudget', calculatedTotalBudget)
  }, [projectRequirements])

  return (
    <Box>
      <Head>
        <title>New Project</title>
      </Head>
      <Box
        bg="gray.300"
        alignItems="center"
        borderRadius="10px"
        mt="40px"
        mb="20px"
        p={{ base: '10px', sm: '15px', md: '30px' }}
        flexDirection="column"
      >
        <Text
          alignSelf="self-start"
          mb="5"
          fontSize={{ base: 'lg', lg: 'xl' }}
          fontWeight="bold"
        >
          Create Fund Raising Project
        </Text>

        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              '& > div': {
                mb: 5,
              },
            }}
          >
            <CustomTextInput
              isTouched={formik.touched.name}
              isInvalid={!!formik.errors.name}
              errorMessage={formik.errors.name}
              name="name"
              formik={formik}
              type="text"
              label="Project Name"
            />

            <CustomTextAreaInput
              isTouched={formik.touched.narrative}
              isInvalid={!!formik.errors.narrative}
              errorMessage={formik.errors.narrative}
              name="narrative"
              formik={formik}
              type="text"
              label="Project Narrative"
            />

            <FormControl my="3" mt="0">
              <FormLabel
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mr: 0,
                }}
              >
                <Text>Requirements to complete project</Text>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<IoMdAdd size={20} />}
                    aria-label="Add Field"
                    size="sm"
                    bgColor="transparent"
                    mr="-1.5"
                  />
                  {projectRequirementMenu()}
                </Menu>
              </FormLabel>

              {projectRequirements.length ? (
                projectRequirements.map((projectRequirement, index) =>
                  getProjectRequirementField(projectRequirement, index)
                )
              ) : (
                <Menu>
                  <MenuButton as={Button} width="100%">
                    <Box display="inline" mr="1">
                      +
                    </Box>{' '}
                    Add Field
                  </MenuButton>
                  {projectRequirementMenu()}
                </Menu>
              )}
            </FormControl>

            <CustomTextInput
              isTouched={formik.touched.category}
              isInvalid={!!formik.errors.category}
              errorMessage={formik.errors.category}
              name="category"
              formik={formik}
              type="text"
              label="Project Category"
            />

            <CustomTextAreaInput
              isTouched={formik.touched.budgetNarrative}
              isInvalid={!!formik.errors.budgetNarrative}
              errorMessage={formik.errors.budgetNarrative}
              name="budgetNarrative"
              formik={formik}
              type="text"
              label="Budget Narrative"
            />

            <CustomTextInput
              isTouched={formik.touched.totalBudget}
              isInvalid={!!formik.errors.totalBudget}
              errorMessage={formik.errors.totalBudget}
              name="totalBudget"
              formik={formik}
              type="text"
              label="Total Budget"
              placeholder="Add project requirements to auto generate budget"
              disabled
            />

            <CustomSelectInput
              isTouched={formik.touched.status}
              isInvalid={!!formik.errors.status}
              errorMessage={formik.errors.status}
              name="status"
              formik={formik}
              label="Status"
            >
              <option value="active">Make public (active)</option>
              <option value="inactive">Make private (inactive)</option>
            </CustomSelectInput>

            <FormLabel>Image</FormLabel>
            {files.length > 0 ? (
              <Alert mb="2">{files.length} File(s) selected</Alert>
            ) : null}
            <Box bg="gray.100" rounded="xl" boxShadow="sm">
              <div {...getRootProps({ className: 'dropzone' })}>
                <input name="image" {...getInputProps()} />
                <Box>
                  <Box
                    border="dashed"
                    py="8"
                    px="5"
                    borderRadius="md"
                    textAlign="center"
                    borderColor="gray.500"
                    cursor="pointer"
                  >
                    <p>Drag 'n' drop or files</p>
                    <p>(Max files: 1)</p>
                  </Box>
                </Box>
              </div>
            </Box>
          </Box>

          <Button
            type="submit"
            isLoading={uploadFile.isLoading || createProject.isLoading}
            colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
            my="2"
            width="full"
          >
            Create New Project
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default NewProjectForm
