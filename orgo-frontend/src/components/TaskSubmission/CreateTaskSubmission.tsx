import {
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuButton,
  Select,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react'
import { isMobile } from 'react-device-detect'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { IoMdAdd } from 'react-icons/io'
import { useGetAllTaskSubmissions } from '../../data/hooks/query/useGetTaskSubmission'
import getStrappiUserData from '../../data/utils/strappiUserData'
import DraggableFormField from './DraggableFormField'
import EditableFieldsDrawer, { DrawerType } from './EditableFieldsDrawer'
import FieldsMenu, { Field } from './FieldsMenu'

export interface FieldItem {
  type: string
  label: string
  isRequired: boolean
  placeholder?: string
  helperText?: string
  options?: string[]
  howMany?: number
}

const CreateTaskSubmission = ({
  formFields,
  setFormFields,
  handleSubmit,
  isSubmitting,
  enableTagging,
  setEnableTagging,
}: {
  formFields: FieldItem[]
  setFormFields: Dispatch<SetStateAction<FieldItem[]>>
  handleSubmit: () => void
  isSubmitting: boolean
  enableTagging: boolean
  setEnableTagging: Dispatch<SetStateAction<boolean>>
}) => {
  const strappiUserData = getStrappiUserData()

  // States
  const drawerTypeRef = useRef<DrawerType>('Add')
  const fieldTypeRef = useRef<string>(Field.TEXT)
  const [editFieldIndex, setEditFieldIndex] = useState<number>(undefined)
  const [templateId, setTemplateId] = useState('')

  const getAllTaskSubmissions = useGetAllTaskSubmissions()

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

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">
          Customize Task Submission
        </Text>
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
      </Box>
      <Box my="4">
        <FormLabel htmlFor="template">Select a template</FormLabel>
        <Select
          id="template"
          value={templateId}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          onChange={(e) => {
            setTemplateId(e.target.value)

            if (e.target.value) {
              getAllTaskSubmissions?.data?.forEach((template) => {
                if (template._id === e.target.value) {
                  setFormFields(template.formTemplate)
                }
              })
            } else {
              setFormFields([])
            }
          }}
          placeholder="Use existing submission form"
        >
          {!getAllTaskSubmissions.isLoading &&
            getAllTaskSubmissions?.data?.map((submissionTemplate) => (
              <option
                value={submissionTemplate._id}
                key={submissionTemplate._id}
              >
                {submissionTemplate.name || submissionTemplate._id}
              </option>
            ))}
        </Select>
      </Box>

      <FormControl display="flex" alignItems="center" mt="5" mb="4">
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
            isLoading={isSubmitting}
          >
            Create Task
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

export default CreateTaskSubmission
