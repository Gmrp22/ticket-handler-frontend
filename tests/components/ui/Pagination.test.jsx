import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Pagination from '@/components/ui/Pagination'

describe('Pagination', () => {
  it('shows the current page and the total', () => {
    render(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
  })

  it('goes to the previous and the next page', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3)
  })

  it('disables Previous on the first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('disables Next on the last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled()
  })
})
