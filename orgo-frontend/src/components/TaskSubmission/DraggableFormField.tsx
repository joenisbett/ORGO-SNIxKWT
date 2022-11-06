import React, { Dispatch, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { FieldItem } from './CreateTaskSubmission'
import { Field } from './FieldsMenu'
import FormCameraField from './Fields/FormCameraField'
import FormCheckboxField from './Fields/FormCheckboxField'
import FormDateField from './Fields/FormDateField'
import FormFileUploadField from './Fields/FormFileUploadField'
import FormMultiChoiceField from './Fields/FormMultiChoiceField'
import FormSelectField from './Fields/FormSelectField'
import FormTextAreaField from './Fields/FormTextAreaField'
import FormTextField from './Fields/FormTextField'
import FormNumberField from './Fields/FormNumberField'

export const displayFields = (
  item: FieldItem,
  index: number,
  formBuilder: boolean,
  formOptions: {
    formik?: any
    isTouched?: boolean
    isInvalid?: boolean
    errorMessage?: string
  },
  cameraState: {
    images?: string[]
    setImages?: Dispatch<React.SetStateAction<string[]>>
    urls?: string[]
    setUrls?: Dispatch<React.SetStateAction<string[]>>
  },
  fileUploadState: {
    files?: any[]
    setFiles?: Dispatch<React.SetStateAction<any[]>>
  },
  removeFormField = () => undefined,
  editFormField = () => undefined
) => {
  switch (item.type) {
    case Field.TEXT:
      return (
        <FormTextField
          name={item.label}
          label={item.label}
          placeholder={item.placeholder}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    case Field.NUMBER:
      return (
        <FormNumberField
          name={item.label}
          label={item.label}
          placeholder={item.placeholder}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    case Field.TEXTAREA:
      return (
        <FormTextAreaField
          name={item.label}
          label={item.label}
          placeholder={item.placeholder}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    case Field.DROPDOWN:
      return (
        <FormSelectField
          name={item.label}
          label={item.label}
          placeholder={item.placeholder}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          options={item.options}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    case Field.CHECKBOXES:
      return (
        <FormCheckboxField
          name={item.label}
          label={item.label}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          options={item.options}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    case Field.MULTI_CHOICE:
      return (
        <FormMultiChoiceField
          name={item.label}
          label={item.label}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          options={item.options}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    case Field.CAMERA:
      return (
        <FormCameraField
          name={item.label}
          label={item.label}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          formBuilder={formBuilder}
          formOptions={formOptions}
          cameraState={cameraState}
        />
      )
    case Field.FILE_UPLOAD:
      return (
        <FormFileUploadField
          name={item.label}
          label={item.label}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          formBuilder={formBuilder}
          formOptions={formOptions}
          fileUploadState={fileUploadState}
          howMany={item.howMany}
          isRequired={item.isRequired}
        />
      )
    case Field.DATE:
      return (
        <FormDateField
          name={item.label}
          label={item.label}
          helperText={item.helperText}
          index={index}
          removeFormField={removeFormField}
          editFormField={editFormField}
          formBuilder={formBuilder}
          formOptions={formOptions}
        />
      )
    default:
      return null
  }
}

const DraggableFormField = ({
  item,
  index,
  moveListItem,
  removeFormField,
  editFormField,
}) => {
  // useDrag - the list item is draggable
  const [{ isDragging }, dragRef] = useDrag({
    type: 'item',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // useDrop - the list item is also a drop area
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [spec, dropRef] = useDrop({
    accept: 'item',
    hover: (item: any, monitor) => {
      const dragIndex = item.index
      const hoverIndex = index
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const hoverActualY = monitor.getClientOffset().y - hoverBoundingRect.top

      // if dragging down, continue only when hover is smaller than middle Y
      if (dragIndex < hoverIndex && hoverActualY < hoverMiddleY) return
      // if dragging up, continue only when hover is bigger than middle Y
      if (dragIndex > hoverIndex && hoverActualY > hoverMiddleY) return

      moveListItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  // Join the 2 refs together into one (both draggable and can be dropped on)
  const ref = useRef(null)
  const dragDropRef = dragRef(dropRef(ref))

  // Make items being dragged transparent, so it's easier to see where we drop them
  const opacity = isDragging ? 0 : 1

  return (
    <div
      ref={dragDropRef as any}
      style={{
        opacity,
      }}
    >
      {displayFields(
        item,
        index,
        true,
        {},
        {},
        {},
        removeFormField,
        editFormField
      )}
    </div>
  )
}

export default DraggableFormField
