"use client"

import { useRef } from "react"
import Uppy, { UploadedUppyFile } from "@uppy/core"
import DashboardPlugin from "@uppy/dashboard"
import ImageEditor from "@uppy/image-editor"
import { Dashboard, DragDrop, ProgressBar, StatusBar } from "@uppy/react"
import xhr from "@uppy/xhr-upload"

import "@uppy/core/dist/style.min.css"
import "@uppy/dashboard/dist/style.min.css"
import "@uppy/image-editor/dist/style.min.css"
import "@uppy/status-bar/dist/style.min.css"
import "@uppy/progress-bar/dist/style.min.css"
import { DashboardProps } from "@uppy/react/src/Dashboard"

interface UploaderProps {
  medicament_id: string
}
export function Uploader({ medicament_id }: UploaderProps) {
  const dashRef = useRef<DashboardProps>(null)
  const uppy = new Uppy()
    .use(DashboardPlugin, { inline: true })
    .use(ImageEditor, { target: DashboardPlugin })
    .use(xhr, {
      endpoint: `http://127.0.0.1:3333/med/${medicament_id}/upload-image`,
      method: "PUT",
      formData: true,
      responseType: "",
    })

  uppy.on("upload-success", (file, response) => {
    console.log(response)
    console.log(file)
  })

  return (
    <Dashboard
      uppy={uppy}
      id="dashboard"
      plugins={["DragDrop", "ProgressBar", "ImageEditor"]}
      theme="auto"
    />
  )
}
