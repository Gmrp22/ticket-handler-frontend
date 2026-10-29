import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DataTable from './DataTable'

const columns = [
  { header: 'Code', sortKey: 'code', render: (row) => row.code },
  { header: 'Name', render: (row) => row.name },
]
const rows = [
  { id: 1, code: 'SUP001', name: 'Vendor A' },
  { id: 2, code: 'SUP002', name: 'Vendor B' },
]

const renderTable = (props) =>
  render(
    <DataTable caption="Suppliers" columns={columns} rows={rows} getRowKey={(row) => row.id} {...props} />,
  )

describe('DataTable', () => {
  it('shows the headers and the rows', () => {
    renderTable()

    expect(screen.getByRole('table', { name: 'Suppliers' })).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getByRole('cell', { name: 'Vendor A' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'SUP002' })).toBeInTheDocument()
  })

  it('shows the message when there are no rows', () => {
    renderTable({ rows: [], emptyMessage: 'No suppliers found' })

    expect(screen.getByText('No suppliers found')).toBeInTheDocument()
  })

  it('makes a header clickable only when the column has a sortKey', () => {
    renderTable({ sort: { key: 'code', order: 'asc' }, onSort: vi.fn() })

    expect(screen.getByRole('button', { name: /Code/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Name/ })).not.toBeInTheDocument()
  })

  it('calls onSort with the key of the column', async () => {
    const onSort = vi.fn()
    renderTable({ sort: { key: 'date', order: 'desc' }, onSort })

    await userEvent.click(screen.getByRole('button', { name: /Code/ }))

    expect(onSort).toHaveBeenCalledWith('code')
  })

  it('tells the active order to screen readers', () => {
    renderTable({ sort: { key: 'code', order: 'asc' }, onSort: vi.fn() })
    expect(screen.getByRole('columnheader', { name: /Code/ })).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByRole('columnheader', { name: /Name/ })).not.toHaveAttribute('aria-sort')
  })

  it('marks descending order', () => {
    renderTable({ sort: { key: 'code', order: 'desc' }, onSort: vi.fn() })
    expect(screen.getByRole('columnheader', { name: /Code/ })).toHaveAttribute('aria-sort', 'descending')
  })

  it('shows plain headers when no onSort is given', () => {
    renderTable()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
