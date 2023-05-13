import { useState } from "react"
import FilePondePluginFileEncode from "filepond-plugin-file-encode"
// Import FilePond styles
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size"
import FilePondPluginImageEdit from "filepond-plugin-image-edit"
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation"
import FilePondPluginImagePreview from "filepond-plugin-image-preview"
import { FilePond, registerPlugin } from "react-filepond"

import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css"

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateSize,
  FilePondPluginImageEdit,
  FilePondePluginFileEncode
)

export function Uploader({
  medicament_id,
}: {
  medicament_id: string | undefined
}) {
  const [files, setFiles] = useState<any>()

  return (
    <>
      {!medicament_id ? (
        <>koe cara ta de zoas ne</>
      ) : (
        <FilePond
          files={files}
          className={"filepond"}
          name="filepond"
          allowImageEdit
          imageEditAllowEdit
          instantUpload={false}
          allowImagePreview
          allowProcess
          acceptedFileTypes={["image/*"]}
          oninit={() => console.log("FilePond initialized")}
          onaddfile={() => console.log("File added")}
          allowFileSizeValidation
          allowImageExifOrientation
          allowFileEncode
          onupdatefiles={(file) => {
            setFiles(file)
            console.log(file)
          }}
          labelIdle='Arraste e solte uma imagem aqui ou <span class="filepond--label-action">Procurar</span>'
          server={{
            process: {
              url: `http://127.0.0.1:3333/med/${medicament_id}/upload-image`,
              method: "PUT",
              headers: {
                "Content-Type": "mutlipart/form-data",
              },
              ondata(data) {
                console.log("process server filepond: ", data)
                data.append("medicament_id", medicament_id)
                return data
              },
              onload(response) {
                console.log("response onload: ", response)
                return response
              },
            },
          }}
        />
      )}
    </>
  )
}
