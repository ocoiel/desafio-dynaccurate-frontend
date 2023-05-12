"use client"

import { useState } from "react"
import { updateMedicament } from "@/service/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Row } from "@tanstack/react-table"
import { Copy, MoreHorizontal, Pencil, Star, Tags, Trash } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const med = row.original as Medicament

  const [showModal, setShowModal] = useState(false)
  const [drug, setDrug] = useState(med)

  const queryClient = useQueryClient()

  interface Medicament {
    id: string
    name: string
    price: number
    expiration_date: Date
    image_url: string
  }

  const { mutate } = useMutation({
    mutationFn: async (medicament: Medicament) =>
      updateMedicament(medicament, med.id),
    onMutate: async (medicament) => {
      await queryClient.cancelQueries({
        queryKey: ["medicament"],
      })

      const previousMedicament = queryClient.getQueryData<Medicament[]>([
        "medicament",
      ])

      // optmistic update
      if (previousMedicament) {
        const newMedicaments: Medicament[] = previousMedicament.map((old) => {
          if (old.id === medicament.id) {
            return medicament
          } else return old
        })
        queryClient.setQueryData(["medicament"], newMedicaments)
      }

      toast({
        title: `Medicamento ${medicament.name}`,
        description: `Medicamento ${medicament.name} foi atualizado com sucesso  ㊙（◉）`,
      })

      return { previousMedicament }
    },
    onError: (err, medicament, context) => {
      queryClient.setQueryData<Medicament[]>(
        ["medicament"],
        context?.previousMedicament
      )
      toast({
        title: `Medicamento ${medicament.name}`,
        description: `Medicamento ${medicament.name} não foi atualizado. Erro: ${err} ㊙（◉）`,
      })
      console.log("Erro: ", err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["medicament"] })
    },
  })

  const { toast } = useToast()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowModal(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Ver mais detalhes
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              toast({
                title: `Medicamento favoritado`,
                description: `Medicamento de id ${med.id} foi colocado na sua lista de favoritos 🎉`,
              })
            }}
          >
            <Star className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Favoritar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Labels
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <DropdownMenuRadioGroup>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Deletar
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showModal && (
        <Dialog open={showModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar medicamento - {med.name}</DialogTitle>
              <DialogDescription>
                Preencha com as modificacoes que voce deseja fazer. ID: {med.id}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  mutate(drug)
                  setShowModal(false)
                }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="name"></Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={med.name}
                  onChange={(e) => setDrug({ ...drug, name: e.target.value })}
                />

                <Label htmlFor="price"></Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={med.price}
                  onChange={(e) =>
                    setDrug({ ...drug, price: Number(e.target.value) })
                  }
                />

                <Label htmlFor="expiration_date"></Label>
                <Input
                  id="expiration_date"
                  type="date"
                  name="expiration_date"
                  defaultValue={new Date(
                    med.expiration_date
                  ).toLocaleDateString()}
                  onChange={(e) =>
                    setDrug({
                      ...drug,
                      expiration_date: new Date(e.target.value),
                    })
                  }
                />
                <Label htmlFor="image_url"></Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="text"
                  defaultValue={med.image_url!}
                  onChange={(e) =>
                    setDrug({ ...drug, image_url: e.target.value })
                  }
                />
                <Button type="submit">Atualizar</Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant={"secondary"}
                >
                  Fechar
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
