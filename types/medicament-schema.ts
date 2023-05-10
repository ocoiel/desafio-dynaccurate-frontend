import { z } from "zod"

export const medSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  expiration_date: z.string(),
  status: z.string().nullish(),
  image_url: z.string().nullish(),
  label: z.string().nullish(),
  priority: z.string().nullish(),
  description: z.string().nullish(),
})

export type Medicaments = z.infer<typeof medSchema>
