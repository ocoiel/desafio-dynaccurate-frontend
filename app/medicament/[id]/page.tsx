"use client"

import Image from "next/image"
import { getMedicamentById } from "@/service/api"
import { useQuery } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { SkeletonTable } from "@/components/skeleton-table"

export default function Medicament({ params }: { params: { id: string } }) {
  const { data: medicament, isLoading } = useQuery({
    queryKey: ["medicament", params.id],
    queryFn: async () => getMedicamentById(params.id),
  })

  return (
    <div className="container max-w-2xl p-8">
      {isLoading && <SkeletonTable />}
      {medicament && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <h1 className="scroll-m-20 border-b pb-2 text-4xl font-extrabold tracking-tight transition-colors hover:text-muted-foreground lg:text-5xl">
              {medicament.name}
            </h1>

            <Badge>{medicament.priority}</Badge>
            <Badge>{medicament.status}</Badge>
          </div>

          <div>
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              {medicament.description || <span>Não tem descrição</span>}
            </blockquote>
          </div>

          <div>
            <Label>Preço: </Label>
            <p>{medicament.price}</p>
          </div>

          <div>
            <Label>Data de validade: </Label>
            <p>{new Date(medicament.expiration_date).toLocaleDateString()}</p>
          </div>

          <div>
            {/* Bug with URL within Next Image Component */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={medicament.image_url}
              alt={medicament.name}
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}
