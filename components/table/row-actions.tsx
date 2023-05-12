"use client"

import { FormEvent, useState } from "react"
import { DialogClose } from "@radix-ui/react-dialog"
import { Row } from "@tanstack/react-table"
import { Copy, MoreHorizontal, Pencil, Star, Tags, Trash } from "lucide-react"

import { Medicaments, medSchema } from "@/types/medicament-schema"
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

function updateMedicament(
  e: React.FormEvent<HTMLFormElement>,
  medicament_id: string
) {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const name = formData.get("name") as string
  const price = formData.get("price") as string
  const expiration_date_string = formData.get("expiration_date") as string
  const expiration_date = new Date(expiration_date_string)
  const image_url = formData.get("image_url") as string

  const med = {
    medicament_id,
    name,
    price,
    expiration_date,
    image_url,
  }

  // fetch(`http://127.0.0.1:3333/med/${med.id}/update`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     id: formData.get("name"),
  //     name: med.name,
  //     price: med.price,
  //     expiration_date: new Date(med.expiration_date),
  //     image_url: "https://picsum.photos/200",
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then((data) => console.log(data))
  //   .catch((err) => console.error(err))

  console.log(med)
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [showModal, setShowModal] = useState(false)
  const med = medSchema.parse(row.original)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowModal(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Make a copy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Star className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Labels
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <DropdownMenuRadioGroup value={med.label!}>
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
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showModal && (
        <Dialog open={showModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your{" "}
                {med.id}
                {/* account and remove your data from our servers. {medicament_id} */}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <form
                onSubmit={(e) => updateMedicament(e, med.id)}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="name"></Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={med.name}
                />

                <Label htmlFor="price"></Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={med.price}
                />

                <Label htmlFor="expiration_date"></Label>
                <Input
                  id="expiration_date"
                  type="date"
                  name="expiration_date"
                  defaultValue={med.expiration_date}
                />
                <Label htmlFor="image_url"></Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="text"
                  defaultValue={med.image_url!}
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
