import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCatalogItem, updateCatalogItem } from '@/api/catalogs'
import { ApiError } from '@/api/client'
import ToastProvider from '@/components/ui/ToastProvider'
import CatalogFormModal from '@/features/catalogs/components/CatalogFormModal'

vi.mock('@/api/catalogs')

const catalog = { id: 'suppliers', label: 'Suppliers', singular: 'supplier' }

const renderForm = ({ item = null, onClose = vi.fn() } = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CatalogFormModal catalog={catalog} item={item} onClose={onClose} />
      </ToastProvider>
    </QueryClientProvider>,
  )
  return { onClose }
}

describe('CatalogFormModal', () => {
  beforeEach(() => {
    vi.mocked(createCatalogItem).mockResolvedValue({ id: 1 })
    vi.mocked(updateCatalogItem).mockResolvedValue({ id: 1 })
  })

  it('asks for the required fields and does not send anything', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Code is required')).toBeInTheDocument()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(createCatalogItem).not.toHaveBeenCalled()
  })

  it('creates the item and closes', async () => {
    const { onClose } = renderForm()

    await userEvent.type(screen.getByLabelText('Code'), 'SUP999')
    await userEvent.type(screen.getByLabelText('Name'), 'New Vendor')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(createCatalogItem).toHaveBeenCalledWith('suppliers', { code: 'SUP999', name: 'New Vendor' })
  })

  it('tells that the item was created', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Code'), 'SUP999')
    await userEvent.type(screen.getByLabelText('Name'), 'New Vendor')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Supplier created')).toBeInTheDocument()
  })

  it('tells that the item was updated', async () => {
    renderForm({ item: { id: 4, code: 'SUP004', name: 'Vendor Delta Co' } })

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Supplier updated')).toBeInTheDocument()
  })

  it('does not tell anything when the save fails', async () => {
    vi.mocked(createCatalogItem).mockRejectedValue(new ApiError(409, 'Supplier code already exists'))
    renderForm()

    await userEvent.type(screen.getByLabelText('Code'), 'SUP009')
    await userEvent.type(screen.getByLabelText('Name'), 'Repeated')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await screen.findByRole('alert')
    expect(screen.queryByText('Supplier created')).not.toBeInTheDocument()
  })

  it('has the data of the item when it is edited, and updates it', async () => {
    const { onClose } = renderForm({ item: { id: 4, code: 'SUP004', name: 'Vendor Delta Co' } })

    expect(screen.getByRole('dialog', { name: 'Edit supplier' })).toBeInTheDocument()
    expect(screen.getByLabelText('Code')).toHaveValue('SUP004')

    await userEvent.clear(screen.getByLabelText('Name'))
    await userEvent.type(screen.getByLabelText('Name'), 'Vendor Delta')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onClose).toHaveBeenCalled())
    expect(updateCatalogItem).toHaveBeenCalledWith('suppliers', 4, {
      code: 'SUP004',
      name: 'Vendor Delta',
    })
  })

  it('shows the error of the API and stays open', async () => {
    vi.mocked(createCatalogItem).mockRejectedValue(new ApiError(409, 'Supplier code already exists'))
    const { onClose } = renderForm()

    await userEvent.type(screen.getByLabelText('Code'), 'SUP009')
    await userEvent.type(screen.getByLabelText('Name'), 'Repeated')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Supplier code already exists')
    expect(onClose).not.toHaveBeenCalled()
  })
})
