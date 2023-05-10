"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Medicaments } from "@/types/medicament-schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader } from "./colmun-header"
import { labels, priorities, statuses } from "./data"
import { DataTableRowActions } from "./row-actions"

export const columns: ColumnDef<Medicaments>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identificação" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        className="items-center justify-center"
        column={column}
        title="Imagem"
      />
    ),
    cell: ({ row }) => {
      const image = row.original.image_url

      if (!image) return null

      let fallback = row.getValue("name") as string
      if (fallback.split(" ").length > 1) {
        fallback =
          fallback.split(" ")[0].charAt(0) + fallback.split(" ")[1].charAt(0)
      } else {
        fallback = fallback.split(" ")[0].charAt(0)
      }

      return (
        <div className="flex w-[80px] items-center justify-center space-x-2">
          <Avatar className="h-10 w-10 object-contain">
            <AvatarImage src={image} alt={"Deus é bom"} />
            <AvatarFallback>{fallback.toLocaleUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preço" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center">
        <span>R$ {row.getValue("price")}</span>
      </div>
    ),
  },
  {
    accessorKey: "expiration_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de validade" />
    ),
    cell: ({ row }) => (
      <div className="flex w-[100px] items-center justify-center">
        <span>
          {new Date(row.getValue("expiration_date")).toLocaleDateString(
            "pt-BR"
          )}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
