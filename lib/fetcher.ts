import { Medicaments } from "@/types/medicament-schema"

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const data = (await res.json()) as T

  return data
}

export interface RequestAPI {
  items: Medicaments[]
  total: number
  page: number
  size: number
  pages: number
}
