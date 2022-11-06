import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import GoBack from '../../components/GoBack'
import { RichTextEditor } from '../../components/RichTextEditor'
import { TaskCard } from '../../components/TaskCard'
import { useGetTaskDetails } from '../../data/hooks/query/useGetTaskDetails'
import { useIsCommunity } from '../../data/hooks/useIsCommunity'
import { useUserData } from '../../data/hooks/useUserData'
import { EventCategory, logEvent } from '../../data/utils/analytics'
import getStrappiUserData from '../../data/utils/strappiUserData'

const TaskDetail = () => {
  const router = useRouter()
  const taskId = router.query.id as string
  const { data: TaskDetails, isLoading } = useGetTaskDetails(taskId)
  const isCommunity = useIsCommunity()
  const strappiUserData = getStrappiUserData()
  const userData = useUserData()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleStartTask = () => {
    logEvent(EventCategory.TASK, `Clicked on Start this task button`)
    if (userData.type === 'volunteer') {
      router.push(`/volunteer/evidence/submit/${taskId}`)
    } else {
      // also open up a modal that suggests user to go to register page
      onOpen()
    }
  }

  const parsedTaskDescription = useMemo(() => {
    try {
      return JSON.parse(TaskDetails?.description)
    } catch (error) {
      // We've the normal text data so now we can parse it as follows
      return [
        {
          type: 'paragraph',
          children: [
            {
              text: TaskDetails?.description || '',
            },
          ],
        },
      ]
    }
  }, [TaskDetails?.description])

  return (
    <Box>
      <Head>
        <title>Task Details</title>
      </Head>
      <GoBack />
      <Skeleton isLoaded={!isLoading}>
        <TaskCard
          creatorUsername={TaskDetails?.creator.name}
          creatorCommunityName={TaskDetails?.creatorCommunityName}
          id={TaskDetails?._id}
          location={TaskDetails?.address}
          priority={TaskDetails?.priority}
          rewards={TaskDetails?.rewards}
          title={TaskDetails?.name}
          status={TaskDetails?.status}
          showStatus={isCommunity}
          showDetails={false}
        />

        {/* this will probably create a bug on other parts of the descriptions */}
        <RichTextEditor isReadOnly initialData={parsedTaskDescription} />

        <Text mt="6" fontSize="2xl" fontWeight="bold">
          Submission Requirements
        </Text>

        <Text>{TaskDetails?.evidence}</Text>
      </Skeleton>

      <HStack spacing="5" my="5">
        {isCommunity ? (
          <>
            <Button
              onClick={() => {
                logEvent(EventCategory.TASK, `Clicked on Edit task button`)
                router.push(`/community/task/edit/${taskId}`)
              }}
            >
              Edit Task
            </Button>
            <Button
              ml="5"
              onClick={() =>
                router.push(`/community/task/edit/submission/${taskId}`)
              }
            >
              Edit Submission
            </Button>
          </>
        ) : (
          <Button
            colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
            onClick={handleStartTask}
          >
            Start this task
          </Button>
        )}
        <VolunteerRegisterModal isOpen={isOpen} onClose={onClose} />
      </HStack>
    </Box>
  )
}

export default TaskDetail

export interface VolunteerRegisterModalProps {
  onClose: () => void
  isOpen: boolean
}

const VolunteerRegisterModal: React.FC<VolunteerRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter()
  const strappiUserData = getStrappiUserData()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Can not start the task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Please login or register as a volunteer to start working on this
            task
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
              mr={3}
              onClick={() => {
                logEvent(
                  EventCategory.TASK,
                  `Clicked on register button in task detail page`
                )
                router.push('/register')
              }}
            >
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
