import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import TicketItemsEditor from './TicketItemsEditor'

const PRODUCTS = [
  { id: 1, code: 'PRD001', name: 'Product Alpha' },
  { id: 2, code: 'PRD003', name: 'Product Gamma' },
]

// The editor needs the control of a form, so it is rendered inside one
function Form({ errors = {} }) {
  const { register, control } = useForm({
    defaultValues: { items: [{ productId: '', quantity: '', price: '' }] },
  })
  return <TicketItemsEditor control={control} register={register} errors={errors} products={PRODUCTS} />
}

describe('TicketItemsEditor', () => {
  it('starts with one item and the products in the select', () => {
    render(<Form />)

    expect(screen.getAllByLabelText('Product')).toHaveLength(1)
    expect(screen.getByRole('option', { name: 'PRD001 - Product Alpha' })).toBeInTheDocument()
  })

  it('does not allow to remove the last item', () => {
    render(<Form />)

    expect(screen.getByRole('button', { name: 'Remove item 1' })).toBeDisabled()
  })

  it('adds and removes items', async () => {
    render(<Form />)

    await userEvent.click(screen.getByRole('button', { name: '+ Add item' }))
    expect(screen.getAllByLabelText('Product')).toHaveLength(2)

    await userEvent.click(screen.getByRole('button', { name: 'Remove item 1' }))
    expect(screen.getAllByLabelText('Product')).toHaveLength(1)
  })

  it('calculates the subtotal of an item', async () => {
    render(<Form />)

    await userEvent.type(screen.getByLabelText('Quantity'), '10')
    await userEvent.type(screen.getByLabelText('Price'), '2.5')

    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('shows $0.00 while the item is incomplete', () => {
    render(<Form />)

    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('does not let write a negative number', async () => {
    render(<Form />)
    const quantity = screen.getByLabelText('Quantity')

    await userEvent.type(quantity, '-5')

    expect(quantity).toHaveValue(5)
  })

  it('shows the errors of the items', () => {
    render(<Form errors={{ items: { 0: { price: { message: 'Must be greater than 0' } } } }} />)

    expect(screen.getByLabelText('Price')).toBeInvalid()
    expect(screen.getByText('Must be greater than 0')).toBeInTheDocument()
  })
})
