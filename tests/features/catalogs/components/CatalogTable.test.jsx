import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteCatalogItem, getCatalog } from '@/api/catalogs'
import ToastProvider from '@/components/ui/ToastProvider'
import CatalogTable from '@/features/catalogs/components/CatalogTable'

vi.mock('@/api/catalogs')

const catalog = { id: 'suppliers', label: 'Suppliers', singular: 'supplier' }
const suppliers = [
  { id: 2, code: 'SUP002', name: 'Vendor Beta' },
  { id: 1, code: 'SUP001', name: 'Vendor Alpha' },
]

const renderTable = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CatalogTable catalog={catalog} />
      </ToastProvider>
    </QueryClientProvider>,
  )
}

describe('CatalogTable', () => {
  beforeEach(() => {
    vi.mocked(getCatalog).mockResolvedValue(suppliers)
  })

  it('asks for the list by name, ascending, and shows it', async () => {
    renderTable()

    expect(await screen.findByRole('cell', { name: 'Vendor Beta' })).toBeInTheDocument()
    expect(getCatalog).toHaveBeenCalledWith('suppliers', { sort: 'name', order: 'asc' })
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('asks for the opposite order when the same column is clicked', async () => {
    renderTable()
    await screen.findByRole('cell', { name: 'Vendor Beta' })

    await userEvent.click(within(screen.getByRole('table')).getByRole('button', { name: /Name/ }))

    expect(getCatalog).toHaveBeenLastCalledWith('suppliers', { sort: 'name', order: 'desc' })
  })

  it('starts ascending when another column is clicked', async () => {
    renderTable()
    await screen.findByRole('cell', { name: 'Vendor Beta' })

    await userEvent.click(within(screen.getByRole('table')).getByRole('button', { name: /Code/ }))

    expect(getCatalog).toHaveBeenLastCalledWith('suppliers', { sort: 'code', order: 'asc' })
  })

  it('has Edit and Delete in each row, with the code of the item', async () => {
    renderTable()
    const row = (await screen.findByRole('cell', { name: 'Vendor Beta' })).closest('tr')

    expect(within(row).getByRole('button', { name: 'Edit supplier SUP002' })).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: 'Delete supplier SUP002' })).toBeInTheDocument()
  })

  it('asks for confirmation, deletes and tells it', async () => {
    vi.mocked(deleteCatalogItem).mockResolvedValue(null)
    renderTable()

    await userEvent.click(await screen.findByRole('button', { name: 'Delete supplier SUP002' }))
    expect(deleteCatalogItem).not.toHaveBeenCalled()

    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Supplier deleted')).toBeInTheDocument()
    expect(deleteCatalogItem).toHaveBeenCalledWith('suppliers', 2)
  })

  it('keeps the dialog and shows the error when the item cannot be deleted', async () => {
    vi.mocked(deleteCatalogItem).mockRejectedValue(new Error('Supplier has tickets'))
    renderTable()

    await userEvent.click(await screen.findByRole('button', { name: 'Delete supplier SUP002' }))
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))

    expect(await within(screen.getByRole('dialog')).findByRole('alert')).toHaveTextContent('Supplier has tickets')
    expect(screen.queryByText('Supplier deleted')).not.toBeInTheDocument()
  })

  it('shows the message of the API when the list fails', async () => {
    vi.mocked(getCatalog).mockRejectedValue(new Error('Could not reach the server'))
    renderTable()

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the server')
  })
})
