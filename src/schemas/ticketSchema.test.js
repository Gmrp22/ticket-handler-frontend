import { describe, expect, it } from 'vitest'
import { ticketSchema } from './ticketSchema'

const validTicket = {
  code: '1234567',
  date: '2023-03-01',
  supplierId: 1,
  landId: 1,
  items: [{ productId: 1, quantity: 100, price: 0.7 }],
}

// Shows each error as "path: message"
const errorsOf = (input) => {
  const result = ticketSchema.safeParse(input)
  return result.success ? [] : result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`)
}

describe('ticketSchema', () => {
  it('accepts a valid ticket', () => {
    expect(ticketSchema.safeParse(validTicket).success).toBe(true)
  })

  it('accepts several items, even of the same product', () => {
    const items = [
      { productId: 1, quantity: 10, price: 1 },
      { productId: 1, quantity: 5, price: 2 },
    ]
    expect(ticketSchema.safeParse({ ...validTicket, items }).success).toBe(true)
  })

  it('trims the code', () => {
    const result = ticketSchema.parse({ ...validTicket, code: '  GPE01  ' })
    expect(result.code).toBe('GPE01')
  })

  it('asks for every required field', () => {
    const errors = errorsOf({
      code: '',
      date: '',
      supplierId: NaN,
      landId: NaN,
      items: [{ productId: NaN, quantity: NaN, price: NaN }],
    })
    expect(errors).toEqual([
      'code: Code is required',
      'date: Date is required',
      'supplierId: Select a supplier',
      'landId: Select a land',
      'items.0.productId: Select a product',
      'items.0.quantity: Enter a quantity',
      'items.0.price: Enter a price',
    ])
  })

  it('does not accept a code with only spaces', () => {
    expect(errorsOf({ ...validTicket, code: '   ' })).toEqual(['code: Code is required'])
  })

  it('accepts a quantity of 0, because the Excel has lines like that', () => {
    const items = [{ productId: 1, quantity: 0, price: 0.7 }]
    expect(ticketSchema.safeParse({ ...validTicket, items }).success).toBe(true)
  })

  it('does not accept a negative quantity', () => {
    const items = [{ productId: 1, quantity: -1, price: 0.7 }]
    expect(errorsOf({ ...validTicket, items })).toEqual(['items.0.quantity: Cannot be negative'])
  })

  it('does not accept a price of 0 or less', () => {
    const zero = [{ productId: 1, quantity: 1, price: 0 }]
    const negative = [{ productId: 1, quantity: 1, price: -1 }]
    expect(errorsOf({ ...validTicket, items: zero })).toEqual(['items.0.price: Must be greater than 0'])
    expect(errorsOf({ ...validTicket, items: negative })).toEqual(['items.0.price: Must be greater than 0'])
  })

  it('needs at least one item', () => {
    expect(errorsOf({ ...validTicket, items: [] })).toEqual(['items: Add at least one item'])
  })

  it('points to the item that is wrong', () => {
    const items = [
      { productId: 1, quantity: 1, price: 1 },
      { productId: 2, quantity: 1, price: -1 },
    ]
    expect(errorsOf({ ...validTicket, items })).toEqual(['items.1.price: Must be greater than 0'])
  })
})
