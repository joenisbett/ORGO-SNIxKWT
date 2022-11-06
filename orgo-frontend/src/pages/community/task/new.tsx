import { Box, IconButton, Text, Tooltip, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { CreateTaskForm } from '../../../components/CreateTaskForm'
import GoBack from '../../../components/GoBack'
import CreateTaskSubmission, {
  FieldItem,
} from '../../../components/TaskSubmission/CreateTaskSubmission'
import { useUser } from '../../../data/hooks/useUser'
import { EventCategory, logEvent } from '../../../data/utils/analytics'
import { useCreateTask } from '../../../data/hooks/mutations/useCreateTask'
import { useUserData } from '../../../data/hooks/useUserData'
import { useCreateTaskSubmission } from '../../../data/hooks/mutations/useTaskSubmission'

function NewTask() {
  useUser({ redirectTo: '/login' })
  const userData = useUserData()
  const toast = useToast()

  const [step, setStep] = useState(1)
  const [taskData, setTaskData] = useState<any>({})
  const [formFields, setFormFields] = useState<FieldItem[]>([])
  const [enableTagging, setEnableTagging] = useState(false)

  const createTaskSubmission = useCreateTaskSubmission()

  const createTask = useCreateTask((data) => {
    const apiData = formFields

    if (enableTagging) {
      apiData.push({
        label: 'Tag volunteers',
        isRequired: false,
        type: 'tag-volunteers',
      })
    }

    createTaskSubmission.mutate({
      data: apiData,
      taskId: data?.task?._id,
      name: data?.task?.name,
    })
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      status: '',
      priority: '',
      address: '',
      hours: '',
      evidence: '',
      rewards: '',
      locationOnMap: {
        latitude: '',
        longitude: '',
      },
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
    onSubmit: (value) => {
      setStep(2)
      setTaskData(value)
    },
  })

  const handleSubmit = () => {
    logEvent(EventCategory.TASK, `Created new task`)
    const taskDescription = localStorage.getItem('content')
    if (!taskDescription) {
      toast({
        title: 'Please add task description',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      createTask.mutate({
        ...taskData,
        description: taskDescription,
        creator: userData._volunteerId,
        communityId: userData._id,
      })

      // remove the content from the local storage
      localStorage.removeItem('content')
    }
  }

  return (
    <Box>
      <Head>
        <title>Create New Task</title>
      </Head>
      {step === 1 ? (
        <>
          <GoBack />
          <Text fontSize="xl" fontWeight="bold">
            Create A New Task
          </Text>
          <CreateTaskForm formik={formik} />
        </>
      ) : (
        <>
          <Tooltip alignSelf="start" label="Go backwards">
            <IconButton
              mb="3"
              onClick={() => setStep(1)}
              icon={<IoIosArrowBack size={30} />}
              aria-label="Go back"
            />
          </Tooltip>
          <CreateTaskSubmission
            formFields={formFields}
            setFormFields={setFormFields}
            handleSubmit={handleSubmit}
            isSubmitting={
              createTask.isLoading || createTaskSubmission.isLoading
            }
            enableTagging={enableTagging}
            setEnableTagging={setEnableTagging}
          />
        </>
      )}
    </Box>
  )
}

export default NewTask
