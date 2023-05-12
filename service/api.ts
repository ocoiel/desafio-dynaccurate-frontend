import axios from "axios"

import { Medicaments } from "@/types/medicament-schema"

const BASE_URL = "http://127.0.0.1:3333"

async function getMedicaments(): Promise<Medicaments[]> {
  const response = await axios.get<Medicaments[]>(`${BASE_URL}/med`)
  return response.data
}

async function getMedicamentById(medicament_id: string): Promise<Medicaments> {
  const response = await axios.get<Medicaments>(
    `${BASE_URL}/med/${medicament_id}`
  )
  return response.data
}

async function createMedicament(medicament: Medicaments): Promise<void> {
  await axios.post(`${BASE_URL}/med/create`, medicament)
}

async function updateMedicament(
  medicament: Medicaments,
  medicament_id: string
): Promise<Medicaments> {
  const response = await axios.put<Medicaments>(
    `${BASE_URL}/med/${medicament_id}/update`,
    medicament
  )
  return response.data
}

async function deleteMedicament(medicament_id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/med/${medicament_id}/delete`)
}

export {
  getMedicaments,
  getMedicamentById,
  createMedicament,
  updateMedicament,
  deleteMedicament,
}
