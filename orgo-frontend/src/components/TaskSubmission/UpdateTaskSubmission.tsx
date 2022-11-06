import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
// import { FiCopy } from 'react-icons/fi'
import { IoMdAdd } from 'react-icons/io'
// import { RiDeleteBinLine } from 'react-icons/ri'
import {
  // useCreateTaskSubmission,
  // useDeleteTaskSubmission,
  useUpdateTaskSubmission,
} from '../../data/hooks/mutations/useTaskSubmission'
import { useGetTaskSubmissionByTaskId } from '../../data/hooks/query/useGetTaskSubmission'
import getStrappiUserData from '../../data/utils/strappiUserData'
import { FieldItem } from './CreateTaskSubmission'
import DraggableFormField from './DraggableFormField'
import EditableFieldsDrawer, { DrawerType } from './EditableFieldsDrawer'
import FieldsMenu, { Field } from './FieldsMenu'

const UpdateTaskSubmission = () => {
  const strappiUserData = getStrappiUserData()
  const router = useRouter()

  // States
  const drawerTypeRef = useRef<DrawerType>('Add')
  const fieldTypeRef = useRef<string>(Field.TEXT)
  const [formFields, setFormFields] = useState<FieldItem[]>([])
  const [editFieldIndex, setEditFieldIndex] = useState<number>(undefined)
  const [enableTagging, setEnableTagging] = useState(false)

  const editFormField = (fieldType: string, index: number) => {
    drawerTypeRef.current = 'Edit'
    fieldTypeRef.current = fieldType
    setEditFieldIndex(index)
    onDrawerOpen()
  }
  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index))
  }

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure()

  const moveFormListField = useCallback(
    (dragIndex, hoverIndex) => {
      const dragItem = formFields[dragIndex]
      const hoverItem = formFields[hoverIndex]

      // Swap places of dragItem and hoverItem in the array
      setFormFields((prevValue) => {
        const updatedFormFields = [...prevValue]
        updatedFormFields[dragIndex] = hoverItem
        updatedFormFields[hoverIndex] = dragItem
        return updatedFormFields
      })
    },
    [formFields]
  )

  // APIs
  const updateTaskSubmission = useUpdateTaskSubmission(() => {
    getTaskSubmission.remove()
  })

  // const deleteTaskSubmission = useDeleteTaskSubmission()
  // const createTaskSubmission = useCreateTaskSubmission(true)

  const handleSubmit = () => {
    let updatedFormFields = formFields

    let isEnabledTagging = false
    updatedFormFields.forEach((item) => {
      if (item.type === 'tag-volunteers') {
        isEnabledTagging = true
      }
    })

    if (enableTagging !== isEnabledTagging) {
      if (!enableTagging && isEnabledTagging) {
        updatedFormFields = formFields.filter(
          (item) => item.type !== 'tag-volunteers'
        )
      }

      if (enableTagging && !isEnabledTagging) {
        updatedFormFields.push({
          label: 'Tag volunteers',
          isRequired: false,
          type: 'tag-volunteers',
        })
      }
    }

    updateTaskSubmission.mutate({
      data: updatedFormFields,
      id: getTaskSubmission.data?._id,
    })
  }

  // const handleDeleteSubmission = () => {
  //   deleteTaskSubmission.mutate(getTaskSubmission.data?._id)
  // }

  const getTaskSubmission = useGetTaskSubmissionByTaskId(
    router.query.id as string
  )

  useEffect(() => {
    if (router.query.id) {
      getTaskSubmission.refetch()
    }
  }, [router.query.id])

  useEffect(() => {
    setFormFields(getTaskSubmission.data?.formTemplate || [])

    let isEnabledTagging = false
    getTaskSubmission.data?.formTemplate.forEach((item) => {
      if (item.type === 'tag-volunteers') {
        isEnabledTagging = true
      }
    })

    setEnableTagging(isEnabledTagging)
  }, [getTaskSubmission.data?.formTemplate])

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">
          Customize Task Submission
        </Text>
        <div>
          {/* <IconButton
            colorScheme="red"
            size="sm"
            mr="2"
            aria-label="Delete this submission"
            icon={<RiDeleteBinLine />}
            onClick={handleDeleteSubmission}
          /> */}
          {/* <IconButton
            size="sm"
            mr="2"
            aria-label="Copy this template"
            icon={<FiCopy fontSize={16} />}
            onClick={() => {
              createTaskSubmission.mutate({
                data: formFields,
                taskId: getTaskSubmission.data?._id,
              })
            }}
          /> */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<IoMdAdd size={23} />}
              aria-label="Add Field"
              size="sm"
            />
            <FieldsMenu
              onDrawerOpen={onDrawerOpen}
              drawerTypeRef={drawerTypeRef}
              fieldTypeRef={fieldTypeRef}
            />
          </Menu>
        </div>
      </Box>

      <FormControl display="flex" alignItems="center" my="4">
        <Switch
          mr="3"
          id="tag-volunteers"
          onChange={(e) => setEnableTagging(e.target.checked)}
          isChecked={enableTagging}
        />
        <FormLabel htmlFor="tag-volunteers" mb="0">
          Enable tagging other volunteers?
        </FormLabel>
      </FormControl>

      <Box my="3" bgColor="gray.200" borderRadius="5px" p="4" minHeight="96">
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
          <form>
            {formFields.length
              ? formFields.map((item, index) => (
                  <DraggableFormField
                    key={item.label + index}
                    item={item}
                    index={index}
                    moveListItem={moveFormListField}
                    removeFormField={removeFormField}
                    editFormField={editFormField}
                  />
                ))
              : null}
          </form>
        </DndProvider>

        <Menu>
          <MenuButton as={Button} width="100%">
            <Box display="inline" mr="1">
              +
            </Box>{' '}
            Add Field
          </MenuButton>
          <FieldsMenu
            onDrawerOpen={onDrawerOpen}
            drawerTypeRef={drawerTypeRef}
            fieldTypeRef={fieldTypeRef}
          />
        </Menu>
        {formFields.length ? (
          <Button
            width="100%"
            mt="3"
            colorScheme={strappiUserData.attributes?.brand_color || 'blue'}
            onClick={handleSubmit}
            isLoading={updateTaskSubmission.isLoading}
          >
            Update Task Submission
          </Button>
        ) : null}
      </Box>
      <EditableFieldsDrawer
        drawerType={drawerTypeRef.current}
        fieldType={fieldTypeRef.current}
        isOpen={isDrawerOpen}
        onClose={onDrawerClose}
        formFields={formFields}
        setFormFields={setFormFields}
        editFieldIndex={editFieldIndex}
        setEditFieldIndex={setEditFieldIndex}
      />
    </>
  )
}

export default UpdateTaskSubmission
