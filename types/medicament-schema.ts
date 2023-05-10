import { z } from "zod"

export const medSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  description: z.string().nullish(),
  expirationDate: z.string(),
  price: z.number(),
  imageUrl: z.string().nullish(),
})

export type Task = z.infer<typeof medSchema>
