import React, { useState } from "react"
import { Uppy, UppyFile } from "@uppy/core"
import { DragDrop } from "@uppy/react"
import XHRUpload from "@uppy/xhr-upload"

type Props = {
  endpoint: string
}

const Uploader: React.FC<Props> = ({ endpoint }) => {
  const [uppy, setUppy] = useState<Uppy>()

  const handleUpload = async (files: UppyFile[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("file", file.data, file.name)
    })

    try {
      const response = await uppy?.addFile(formData)
      console.log("Upload successful:", response)
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const initializeUppy = () => {
    const uppyInstance = new Uppy({
      id: "uppy",
      allowMultipleUploads: true,
      autoProceed: false,
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxNumberOfFiles: 5,
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".pdf"],
      },
    })

    uppyInstance.use(XHRUpload, {
      endpoint,
      formData: true,
      fieldName: "file",
      headers: {
        Authorization: "Bearer YOUR_ACCESS_TOKEN_HERE",
      },
    })

    setUppy(uppyInstance)
  }

  return (
    <div>
      <DragDrop
        uppy={uppy}
        onDragOver={() => {}}
        onDragLeave={() => {}}
        onDrop={handleUpload}
      />

      <button onClick={() => uppy?.upload()}>Upload</button>
    </div>
  )
}

export default Uploader
