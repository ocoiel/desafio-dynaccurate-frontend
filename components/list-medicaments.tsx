"use cleint"

import { getMedicaments } from "@/service/api"
import { useQuery } from "@tanstack/react-query"

import { SkeletonTable } from "./skeleton-table"
import { columns } from "./table/columns"
import { DataTable } from "./table/data-table"

export function ListMedicaments() {
  const {
    data: medicaments,
    isFetching,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["medicament"],
    queryFn: getMedicaments,
  })

  // console.log(medicaments)

  return (
    <>
      {isLoading && <>Carregando...</>}
      {isFetching && <SkeletonTable />}
      {isSuccess && !isFetching && (
        <DataTable data={medicaments} columns={columns} />
      )}
    </>
  )
}
