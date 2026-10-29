import { z } from 'zod'

// Same limits as the API: required texts, up to 255 characters
export const catalogSchema = z.object({
  code: z.string().trim().min(1, 'Code is required').max(255, 'Up to 255 characters'),
  name: z.string().trim().min(1, 'Name is required').max(255, 'Up to 255 characters'),
})
