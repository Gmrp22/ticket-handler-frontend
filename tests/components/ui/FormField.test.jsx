import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FormField from '@/components/ui/FormField'

describe('FormField', () => {
  it('links the label to the input', () => {
    render(
      <FormField label="Name">
        <input />
      </FormField>,
    )

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('has no error mark when there is no error', () => {
    render(
      <FormField label="Name">
        <input />
      </FormField>,
    )

    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-describedby')
  })

  it('shows the error and links it to the input', () => {
    render(
      <FormField label="Name" error="Name is required">
        <input />
      </FormField>,
    )

    const input = screen.getByLabelText('Name')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription(/Name is required/)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('does not read the error as part of the name of the input', () => {
    render(
      <FormField label="Name" error="Name is required">
        <input />
      </FormField>,
    )

    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
  })
})
