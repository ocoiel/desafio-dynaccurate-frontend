"use client"

import Image from "next/image"
import Link from "next/link"

import { Medicaments } from "@/types/medicament-schema"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default async function Medicament({
  params,
}: {
  params: { id: string }
}) {
  const med = await fetcher<Medicaments>(
    `http://127.0.0.1:3333/med/${params.id}`
  )

  return (
    <Dialog open={true}>
      <DialogContent className="sm:px-10 sm:py-8">
        <DialogHeader>
          <DialogTitle>Medicamento - {med?.name}</DialogTitle>
          <DialogDescription>
            Aqui vai uma descricao qualquer do medicamento.
            <Link href={"/"}>VOLTAR TESTE</Link>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <h3 className="text-lg font-semibold ">Nome: </h3>
            <span className="text-base text-foreground">{med?.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <h3 className="text-lg font-semibold ">Preço: </h3>
            <span className="text-base text-foreground">{med?.price}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <h3 className="text-lg font-semibold ">Data de validade: </h3>
            <span className="text-base text-foreground">
              {new Date(med?.expiration_date).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <h3 className="text-lg font-semibold ">Imagem: </h3>
            <Image src={med.image_url!} fill={true} alt={med?.name} />
          </div>
        </div>
        <DialogFooter>
          <Button>
            <Link href={`/medicament/${med?.id}/`}>Ver mais detalhes</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
