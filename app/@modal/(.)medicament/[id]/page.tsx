"use client"

import { useEffect, useState } from "react"

import { Medicaments, medSchema } from "@/types/medicament-schema"
import { fetcher } from "@/lib/fetcher"

export default function Medicament({ params }: { params: { id: string } }) {
  const [med, setMed] = useState<Medicaments>()

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetcher<Medicaments>(`/api/medicament/${params.id}`)
      setMed(data)
    }
  }, [params.id])

  return (
    <div>
      amor
      <h1>oi {params.id}</h1>
      <p>{med && med.name}</p>
    </div>
  )
}
