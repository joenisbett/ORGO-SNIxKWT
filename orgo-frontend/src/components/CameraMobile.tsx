import { Box, Button, Divider, Flex, VStack } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useUploadEvidenceImage } from '../data/hooks/mutations/useUploadEvidenceImages'

interface CameraMobileProps {
  urls: string[]
  setUrls: React.Dispatch<React.SetStateAction<string[]>>
  images: string[]
  setImages: React.Dispatch<React.SetStateAction<string[]>>
}

export const CameraMobile: React.FC<CameraMobileProps> = ({
  setUrls,
  urls,
  images,
  setImages,
}) => {
  const inputRef = useRef(null)

  const [files, setFiles] = useState<File[]>([])

  const { mutate: uploadFileHandler, isLoading } = useUploadEvidenceImage()

  const uploadFile = (file: any) => {
    if (file) {
      uploadFileHandler(file, {
        onSuccess: (url) => {
          setUrls([...urls, file])
          setImages([...images, url])
        },
      })
    }
  }

  const handleCameraOpen = () => {
    inputRef.current.click()
  }

  const handleFileChange = (event) => {
    const fileObj = event.target.files && event.target.files[0]
    if (!fileObj) {
      return
    }

    // reset file input
    event.target.value = null

    setFiles((prevValue) => [...prevValue, fileObj])
    uploadFile(fileObj)
  }

  return (
    <Box>
      <Flex my="2">
        <Button
          display="inline"
          onClick={handleCameraOpen}
          isLoading={isLoading}
        >
          Open Camera
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          capture
          hidden
        />
      </Flex>
      {files.length ? (
        <VStack>
          {files.map((file) => {
            return (
              <Box key={file.name + file.size} my="4">
                <Button
                  onClick={() =>
                    setFiles((prev) =>
                      prev.filter(
                        (item) =>
                          item.name + item.size !== file.name + file.size
                      )
                    )
                  }
                >
                  Remove This Image
                </Button>
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <Divider />
              </Box>
            )
          })}
        </VStack>
      ) : null}
    </Box>
  )
}
