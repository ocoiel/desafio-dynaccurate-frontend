import { Dropzone } from "@/components/uploader"

export default function UpPage({ params }: { params: { id: string } }) {
  return (
    <>
      param id: {params.id}
      <Dropzone
        medicament_id={params.id}
        className="mt-10 border border-neutral-200 p-16 dark:bg-neutral-800"
      />
    </>
  )
}
