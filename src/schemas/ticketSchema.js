import { z } from 'zod'

// Selects and number inputs are read with `valueAsNumber`, so an empty one is NaN
export const ticketSchema = z.object({
  code: z.string().trim().min(1, 'Code is required'),
  date: z.string().min(1, 'Date is required'),
  supplier_id: z.number({ error: 'Select a supplier' }),
  land_id: z.number({ error: 'Select a land' }),
  items: z
    .array(
      z.object({
        product_id: z.number({ error: 'Select a product' }),
        quantity: z.number({ error: 'Enter a quantity' }).positive('Must be greater than 0'),
        price: z.number({ error: 'Enter a price' }).positive('Must be greater than 0'),
      }),
    )
    .min(1, 'Add at least one item'),
})
