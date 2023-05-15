"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { ArrowUpIcon, X } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { useToast } from "@/hooks/use-toast"

import { Button } from "./ui/button"
import { Label } from "./ui/label"

interface FileWithPreview extends File {
  preview: string
}

interface RejectedFile {
  file: File
  errors: unknown[]
}

interface DropzoneProps {
  medicament_id: string
  className?: string
}

export const Dropzone: React.FC<DropzoneProps> = ({
  medicament_id,
  className,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [rejected, setRejected] = useState<RejectedFile[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ])
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 5000,
    onDrop,
    multiple: false,
  })

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [files])

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name))
  }

  const removeAll = () => {
    setFiles([])
    setRejected([])
  }

  const removeRejected = (name: string) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    medicament_id: string
  ) => {
    e.preventDefault()

    if (!files?.length) return

    const formData = new FormData()
    files.forEach((file) => formData.append("file", file))

    const data = await axios.put(
      `http://127.0.0.1:3333/med/${medicament_id}/upload-image`,
      formData
    )

    toast({
      title: "Imagem foi enviada com sucesso!",
    })
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, medicament_id)}>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <ArrowUpIcon className="h-5 w-5 fill-current" />
          {isDragActive ? (
            <p>Solte aqui! 🚀</p>
          ) : (
            <p>Arraste e solte a imagem aqui 🖼</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className="mt-10">
        {/* Accepted files */}
        {files.length > 0 && (
          <>
            <div className="flex gap-4">
              <h2 className="title text-xl font-semibold">Pré-visualização</h2>
              <Button type="button" onClick={removeAll} variant={"secondary"}>
                Remova os arquivos
              </Button>
              <Button
                type="submit"
                className="ml-auto mt-1 rounded-md border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-neutral-500 transition-colors hover:bg-purple-400 hover:text-white"
              >
                Enviar
              </Button>
            </div>
            <Label>Imagens</Label>
            <ul className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="relative h-32 rounded-md shadow-lg"
                >
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={100}
                    height={100}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview)
                    }}
                    className="h-full w-full rounded-md object-contain"
                  />
                  <button
                    type="button"
                    className="border-secondary-400 bg-secondary-400 absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border transition-colors hover:bg-white"
                    onClick={() => removeFile(file.name)}
                  >
                    <X className="hover:fill-secondary-400 h-5 w-5 fill-white transition-colors" />
                  </button>
                  <p className="mt-2 text-[12px] font-medium text-neutral-500">
                    {file.name}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Rejected Files */}
        {rejected.length > 0 && (
          <>
            <Label className="title mt-24 border-b pb-3 text-lg font-semibold text-neutral-600">
              Esses arquivos não podem...
            </Label>
            <ul className="mt-6 flex flex-col">
              {rejected.map(({ file, errors }) => (
                <li
                  key={file.name}
                  className="flex items-start justify-between"
                >
                  <div>
                    <p className="mt-2 text-sm font-medium text-neutral-500">
                      {file.name}
                    </p>
                    <ul className="text-[12px] text-red-400">
                      {errors.map((error: any) => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="border-secondary-400 hover:bg-secondary-400 mt-1 rounded-md border px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-neutral-500 transition-colors hover:text-white"
                    onClick={() => removeRejected(file.name)}
                  >
                    Remova
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </form>
  )
}
