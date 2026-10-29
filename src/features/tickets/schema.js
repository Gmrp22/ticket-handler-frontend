import { z } from 'zod'

// Selects and number inputs are read with `valueAsNumber`, so an empty one is NaN
export const ticketSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  date: z.string().min(1, 'Date is required'),
  supplierId: z.number({ error: 'Select a supplier' }),
  landId: z.number({ error: 'Select a land' }),
  items: z
    .array(
      z.object({
        productId: z.number({ error: 'Select a product' }),
        // 0 is allowed, like the API: the Excel has lines with quantity 0
        quantity: z.number({ error: 'Enter a quantity' }).min(0, 'Cannot be negative'),
        price: z.number({ error: 'Enter a price' }).positive('Must be greater than 0'),
      }),
    )
    .min(1, 'Add at least one item'),
})
