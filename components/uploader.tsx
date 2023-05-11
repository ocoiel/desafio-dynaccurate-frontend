import { useState } from "react"
// Import FilePond styles
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size"
import FilePondPluginImageEdit from "filepond-plugin-image-edit"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import { FilePond, FilePondProps, registerPlugin } from "react-filepond"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageEdit
)

export function Uploader({ medicament_id }: { medicament_id: string }) {
  const [files, setFiles] = useState<any>()

  return (
    <>
      <FilePond
        files={files}
        className={"filepond"}
        name="filepond"
        allowImageEdit
        iconProcess="loading"
        imageEditAllowEdit
        instantUpload={false}
        allowImagePreview
        allowProcess
        oninit={() => console.log("FilePond initialized")}
        onaddfile={() => console.log("File added")}
        allowFileSizeValidation
        allowImageExifOrientation
        onupdatefiles={() => {
          setFiles(files)
          console.log(files)
        }}
        labelIdle='ALOBA or <span class="filepond--label-action">Browse</span>'
        server={{
          process: {
            url: `http://127.0.0.1:3333/med/${medicament_id}/upload-image`,
            method: "POST",
            ondata(data) {
              console.log(data)
              return data
            },
            onload(response) {
              console.log(response)
              return response
            },
          },
        }}
      />
    </>
  )
}
