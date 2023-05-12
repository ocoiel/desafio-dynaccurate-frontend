"use client"

import Image from "next/image"
import { getMedicamentById } from "@/service/api"
import { useQuery } from "@tanstack/react-query"

import { Label } from "@/components/ui/label"
import { SkeletonTable } from "@/components/skeleton-table"

export default function Medicament({ params }: { params: { id: string } }) {
  const { data: medicament, isLoading } = useQuery({
    queryKey: ["medicament", params.id],
    queryFn: async () => getMedicamentById(params.id),
  })

  return (
    <div className="container max-w-3xl p-8">
      {isLoading && <SkeletonTable />}
      {medicament && (
        <div className="flex flex-col gap-4">
          <h1>{medicament.name}</h1>

          <div>
            <Label>Price</Label>
            <p>{medicament.price}</p>
          </div>

          <div>
            <Label>Description</Label>
            <p>{medicament.description}</p>
          </div>

          <div>
            <Label>Expiration date</Label>
            <p>{new Date(medicament.expiration_date).toLocaleDateString()}</p>
          </div>

          <div>
            <Image
              src={medicament.image_url}
              alt={medicament.name}
              width={300}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  )
}
